from fastapi import Depends
from core.security import get_current_user

# Re-export authentication dependency
__all__ = ["get_current_user"]
