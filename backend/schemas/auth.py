from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None

class UserResponse(UserBase):
    id: str
    plan_tier: str = "FREE"
    max_rooms: int = 3
    max_file_size_mb: int = 10
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
