import random
import string
import re
from typing import List, Optional, Any, Dict
from core.database import get_supabase_admin
from core.config import settings
from core.exceptions import QuotaExceededException, ResourceNotFoundException, EphnyrException
from schemas.room import RoomCreate, RoomUpdate, RoomResponse, RoomListResponse

def generate_slug(name: str) -> str:
    clean_name = re.sub(r'[^a-z0-9]', '-', name.lower()).strip('-')
    suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=5))
    return f"{clean_name}-{suffix}"

class RoomService:
    def __init__(self):
        self.supabase = get_supabase_admin()

    async def create_room(self, user_id: str, room_in: RoomCreate) -> RoomResponse:
        # 0. Ensure user record exists in public.users to prevent rooms_user_id_fkey violation
        user_check = self.supabase.table("users").select("id").eq("id", user_id).execute()
        if not user_check.data:
            try:
                auth_user = self.supabase.auth.admin.get_user_by_id(user_id)
                if auth_user and auth_user.user:
                    email = auth_user.user.email or f"{user_id}@ephnyr.ai"
                    full_name = (auth_user.user.user_metadata or {}).get("full_name", "")
                    self.supabase.table("users").upsert({
                        "id": user_id,
                        "email": email,
                        "full_name": full_name
                    }).execute()
            except Exception as e:
                print("Failed to auto-sync user profile into public.users:", e)

        # 1. Enforce Max 3 Rooms on Free Tier (Masterplan Quota Rule 1.1 & 7.2)
        count_response = self.supabase.table("rooms").select("id", count="exact").eq("user_id", user_id).execute()
        current_room_count = count_response.count or 0

        if current_room_count >= settings.FREE_TIER_MAX_ROOMS:
            raise QuotaExceededException(
                f"Free tier limit reached (Max {settings.FREE_TIER_MAX_ROOMS} rooms). "
                "Delete an existing room to create a new one."
            )

        # 2. Generate Unique Slug
        slug = generate_slug(room_in.name)

        # 3. Insert Room into PostgreSQL
        data_to_insert = {
            "user_id": user_id,
            "name": room_in.name,
            "description": room_in.description,
            "slug": slug,
            "is_public": room_in.is_public,
            "system_prompt": room_in.system_prompt
        }

        response = self.supabase.table("rooms").insert(data_to_insert).execute()
        if not response.data or not isinstance(response.data, list) or len(response.data) == 0:
            raise EphnyrException(status_code=500, detail="Failed to create room record.")

        first_item = response.data[0]
        if not isinstance(first_item, dict):
            raise EphnyrException(status_code=500, detail="Invalid room response payload.")

        return RoomResponse(**first_item)

    async def get_user_rooms(self, user_id: str) -> RoomListResponse:
        response = self.supabase.table("rooms").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        raw_rooms = response.data if isinstance(response.data, list) else []
        rooms = [RoomResponse(**row) for row in raw_rooms if isinstance(row, dict)]
        return RoomListResponse(
            total=len(rooms),
            max_allowed=settings.FREE_TIER_MAX_ROOMS,
            rooms=rooms
        )

    async def get_room_by_id(self, room_id: str, user_id: Optional[str] = None) -> RoomResponse:
        query = self.supabase.table("rooms").select("*").eq("id", room_id)
        if user_id:
            query = query.eq("user_id", user_id)
        
        response = query.single().execute()
        data = response.data
        if not data or not isinstance(data, dict):
            raise ResourceNotFoundException(f"Room {room_id} not found or unauthorized.")
        return RoomResponse(**data)

    async def get_room_by_slug(self, slug: str) -> RoomResponse:
        response = self.supabase.table("rooms").select("*").eq("slug", slug).single().execute()
        data = response.data
        if not data or not isinstance(data, dict):
            raise ResourceNotFoundException(f"Room with slug '{slug}' not found.")
        return RoomResponse(**data)

    async def delete_room(self, room_id: str, user_id: str) -> bool:
        # Verify ownership
        room = await self.get_room_by_id(room_id, user_id)
        
        # Purge files from storage if any
        doc_records = self.supabase.table("documents").select("storage_path").eq("room_id", room_id).execute()
        raw_docs = doc_records.data if isinstance(doc_records.data, list) else []
        storage_paths = [str(doc["storage_path"]) for doc in raw_docs if isinstance(doc, dict) and "storage_path" in doc]

        if storage_paths:
            try:
                self.supabase.storage.from_("room-documents").remove(storage_paths)
            except Exception:
                pass

        # Deleting room row triggers PostgreSQL ON DELETE CASCADE for documents, chunks, and sessions
        self.supabase.table("rooms").delete().eq("id", room.id).execute()
        return True

room_service = RoomService()
