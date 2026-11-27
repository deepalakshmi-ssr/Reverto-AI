from app.engines.drift_engine import DriftEngine


def test_analyze_drift_without_drift():
    engine = DriftEngine()

    result = engine.analyze_drift(
        execution_id="exec-001",
        baseline_metrics={"latency": 100, "tokens": 500},
        current_metrics={"latency": 110, "tokens": 520},
    )

    assert result["execution_id"] == "exec-001"
    assert result["metrics_analyzed"] == 2
    assert result["drift_detected"] is False
    assert result["alerts"] == []


def test_analyze_drift_with_alert():
    engine = DriftEngine()

    result = engine.analyze_drift(
        execution_id="exec-002",
        baseline_metrics={"latency": 100},
        current_metrics={"latency": 150},
    )

    assert result["drift_detected"] is True
    assert len(result["alerts"]) == 1
    assert result["alerts"][0]["metric"] == "latency"
    assert result["alerts"][0]["severity"] == "high"


def test_custom_threshold():
    engine = DriftEngine()

    result = engine.analyze_drift(
        execution_id="exec-003",
        baseline_metrics={"latency": 100},
        current_metrics={"latency": 125},
        thresholds={"latency": 10},
    )

    assert result["drift_detected"] is True
    assert result["alerts"][0]["threshold_percentage"] == 10


def test_zero_baseline():
    engine = DriftEngine()

    result = engine.analyze_drift(
        execution_id="exec-004",
        baseline_metrics={"errors": 0},
        current_metrics={"errors": 5},
    )

    assert result["metric_analysis"]["errors"]["drift_percentage"] == 100
    assert result["drift_detected"] is True


def test_missing_metric():
    engine = DriftEngine()

    result = engine.analyze_drift(
        execution_id="exec-005",
        baseline_metrics={"latency": 100, "tokens": 500},
        current_metrics={"latency": 120},
    )

    assert result["metrics_analyzed"] == 1
    assert "tokens" not in result["metric_analysis"]


def test_get_drift_analysis():
    engine = DriftEngine()

    result = engine.analyze_drift(
        execution_id="exec-006",
        baseline_metrics={"latency": 100},
        current_metrics={"latency": 140},
    )

    retrieved = engine.get_drift_analysis(result["drift_id"])

    assert retrieved == result


def test_get_execution_drift():
    engine = DriftEngine()

    engine.analyze_drift(
        "exec-007",
        {"latency": 100},
        {"latency": 150},
    )

    engine.analyze_drift(
        "exec-007",
        {"latency": 100},
        {"latency": 180},
    )

    records = engine.get_execution_drift("exec-007")

    assert len(records) == 2


def test_get_all_drift_records():
    engine = DriftEngine()

    engine.analyze_drift(
        "exec-008",
        {"latency": 100},
        {"latency": 120},
    )

    records = engine.get_all_drift_records()

    assert len(records) == 1


def test_severity_classification():
    engine = DriftEngine()

    assert engine._determine_severity(25) == "low"
    assert engine._determine_severity(35) == "medium"
    assert engine._determine_severity(55) == "high"
    assert engine._determine_severity(80) == "critical"