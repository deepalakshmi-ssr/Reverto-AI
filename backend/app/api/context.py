from fastapi import APIRouter, HTTPException
from app.engines.context_engine import ContextEngine

router = APIRouter(prefix="/context", tags=["Context"])

context_engine = ContextEngine()


@router.post("/register")
async def register_context(
    execution_id: str,
    context_data: dict,
    source: str = "agent",
):
    return context_engine.register_context(
        execution_id=execution_id,
        context_data=context_data,
        source=source,
    )


@router.get("/{context_id}")
async def get_context(context_id: str):
    context = context_engine.get_context(context_id)

    if not context:
        raise HTTPException(status_code=404, detail="Context not found")

    return context


@router.get("/execution/{execution_id}")
async def get_execution_contexts(execution_id: str):
    return context_engine.get_execution_contexts(execution_id)


@router.delete("/{context_id}")
async def delete_context(context_id: str):
    context = context_engine.delete_context(context_id)

    if not context:
        raise HTTPException(status_code=404, detail="Context not found")

    return {
        "message": "Context deleted successfully",
        "context_id": context_id,
    }


@router.get("/")
async def get_all_contexts():
    return context_engine.get_all_contexts()


@router.get("/analysis/{execution_id}")
async def analyze_context(execution_id: str):
    return context_engine.analyze_context(execution_id)