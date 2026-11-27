from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Optional
from app.engines.drift_engine import DriftEngine

router = APIRouter(prefix="/drift", tags=["Drift"])

drift_engine = DriftEngine()


class DriftRequest(BaseModel):
    baseline_metrics: Dict[str, float]
    current_metrics: Dict[str, float]
    thresholds: Optional[Dict[str, float]] = None


@router.post("/analyze")
async def analyze_drift(execution_id: str, body: DriftRequest):
    return drift_engine.analyze_drift(
        execution_id=execution_id,
        baseline_metrics=body.baseline_metrics,
        current_metrics=body.current_metrics,
        thresholds=body.thresholds,
    )


@router.get("/{drift_id}")
async def get_drift_analysis(drift_id: str):
    record = drift_engine.get_drift_analysis(drift_id)

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Drift analysis not found",
        )

    return record


@router.get("/execution/{execution_id}")
async def get_execution_drift(execution_id: str):
    return drift_engine.get_execution_drift(execution_id)


@router.get("/")
async def get_all_drift_records():
    return drift_engine.get_all_drift_records()
