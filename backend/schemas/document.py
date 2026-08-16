from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class DocumentBase(BaseModel):
    file_name: str
    file_type: str
    file_size_bytes: int
    storage_path: str

class DocumentCreate(DocumentBase):
    room_id: str

class DocumentStatusUpdate(BaseModel):
    status: str  # 'PROCESSING', 'READY', 'FAILED'
    chunk_count: Optional[int] = 0

class DocumentResponse(DocumentBase):
    id: str
    room_id: str
    status: str = "PROCESSING"
    chunk_count: int = 0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class DocumentListResponse(BaseModel):
    total: int
    total_size_bytes: int
    documents: List[DocumentResponse]
