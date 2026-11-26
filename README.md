# CSHR — Cognitive State-Healing Runtime

**Enterprise-style interactive prototype** for deterministic context pruning, goal-drift interception, loop detection, shadow transaction previews and agent reliability telemetry.

## Included modules
- Corporate-style responsive dashboard and runtime status panel
- Split-screen Standard Agent vs CSHR-protected simulation (3 preset failure scenarios)
- Interactive cognitive state tree with zoom controls and committed/pruned/recovery states
- Context X-Ray diff inspector (negative constraint + recovery branch)
- Drift/loop signal telemetry and threshold controls
- SQL speculative shadow transaction / blast-radius preview
- Chaos injector / policy lab controls
- ROI & reliability scorecard with demo metrics
- FastAPI backend with health, scenario, run and shadow endpoints

> **Prototype note:** The frontend uses deterministic local demo data and simulated timing, not live LLM calls, actual vector embeddings, or real database mutations. Backend endpoints likewise return scenario simulation results. Do not connect this prototype to production systems without implementing and reviewing adapters, policy enforcement, authentication, and security controls.

## Run the web console
Requirements: Node.js 20+ and npm.

```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:3000.

## Run the backend API
Requirements: Python 3.11+.

```bash
cd backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Open http://localhost:8000/docs for interactive API documentation.

## Stack
Next.js 15 · React 19 · TypeScript · Tailwind-ready CSS · Framer Motion · Lucide · FastAPI · Python.

## Layout
- `frontend/app`: app entry, layout and styling
- `backend/app/main.py`: API and deterministic scenario simulator
