from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class Room(BaseModel):
    id: str
    user_id: str
    name: str
    description: Optional[str] = None
    slug: str
    is_public: bool = True
    system_prompt: str = "You are an AI assistant strictly grounded on the provided context."
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
