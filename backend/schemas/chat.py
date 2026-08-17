from typing import List, Optional
from pydantic import BaseModel, Field

class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str

class SourceCitation(BaseModel):
    file_name: str
    content: str
    similarity: float

class ChatRequest(BaseModel):
    slug: str
    message: str = Field(..., min_length=1)
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    reply: str
    sources: List[SourceCitation]
