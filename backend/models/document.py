from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class Document(BaseModel):
    id: str
    room_id: str
    file_name: str
    file_type: str
    file_size_bytes: int
    storage_path: str
    status: str = "PROCESSING"
    chunk_count: int = 0
    created_at: Optional[datetime] = None
