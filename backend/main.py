from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from core.config import settings
from core.exceptions import EphnyrException
from api.v1.router import api_v1_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="FastAPI Backend Engine for Ephnyr Ephemeral Knowledge Pods",
    version=settings.VERSION
)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    settings.FRONTEND_URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Exception Handler for Ephnyr Exceptions
@app.exception_handler(EphnyrException)
async def ephnyr_exception_handler(request: Request, exc: EphnyrException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )

# Include API v1 Router
app.include_router(api_v1_router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs"
    }
