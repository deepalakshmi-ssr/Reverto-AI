from datetime import datetime, timezone
from uuid import uuid4


class ContextEngine:
    def __init__(self):
        self.context_records = {}

    def register_context(
        self,
        execution_id: str,
        context_data: dict,
        source: str = "agent",
    ):
        context_id = str(uuid4())

        context_record = {
            "context_id": context_id,
            "execution_id": execution_id,
            "source": source,
            "context_data": context_data,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "token_estimate": self._estimate_tokens(context_data),
        }

        self.context_records[context_id] = context_record

        return context_record

    def _estimate_tokens(self, context_data: dict):
        text = str(context_data)
        return max(1, len(text) // 4)

    def get_context(self, context_id: str):
        return self.context_records.get(context_id)

    def get_execution_contexts(self, execution_id: str):
        return [
            record
            for record in self.context_records.values()
            if record["execution_id"] == execution_id
        ]

    def delete_context(self, context_id: str):
        return self.context_records.pop(context_id, None)

    def get_all_contexts(self):
        return list(self.context_records.values())

    def analyze_context(self, execution_id: str):
        records = self.get_execution_contexts(execution_id)

        total_tokens = sum(
            record["token_estimate"] for record in records
        )

        return {
            "execution_id": execution_id,
            "context_count": len(records),
            "estimated_total_tokens": total_tokens,
            "sources": list(
                {record["source"] for record in records}
            ),
            "analysis_timestamp": datetime.now(timezone.utc).isoformat(),
        }