from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class RoomBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    is_public: bool = True
    system_prompt: Optional[str] = "You are an AI assistant strictly grounded on the provided context."

class RoomCreate(RoomBase):
    pass

class RoomUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    is_public: Optional[bool] = None
    system_prompt: Optional[str] = None

class RoomResponse(RoomBase):
    id: str
    user_id: str
    slug: str
    doc_count: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class RoomListResponse(BaseModel):
    total: int
    max_allowed: int = 3
    rooms: List[RoomResponse]
