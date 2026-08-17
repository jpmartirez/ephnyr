import asyncio
from typing import List, Any, Dict
from core.database import get_supabase_admin
from core.config import settings
from core.exceptions import QuotaExceededException, ResourceNotFoundException, EphnyrException
from schemas.document import DocumentCreate, DocumentResponse, DocumentListResponse, DocumentStatusUpdate
from services.text_extractor import extract_langchain_documents
from services.chunker import split_langchain_documents
from services.embedding_service import embedding_service

class DocumentService:
    def __init__(self):
        self.supabase = get_supabase_admin()

    async def register_document(self, user_id: str, doc_in: DocumentCreate) -> DocumentResponse:
        # 1. Enforce 5MB per file limit
        max_bytes_per_file = settings.FREE_TIER_MAX_FILE_SIZE_MB * 1024 * 1024
        if doc_in.file_size_bytes > max_bytes_per_file:
            raise QuotaExceededException(
                f"File size ({doc_in.file_size_bytes / (1024*1024):.2f} MB) exceeds "
                f"the max limit of {settings.FREE_TIER_MAX_FILE_SIZE_MB} MB per file."
            )

        # 2. Enforce 10MB total room storage limit
        docs_response = self.supabase.table("documents").select("file_size_bytes").eq("room_id", doc_in.room_id).execute()
        raw_docs = docs_response.data if isinstance(docs_response.data, list) else []
        existing_total_bytes = sum(
            int(doc.get("file_size_bytes", 0)) for doc in raw_docs if isinstance(doc, dict)
        )
        max_room_bytes = settings.FREE_TIER_MAX_ROOM_STORAGE_MB * 1024 * 1024

        if existing_total_bytes + doc_in.file_size_bytes > max_room_bytes:
            raise QuotaExceededException(
                f"Total room storage cap of {settings.FREE_TIER_MAX_ROOM_STORAGE_MB} MB exceeded. "
                "Delete existing documents to free up space."
            )

        # 3. Register document in database
        data_to_insert = {
            "room_id": doc_in.room_id,
            "file_name": doc_in.file_name,
            "file_type": doc_in.file_type,
            "file_size_bytes": doc_in.file_size_bytes,
            "storage_path": doc_in.storage_path,
            "status": "PROCESSING",
            "chunk_count": 0
        }

        response = self.supabase.table("documents").insert(data_to_insert).execute()
        if not response.data or not isinstance(response.data, list) or len(response.data) == 0:
            raise EphnyrException(status_code=500, detail="Failed to register document record.")

        first_item = response.data[0]
        if not isinstance(first_item, dict):
            raise EphnyrException(status_code=500, detail="Invalid document response payload.")

        doc_response = DocumentResponse(**first_item)

        # 4. Trigger asynchronous LangChain text extraction, chunking, and embedding generation
        asyncio.create_task(self.process_document_ingestion(doc_response.id))

        return doc_response

    async def process_document_ingestion(self, doc_id: str):
        """
        Asynchronous LangChain RAG Ingestion Pipeline:
        1. Downloads file bytes from Supabase Storage bucket 'room-documents'.
        2. Extracts text into LangChain Document objects (PDF, DOCX, TXT, MD).
        3. Chunks documents using LangChain RecursiveCharacterTextSplitter (1000 chars, 150 overlap).
        4. Generates 384-dimensional vector embeddings via LangChain FastEmbeddings interface.
        5. Inserts vector chunks into public.document_chunks.
        6. Updates document status to 'READY' and records chunk_count.
        """
        try:
            # Fetch document metadata
            doc_res = self.supabase.table("documents").select("*").eq("id", doc_id).single().execute()
            data = doc_res.data
            if not data or not isinstance(data, dict):
                return

            storage_path = str(data["storage_path"])
            room_id = str(data["room_id"])
            file_name = str(data["file_name"])
            file_type = str(data["file_type"])

            # Step 1: Download raw file bytes from storage bucket
            file_bytes = self.supabase.storage.from_("room-documents").download(storage_path)
            if not file_bytes:
                self.supabase.table("documents").update({"status": "FAILED"}).eq("id", doc_id).execute()
                return

            # Step 2: Extract LangChain Document Objects
            raw_docs = extract_langchain_documents(file_bytes, file_name, file_type)
            if not raw_docs:
                self.supabase.table("documents").update({"status": "FAILED"}).eq("id", doc_id).execute()
                return

            # Step 3: Split into LangChain Chunk Document Objects
            chunk_docs = split_langchain_documents(raw_docs, chunk_size=1000, chunk_overlap=150)
            if not chunk_docs:
                self.supabase.table("documents").update({"status": "FAILED"}).eq("id", doc_id).execute()
                return

            # Step 4: Generate 384-d Vector Embeddings using LangChain Embeddings interface
            chunk_texts = [doc.page_content for doc in chunk_docs]
            embeddings = embedding_service.embed_documents(chunk_texts)

            # Step 5: Prepare Chunk Payloads for public.document_chunks
            chunks_payload = [
                {
                    "room_id": room_id,
                    "document_id": doc_id,
                    "content": doc.page_content,
                    "metadata": {
                        **doc.metadata,
                        "file_name": file_name,
                        "chunk_index": i,
                        "total_chunks": len(chunk_docs)
                    },
                    "embedding": embedding_vector
                }
                for i, (doc, embedding_vector) in enumerate(zip(chunk_docs, embeddings))
            ]

            # Clear existing chunks if re-processing
            self.supabase.table("document_chunks").delete().eq("document_id", doc_id).execute()

            # Batch insert chunks in batches of 50
            batch_size = 50
            for start in range(0, len(chunks_payload), batch_size):
                batch = chunks_payload[start:start + batch_size]
                self.supabase.table("document_chunks").insert(batch).execute()

            # Step 6: Update Document Status to READY with chunk_count
            self.supabase.table("documents").update({
                "status": "READY",
                "chunk_count": len(chunk_docs)
            }).eq("id", doc_id).execute()

        except Exception as e:
            print(f"Error during LangChain RAG ingestion for doc {doc_id}:", e)
            try:
                self.supabase.table("documents").update({"status": "FAILED"}).eq("id", doc_id).execute()
            except Exception:
                pass

    async def get_room_documents(self, room_id: str) -> DocumentListResponse:
        response = self.supabase.table("documents").select("*").eq("room_id", room_id).order("created_at", desc=True).execute()
        raw_documents = response.data if isinstance(response.data, list) else []
        documents = [DocumentResponse(**row) for row in raw_documents if isinstance(row, dict)]
        total_bytes = sum(doc.file_size_bytes for doc in documents)
        return DocumentListResponse(
            total=len(documents),
            total_size_bytes=total_bytes,
            documents=documents
        )

    async def update_document_status(self, doc_id: str, status_in: DocumentStatusUpdate) -> DocumentResponse:
        update_data: Dict[str, Any] = {"status": status_in.status}
        if status_in.chunk_count is not None:
            update_data["chunk_count"] = status_in.chunk_count

        response = self.supabase.table("documents").update(update_data).eq("id", doc_id).execute()
        if not response.data or not isinstance(response.data, list) or len(response.data) == 0:
            raise ResourceNotFoundException(f"Document {doc_id} not found.")

        first_item = response.data[0]
        if not isinstance(first_item, dict):
            raise ResourceNotFoundException(f"Document {doc_id} returned invalid data payload.")

        return DocumentResponse(**first_item)

    async def delete_document(self, doc_id: str) -> bool:
        doc_response = self.supabase.table("documents").select("storage_path").eq("id", doc_id).single().execute()
        data = doc_response.data
        if not data or not isinstance(data, dict) or "storage_path" not in data:
            raise ResourceNotFoundException(f"Document {doc_id} not found.")

        storage_path = str(data["storage_path"])
        try:
            self.supabase.storage.from_("room-documents").remove([storage_path])
        except Exception:
            pass

        # Deleting document row triggers ON DELETE CASCADE for document_chunks in PostgreSQL
        self.supabase.table("documents").delete().eq("id", doc_id).execute()
        return True

document_service = DocumentService()
