from core.database import get_supabase_admin
from core.exceptions import ResourceNotFoundException
from schemas.auth import UserResponse

class UserService:
    def __init__(self):
        self.supabase = get_supabase_admin()

    async def get_user_profile(self, user_id: str) -> UserResponse:
        response = self.supabase.table("users").select("*").eq("id", user_id).single().execute()
        data = response.data
        if not data or not isinstance(data, dict):
            raise ResourceNotFoundException(f"User profile for {user_id} not found.")
        return UserResponse(**data)

user_service = UserService()
