from fastapi import APIRouter, HTTPException
from app.engines.drift_engine import DriftEngine

router = APIRouter(prefix="/drift", tags=["Drift"])

drift_engine = DriftEngine()


@router.post("/analyze")
async def analyze_drift(
    execution_id: str,
    baseline_metrics: dict,
    current_metrics: dict,
    thresholds: dict | None = None,
):
    return drift_engine.analyze_drift(
        execution_id=execution_id,
        baseline_metrics=baseline_metrics,
        current_metrics=current_metrics,
        thresholds=thresholds,
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