from fastapi import APIRouter
from core.config import settings

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "supabase",
        "llm_engine": "groq",
        "embeddings": "fastembed (BAAI/bge-small-en-v1.5)"
    }
