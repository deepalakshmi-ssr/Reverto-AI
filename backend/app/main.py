from fastapi import FastAPI
from app.core.config import settings
from app.api.runtime import router as runtime_router
from app.api.context import router as context_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Agent Runtime Reliability and Governance Platform",
)


app.include_router(runtime_router, prefix=settings.API_PREFIX)
app.include_router(context_router, prefix=settings.API_PREFIX)

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