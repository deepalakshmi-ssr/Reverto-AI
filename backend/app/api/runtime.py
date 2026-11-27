from fastapi import APIRouter, HTTPException
from app.engines.runtime_engine import RuntimeEngine

router = APIRouter(prefix="/runtime", tags=["Runtime"])

runtime_engine = RuntimeEngine()


@router.post("/start")
async def start_execution(agent_name: str, task: str):
    return runtime_engine.start_execution(agent_name, task)


@router.post("/{execution_id}/complete")
async def complete_execution(execution_id: str):
    execution = runtime_engine.complete_execution(execution_id)

    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")

    return execution


@router.post("/{execution_id}/fail")
async def fail_execution(execution_id: str, error: str):
    execution = runtime_engine.fail_execution(execution_id, error)

    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")

    return execution


@router.get("/{execution_id}")
async def get_execution(execution_id: str):
    execution = runtime_engine.get_execution(execution_id)

    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")

    return execution


@router.get("/")
async def get_all_executions():
    return runtime_engine.get_all_executions()