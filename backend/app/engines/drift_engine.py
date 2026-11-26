from datetime import datetime, timezone
from uuid import uuid4


class DriftEngine:
    def __init__(self):
        self.drift_records = {}

    def analyze_drift(
        self,
        execution_id: str,
        baseline_metrics: dict,
        current_metrics: dict,
        thresholds: dict | None = None,
    ):
        thresholds = thresholds or {}

        drift_id = str(uuid4())
        metric_analysis = {}
        drift_alerts = []

        total_drift = 0.0
        analyzed_metrics = 0

        for metric, baseline_value in baseline_metrics.items():
            current_value = current_metrics.get(metric)

            if current_value is None:
                continue

            if baseline_value == 0:
                drift_percentage = (
                    0.0 if current_value == 0 else 100.0
                )
            else:
                drift_percentage = abs(
                    (current_value - baseline_value)
                    / baseline_value
                ) * 100

            threshold = thresholds.get(metric, 20.0)
            drift_detected = drift_percentage > threshold

            metric_analysis[metric] = {
                "baseline_value": baseline_value,
                "current_value": current_value,
                "drift_percentage": round(drift_percentage, 2),
                "threshold_percentage": threshold,
                "drift_detected": drift_detected,
            }

            total_drift += drift_percentage
            analyzed_metrics += 1

            if drift_detected:
                drift_alerts.append(
                    {
                        "metric": metric,
                        "drift_percentage": round(
                            drift_percentage, 2
                        ),
                        "threshold_percentage": threshold,
                        "severity": self._determine_severity(
                            drift_percentage
                        ),
                    }
                )

        average_drift = (
            total_drift / analyzed_metrics
            if analyzed_metrics > 0
            else 0.0
        )

        record = {
            "drift_id": drift_id,
            "execution_id": execution_id,
            "metrics_analyzed": analyzed_metrics,
            "average_drift_percentage": round(
                average_drift, 2
            ),
            "drift_detected": len(drift_alerts) > 0,
            "metric_analysis": metric_analysis,
            "alerts": drift_alerts,
            "analyzed_at": datetime.now(timezone.utc).isoformat(),
        }

        self.drift_records[drift_id] = record

        return record

    def _determine_severity(self, drift_percentage: float):
        if drift_percentage >= 75:
            return "critical"
        elif drift_percentage >= 50:
            return "high"
        elif drift_percentage >= 30:
            return "medium"
        return "low"

    def get_drift_analysis(self, drift_id: str):
        return self.drift_records.get(drift_id)

    def get_execution_drift(self, execution_id: str):
        return [
            record
            for record in self.drift_records.values()
            if record["execution_id"] == execution_id
        ]

    def get_all_drift_records(self):
        return list(self.drift_records.values())