from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.runtime import router as runtime_router
from app.api.context import router as context_router
from app.api.drift import router as drift_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Agent Runtime Reliability and Governance Platform",
)

# CORS — allow origins from env var ALLOWED_ORIGINS (comma-separated)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(runtime_router, prefix=settings.API_PREFIX)
app.include_router(context_router, prefix=settings.API_PREFIX)
app.include_router(drift_router, prefix=settings.API_PREFIX)

@app.get("/")
async def root():
    return {
        "message": "Reverto AI Backend is running",
        "project": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "status": "operational",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Reverto AI Backend",
    }