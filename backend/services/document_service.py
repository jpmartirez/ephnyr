from typing import List, Any, Dict
from core.database import get_supabase_admin
from core.config import settings
from core.exceptions import QuotaExceededException, ResourceNotFoundException, EphnyrException
from schemas.document import DocumentCreate, DocumentResponse, DocumentListResponse, DocumentStatusUpdate

class DocumentService:
    def __init__(self):
        self.supabase = get_supabase_admin()

    async def register_document(self, user_id: str, doc_in: DocumentCreate) -> DocumentResponse:
        # 1. Enforce 10MB per file limit
        max_bytes_per_file = settings.FREE_TIER_MAX_FILE_SIZE_MB * 1024 * 1024
        if doc_in.file_size_bytes > max_bytes_per_file:
            raise QuotaExceededException(
                f"File size ({doc_in.file_size_bytes / (1024*1024):.2f} MB) exceeds "
                f"the max limit of {settings.FREE_TIER_MAX_FILE_SIZE_MB} MB per file."
            )

        # 2. Enforce 30MB total room storage limit
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
            "status": "PROCESSING"
        }

        response = self.supabase.table("documents").insert(data_to_insert).execute()
        if not response.data or not isinstance(response.data, list) or len(response.data) == 0:
            raise EphnyrException(status_code=500, detail="Failed to register document record.")

        first_item = response.data[0]
        if not isinstance(first_item, dict):
            raise EphnyrException(status_code=500, detail="Invalid document response payload.")

        return DocumentResponse(**first_item)

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

        self.supabase.table("documents").delete().eq("id", doc_id).execute()
        return True

document_service = DocumentService()
