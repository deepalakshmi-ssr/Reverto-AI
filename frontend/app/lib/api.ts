/**
 * Reverto AI — typed API client
 *
 * Uses NEXT_PUBLIC_API_URL (default: http://localhost:8000).
 * All helpers return `null` on network/server errors so callers can
 * fall back to local demo data without crashing.
 */

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");
const PREFIX = "/api/v1";

async function request<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${PREFIX}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // Backend unreachable — caller falls back to demo data
    return null;
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type Execution = {
  execution_id: string;
  agent_name: string;
  task: string;
  status: string;
  started_at: string;
  completed_at?: string | null;
  steps?: unknown[];
  error?: string;
};

export type ContextRecord = {
  context_id: string;
  execution_id: string;
  source: string;
  context_data: Record<string, unknown>;
  created_at: string;
  token_estimate: number;
};

export type DriftAlert = {
  metric: string;
  drift_percentage: number;
  threshold_percentage: number;
  severity: string;
};

export type DriftRecord = {
  drift_id: string;
  execution_id: string;
  metrics_analyzed: number;
  average_drift_percentage: number;
  drift_detected: boolean;
  metric_analysis: Record<string, unknown>;
  alerts: DriftAlert[];
  analyzed_at: string;
};

// ── Runtime ───────────────────────────────────────────────────────────────────

/** POST /runtime/start?agent_name=&task= */
export function runtimeStart(agent_name: string, task: string) {
  const params = new URLSearchParams({ agent_name, task });
  return request<Execution>(`/runtime/start?${params}`, { method: "POST" });
}

/** GET /runtime/{execution_id} */
export function runtimeGet(execution_id: string) {
  return request<Execution>(`/runtime/${execution_id}`);
}

/** GET /runtime/ */
export function runtimeList() {
  return request<Execution[]>("/runtime/");
}

/** POST /runtime/{execution_id}/complete */
export function runtimeComplete(execution_id: string) {
  return request<Execution>(`/runtime/${execution_id}/complete`, { method: "POST" });
}

/** POST /runtime/{execution_id}/fail?error= */
export function runtimeFail(execution_id: string, error: string) {
  const params = new URLSearchParams({ error });
  return request<Execution>(`/runtime/${execution_id}/fail?${params}`, { method: "POST" });
}

// ── Context ───────────────────────────────────────────────────────────────────

/** POST /context/register?execution_id=&source= with JSON body */
export function contextRegister(
  execution_id: string,
  source: string,
  context_data: Record<string, unknown>
) {
  const params = new URLSearchParams({ execution_id, source });
  return request<ContextRecord>(`/context/register?${params}`, {
    method: "POST",
    body: JSON.stringify(context_data),
  });
}

/** GET /context/execution/{execution_id} */
export function contextList(execution_id: string) {
  return request<ContextRecord[]>(`/context/execution/${execution_id}`);
}

/** GET /context/ */
export function contextListAll() {
  return request<ContextRecord[]>("/context/");
}

// ── Drift ─────────────────────────────────────────────────────────────────────

/** POST /drift/analyze?execution_id= with JSON body */
export function driftAnalyze(
  execution_id: string,
  baseline_metrics: Record<string, number>,
  current_metrics: Record<string, number>,
  thresholds: Record<string, number> = {}
) {
  const params = new URLSearchParams({ execution_id });
  return request<DriftRecord>(`/drift/analyze?${params}`, {
    method: "POST",
    body: JSON.stringify({ baseline_metrics, current_metrics, thresholds }),
  });
}

/** GET /drift/execution/{execution_id} */
export function driftList(execution_id: string) {
  return request<DriftRecord[]>(`/drift/execution/${execution_id}`);
}

/** GET /drift/ */
export function driftListAll() {
  return request<DriftRecord[]>("/drift/");
}

// ── Health ────────────────────────────────────────────────────────────────────

/** GET /health — returns true if backend is reachable */
export async function healthCheck(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/health`, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}
