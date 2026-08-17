import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = "Ephnyr AI Core"
    VERSION: str = "0.1.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Supabase Settings
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")
    
    # Groq Settings
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    
    # Frontend URL for CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    # Free Tier Quotas & Constraints (from Masterplan)
    FREE_TIER_MAX_ROOMS: int = 3
    FREE_TIER_MAX_FILE_SIZE_MB: int = 5
    FREE_TIER_MAX_ROOM_STORAGE_MB: int = 10

settings = Settings()
