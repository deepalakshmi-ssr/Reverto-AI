from app.engines.context_engine import ContextEngine


def test_register_context():
    engine = ContextEngine()

    record = engine.register_context(
        execution_id="exec-001",
        context_data={"prompt": "Analyze reliability"},
        source="agent",
    )

    assert record["execution_id"] == "exec-001"
    assert record["source"] == "agent"
    assert record["context_id"] is not None
    assert record["token_estimate"] > 0


def test_get_context():
    engine = ContextEngine()

    record = engine.register_context(
        execution_id="exec-002",
        context_data={"data": "test"},
    )

    retrieved = engine.get_context(record["context_id"])

    assert retrieved == record


def test_get_execution_contexts():
    engine = ContextEngine()

    engine.register_context("exec-003", {"a": 1})
    engine.register_context("exec-003", {"b": 2})
    engine.register_context("exec-004", {"c": 3})

    records = engine.get_execution_contexts("exec-003")

    assert len(records) == 2


def test_delete_context():
    engine = ContextEngine()

    record = engine.register_context(
        "exec-005",
        {"data": "delete me"},
    )

    deleted = engine.delete_context(record["context_id"])

    assert deleted == record
    assert engine.get_context(record["context_id"]) is None


def test_get_all_contexts():
    engine = ContextEngine()

    engine.register_context("exec-006", {"a": 1})
    engine.register_context("exec-007", {"b": 2})

    records = engine.get_all_contexts()

    assert len(records) == 2


def test_analyze_context():
    engine = ContextEngine()

    engine.register_context(
        "exec-008",
        {"prompt": "Task analysis"},
        source="agent",
    )

    engine.register_context(
        "exec-008",
        {"memory": "Previous context"},
        source="memory",
    )

    analysis = engine.analyze_context("exec-008")

    assert analysis["execution_id"] == "exec-008"
    assert analysis["context_count"] == 2
    assert analysis["estimated_total_tokens"] > 0
    assert "agent" in analysis["sources"]
    assert "memory" in analysis["sources"]