# CSHR Runtime API

Python 3.11+ API for the Cognitive State-Healing Runtime prototype.

```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate | macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Endpoints: `GET /health`, `GET /api/scenarios`, `POST /api/run`, `POST /api/shadow`.
Interactive API documentation: http://localhost:8000/docs.

This MVP uses deterministic scenario simulation. It does not connect to production agents or databases.
