import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Ephnyr AI Core API",
    description="FastAPI Backend Engine for Ephnyr Ephemeral Knowledge Pods",
    version="0.1.0"
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    os.getenv("FRONTEND_URL", "*")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Ephnyr AI Core Engine",
        "version": "0.1.0"
    }

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "database": "supabase",
        "llm_engine": "groq",
        "embeddings": "fastembed (BAAI/bge-small-en-v1.5)"
    }
