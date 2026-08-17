from typing import Optional
from fastapi import Depends, Header
from core.database import get_supabase_admin
from core.exceptions import UnauthorizedException

async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    """
    Extracts and validates Supabase JWT token from Authorization Bearer header.
    Returns user payload dictionary containing 'id', 'email', etc.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise UnauthorizedException("Missing or invalid Authorization header.")
    
    token = authorization.split(" ")[1]
    supabase_admin = get_supabase_admin()
    
    try:
        response = supabase_admin.auth.get_user(token)
        if not response or not response.user:
            raise UnauthorizedException("Invalid or expired session token.")
        
        user = response.user
        return {
            "id": user.id,
            "email": user.email,
            "user_metadata": user.user_metadata or {}
        }
    except Exception as e:
        raise UnauthorizedException(f"Authentication failed: {str(e)}")

async def get_optional_current_user(authorization: Optional[str] = Header(None)) -> Optional[dict]:
    """
    Optional authentication dependency. Returns user payload if valid Bearer token provided, else None.
    """
    if not authorization or not authorization.startswith("Bearer "):
        return None
    
    token = authorization.split(" ")[1]
    supabase_admin = get_supabase_admin()
    
    try:
        response = supabase_admin.auth.get_user(token)
        if response and response.user:
            user = response.user
            return {
                "id": user.id,
                "email": user.email,
                "user_metadata": user.user_metadata or {}
            }
    except Exception:
        pass
    
    return None
