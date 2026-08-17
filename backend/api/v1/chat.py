from typing import Optional
from fastapi import APIRouter, Depends, Header
from api.deps import get_optional_current_user
from schemas.chat import ChatRequest, ChatResponse
from services.chat_service import chat_service

router = APIRouter(prefix="/chat", tags=["Chatbot"])

@router.get("/room/{slug}")
async def get_chat_room_info(
    slug: str,
    current_user: Optional[dict] = Depends(get_optional_current_user)
):
    """
    Get public info and check access permissions for a Knowledge Pod chatbot by slug.
    """
    user_id = current_user["id"] if current_user else None
    room_data = await chat_service.verify_room_access(slug, user_id)
    return {
        "id": room_data["id"],
        "name": room_data["name"],
        "description": room_data.get("description"),
        "slug": room_data["slug"],
        "is_public": room_data.get("is_public", True),
        "is_owner": user_id == str(room_data.get("user_id")) if user_id else False,
    }

@router.post("/query", response_model=ChatResponse)
async def query_rag_chatbot(
    chat_in: ChatRequest,
    current_user: Optional[dict] = Depends(get_optional_current_user)
):
    """
    Execute RAG vector similarity search + Groq LPU Llama 3.3 70B response generation.
    Enforces privacy guards (Private Pods require authenticated room owner).
    """
    user_id = current_user["id"] if current_user else None
    return await chat_service.query_rag(chat_in, user_id)
