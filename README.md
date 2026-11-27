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
- FastAPI backend with `/health`, `/api/v1/runtime`, `/api/v1/context`, `/api/v1/drift` endpoints

> **Prototype note:** The frontend uses deterministic local demo data and simulated timing, not live LLM calls, actual vector embeddings, or real database mutations. The backend stores data in-memory only. Do not connect this prototype to production systems without implementing and reviewing adapters, policy enforcement, authentication, and security controls.

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
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open http://localhost:8000/docs for interactive API documentation.

## API routes (`/api/v1`)

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/v1/runtime/start` | Start a new agent execution (query params: `agent_name`, `task`) |
| GET | `/api/v1/runtime/{execution_id}` | Get a specific execution |
| GET | `/api/v1/runtime/` | List all executions |
| POST | `/api/v1/runtime/{execution_id}/complete` | Mark execution as complete |
| POST | `/api/v1/runtime/{execution_id}/fail` | Mark execution as failed (query param: `error`) |
| POST | `/api/v1/context/register` | Register context (query params: `execution_id`, `source`; JSON body: context dict) |
| GET | `/api/v1/context/execution/{execution_id}` | List contexts for an execution |
| GET | `/api/v1/context/` | List all contexts |
| POST | `/api/v1/drift/analyze` | Analyze drift (query param: `execution_id`; JSON body: `baseline_metrics`, `current_metrics`, `thresholds`) |
| GET | `/api/v1/drift/execution/{execution_id}` | List drift records for an execution |
| GET | `/api/v1/drift/` | List all drift records |
| GET | `/health` | Health check |

## Environment variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `ALLOWED_ORIGINS` | `http://localhost:3000` | Comma-separated CORS allowed origins |

Copy `backend/.env.example` to `backend/.env` and edit.

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend base URL (no trailing slash) |

Copy `frontend/.env.example` to `frontend/.env.local` and edit.

## Deployment

### Backend (Render)

The repo includes `render.yaml` at the root for one-click Render deployment.

**Steps:**
1. Push this repo to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**.
3. Connect your GitHub repo — Render picks up `render.yaml` automatically.
4. After the first deploy, copy the service URL (e.g. `https://reverto-ai-backend.onrender.com`).
5. Verify: `https://reverto-ai-backend.onrender.com/health` and `.../docs`.

### Frontend (Vercel)

1. Go to [Vercel](https://vercel.com) → **New Project** → import the same GitHub repo.
2. Set **Root Directory** to `frontend`.
3. Add environment variable: `NEXT_PUBLIC_API_URL` = your Render URL.
4. Deploy. Copy the Vercel URL (e.g. `https://reverto-ai.vercel.app`).
5. Go back to the Render service → **Environment** → set `ALLOWED_ORIGINS` to the Vercel URL.
6. Trigger a Render redeploy.

### Live URLs (fill in after deploy)

- **Frontend:** `https://<your-project>.vercel.app`
- **Backend:** `https://<your-service>.onrender.com`

## Stack

Next.js 15 · React 19 · TypeScript · Tailwind-ready CSS · Framer Motion · Lucide · FastAPI · Python 3.12.

## Layout

- `frontend/app`: app entry, layout, styling and components
- `frontend/app/lib/api.ts`: typed backend API client
- `backend/app/main.py`: FastAPI app with CORS middleware
- `backend/app/api/`: route handlers (runtime, context, drift)
- `backend/app/engines/`: business logic engines
- `render.yaml`: Render deployment config
