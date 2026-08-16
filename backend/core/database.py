from supabase import create_client, Client
from core.config import settings

_supabase_client: Client | None = None
_supabase_admin_client: Client | None = None

def get_supabase() -> Client:
    """Returns standard Supabase client instance."""
    global _supabase_client
    if _supabase_client is None:
        key = settings.SUPABASE_ANON_KEY or settings.SUPABASE_SERVICE_ROLE_KEY
        _supabase_client = create_client(settings.SUPABASE_URL, key)
    return _supabase_client

def get_supabase_admin() -> Client:
    """Returns Supabase admin client instance (Service Role) for privileged operations."""
    global _supabase_admin_client
    if _supabase_admin_client is None:
        key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY
        _supabase_admin_client = create_client(settings.SUPABASE_URL, key)
    return _supabase_admin_client
