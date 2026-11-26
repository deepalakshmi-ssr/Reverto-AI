from datetime import datetime, timezone
from uuid import uuid4


class RuntimeEngine:
    def __init__(self):
        self.executions = {}

    def start_execution(self, agent_name: str, task: str):
        execution_id = str(uuid4())

        execution = {
            "execution_id": execution_id,
            "agent_name": agent_name,
            "task": task,
            "status": "running",
            "started_at": datetime.now(timezone.utc).isoformat(),
            "completed_at": None,
            "steps": [],
        }

        self.executions[execution_id] = execution
        return execution

    def complete_execution(self, execution_id: str):
        execution = self.executions.get(execution_id)

        if not execution:
            return None

        execution["status"] = "completed"
        execution["completed_at"] = datetime.now(timezone.utc).isoformat()

        return execution

    def fail_execution(self, execution_id: str, error: str):
        execution = self.executions.get(execution_id)

        if not execution:
            return None

        execution["status"] = "failed"
        execution["error"] = error
        execution["completed_at"] = datetime.now(timezone.utc).isoformat()

        return execution

    def get_execution(self, execution_id: str):
        return self.executions.get(execution_id)

    def get_all_executions(self):
        return list(self.executions.values())