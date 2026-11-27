from app.engines.runtime_engine import RuntimeEngine


def test_start_execution():
    engine = RuntimeEngine()

    execution = engine.start_execution(
        agent_name="Test Agent",
        task="Test task execution",
    )

    assert execution["agent_name"] == "Test Agent"
    assert execution["task"] == "Test task execution"
    assert execution["status"] == "running"
    assert execution["execution_id"] is not None


def test_complete_execution():
    engine = RuntimeEngine()

    execution = engine.start_execution("Test Agent", "Test task")
    completed = engine.complete_execution(execution["execution_id"])

    assert completed["status"] == "completed"
    assert completed["completed_at"] is not None


def test_fail_execution():
    engine = RuntimeEngine()

    execution = engine.start_execution("Test Agent", "Test task")
    failed = engine.fail_execution(execution["execution_id"], "Test error")

    assert failed["status"] == "failed"
    assert failed["error"] == "Test error"


def test_get_execution():
    engine = RuntimeEngine()

    execution = engine.start_execution("Test Agent", "Test task")
    retrieved = engine.get_execution(execution["execution_id"])

    assert retrieved == execution


def test_get_all_executions():
    engine = RuntimeEngine()

    engine.start_execution("Agent 1", "Task 1")
    engine.start_execution("Agent 2", "Task 2")

    executions = engine.get_all_executions()

    assert len(executions) == 2