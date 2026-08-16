from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class User(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    plan_tier: str = "FREE"
    max_rooms: int = 3
    max_file_size_mb: int = 10
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
