from fastapi import APIRouter, Depends, status
from api.deps import get_current_user
from schemas.document import DocumentCreate, DocumentResponse, DocumentListResponse, DocumentStatusUpdate
from services.document_service import document_service
from schemas.common import MessageResponse

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.get("/room/{room_id}", response_model=DocumentListResponse)
async def list_room_documents(
    room_id: str,
    current_user: dict = Depends(get_current_user)
):
    """List all documents uploaded to a specific room."""
    return await document_service.get_room_documents(room_id)

@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def register_document(
    doc_in: DocumentCreate,
    current_user: dict = Depends(get_current_user)
):
    """Register document metadata (Enforces 10MB per file and 30MB room storage cap)."""
    return await document_service.register_document(current_user["id"], doc_in)

@router.patch("/{doc_id}/status", response_model=DocumentResponse)
async def update_document_status(
    doc_id: str,
    status_in: DocumentStatusUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update document ingestion status (PROCESSING -> READY / FAILED)."""
    return await document_service.update_document_status(doc_id, status_in)

@router.delete("/{doc_id}", response_model=MessageResponse)
async def delete_document(
    doc_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a document and purge raw storage files."""
    await document_service.delete_document(doc_id)
    return MessageResponse(message=f"Document {doc_id} successfully deleted.")
