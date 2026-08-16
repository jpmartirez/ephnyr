from fastapi import APIRouter
from api.v1.health import router as health_router
from api.v1.rooms import router as rooms_router
from api.v1.documents import router as documents_router

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(health_router)
api_v1_router.include_router(rooms_router)
api_v1_router.include_router(documents_router)
