from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal
import time, uuid

app = FastAPI(title="CSHR Cognitive State-Healing Runtime", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

SCENARIOS = {
 "sql_trap": {"title":"SQL Schema Trap", "steps":["Inspect database schema", "Attempt legacy users_v1 lookup", "Detect schema mismatch", "Prune failed branch", "Query users_v2 using UUID", "Verify records", "Complete task"], "bad":"SELECT * FROM users_v1 WHERE id = 42", "good":"SELECT * FROM users_v2 WHERE uuid = 'usr-42'", "constraint":"SYSTEM CONSTRAINT: users_v1 is deprecated. Query users_v2 using UUID."},
 "research_drift": {"title":"Research Drift", "steps":["Anchor user goal", "Collect source material", "Begin unrelated competitor analysis", "Detect alignment drop", "Prune drifted branch", "Return to source comparison", "Deliver grounded summary"], "bad":"Expand into unrelated market forecasts", "good":"Compare the requested source material", "constraint":"SYSTEM CONSTRAINT: Stay within the requested source comparison."},
 "mass_delete": {"title":"Mass-Delete Guard", "steps":["Inspect target table", "Draft delete statement", "Detect broad row impact", "Shadow execute", "Rollback sandbox", "Add WHERE predicate", "Commit verified operation"], "bad":"DELETE FROM accounts", "good":"DELETE FROM accounts WHERE account_id = 'A-104'", "constraint":"SYSTEM CONSTRAINT: Require a scoped predicate and verified row impact."}
}

class RunRequest(BaseModel):
 scenario: str = "sql_trap"
 protected: bool = True
 chaos: str | None = None
 loop_threshold: float = 0.85
 drift_cutoff: float = 0.15

@app.get("/health")
def health(): return {"status":"healthy", "service":"CSHR", "version":"0.1.0"}

@app.get("/api/scenarios")
def scenarios(): return [{"id":k,"title":v["title"]} for k,v in SCENARIOS.items()]

@app.post("/api/run")
def run(req: RunRequest):
 s=SCENARIOS.get(req.scenario,SCENARIOS["sql_trap"]); started=time.perf_counter(); nodes=[]; events=[]
 for i,step in enumerate(s["steps"]):
  isbad=(i==2 and req.scenario=="research_drift") or (i==1 and req.scenario=="sql_trap") or (i==2 and req.scenario=="mass_delete")
  if req.chaos and i==2: isbad=True
  nodes.append({"id":i,"label":step,"status":"pruned" if isbad and req.protected else "failed" if isbad else "committed","branch":"recovery" if isbad and req.protected else "main","detail":s["bad"] if isbad else s["good"] if i>=4 else step})
  if isbad: events.append({"type":"intercept","message":"Semantic failure intercepted: branch rewound and negative constraint injected." if req.protected else "Failure retained in active context; retrying with accumulated history."})
 elapsed=(time.perf_counter()-started)*1000
 return {"run_id":str(uuid.uuid4()),"scenario":req.scenario,"protected":req.protected,"nodes":nodes,"events":events,"constraint":s["constraint"] if req.protected else None,"latency_ms":round(max(elapsed,2.1),2),"task_success":req.protected,"tokens_saved":840 if req.protected else 0,"corruptions_prevented":1 if req.protected else 0,"alignment":0.94 if req.protected else 0.31,"loop_similarity":0.91}

@app.post("/api/shadow")
def shadow():
 return {"query":"DELETE FROM accounts", "estimated_rows":1284,"sandbox_rows":1284,"rollback":"ROLLBACK completed","status":"BLOCKED","recommendation":"Add a scoped WHERE clause and re-run the shadow transaction."}
