import os
from langchain_community.document_loaders import PyPDFLoader, TextLoader, UnstructuredWordDocumentLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import FastEmbedEmbeddings
from supabase import create_client, Client

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
)
embeddings = FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")

def process_and_index_document(file_path: str, file_name: str, room_id: str, doc_id: str):
    # 1. Parse file
    if file_path.endswith(".pdf"):
        loader = PyPDFLoader(file_path)
    elif file_path.endswith(".docx"):
        loader = UnstructuredWordDocumentLoader(file_path)
    else:
        loader = TextLoader(file_path)
    
    raw_docs = loader.load()
    
    # 2. Semantic Chunking
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=150,
        separators=["\n\n", "\n", " ", ""]
    )
    chunks = text_splitter.split_documents(raw_docs)
    
    # 3. Embed & Insert into Supabase pgvector
    rows_to_insert = []
    for idx, chunk in enumerate(chunks):
        embedding_vector = embeddings.embed_query(chunk.page_content)
        metadata = {
            "file_name": file_name,
            "page": chunk.metadata.get("page", 1),
            "chunk_index": idx
        }
        rows_to_insert.append({
            "room_id": room_id,
            "document_id": doc_id,
            "content": chunk.page_content,
            "metadata": metadata,
            "embedding": embedding_vector
        })
    
    # Batch insert to document_chunks table
    supabase.table("document_chunks").insert(rows_to_insert).execute()
    
    # Update document status to READY
    supabase.table("documents").update({"status": "READY", "chunk_count": len(chunks)}).eq("id", doc_id).execute()
    return len(chunks)