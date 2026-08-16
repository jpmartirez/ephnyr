from fastapi import APIRouter, Depends, status
from api.deps import get_current_user
from schemas.room import RoomCreate, RoomResponse, RoomListResponse
from services.room_service import room_service
from schemas.common import MessageResponse

router = APIRouter(prefix="/rooms", tags=["Rooms"])

@router.get("", response_model=RoomListResponse)
async def list_user_rooms(current_user: dict = Depends(get_current_user)):
    """List all knowledge rooms owned by the current user."""
    return await room_service.get_user_rooms(current_user["id"])

@router.post("", response_model=RoomResponse, status_code=status.HTTP_201_CREATED)
async def create_room(
    room_in: RoomCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new Ephnyr Room (Enforces max 3 room free tier limit)."""
    return await room_service.create_room(current_user["id"], room_in)

@router.get("/slug/{slug}", response_model=RoomResponse)
async def get_room_by_slug(slug: str):
    """Public endpoint: Retrieve room details by shareable slug."""
    return await room_service.get_room_by_slug(slug)

@router.get("/{room_id}", response_model=RoomResponse)
async def get_room(
    room_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Retrieve details for a specific room owned by the current user."""
    return await room_service.get_room_by_id(room_id, current_user["id"])

@router.delete("/{room_id}", response_model=MessageResponse)
async def delete_room(
    room_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a room and trigger atomic ON DELETE CASCADE teardown across all vectors & documents."""
    await room_service.delete_room(room_id, current_user["id"])
    return MessageResponse(
        message=f"Room {room_id} and all associated vector embeddings successfully purged."
    )
