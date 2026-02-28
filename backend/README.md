# ContentShield — Backend

Adaptive content-safety analysis pipeline built with FastAPI.

The system detects misleading, manipulative, or policy-violating content through a
multi-signal detection pipeline with adaptive signal decay, cost-aware model routing,
and an explainable decision engine.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Pipeline Deep Dive](#pipeline-deep-dive)
- [Configuration](#configuration)
- [Error Handling](#error-handling)
- [Extending the System](#extending-the-system)

---

## Architecture Overview

```
                    ┌─────────────────────────────────────────────┐
                    │              POST /analyze-content          │
                    └────────────────────┬────────────────────────┘
                                         │
                                         ▼
                    ┌─────────────────────────────────────────────┐
                    │           Input Validation (Pydantic)       │
                    └────────────────────┬────────────────────────┘
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                               ▼
               ┌──────────────────┐            ┌──────────────────┐
               │ Contextual Signal│            │  Semantic Signal  │
               │   (heuristics)   │            │  (simulated ML)   │
               └────────┬─────────┘            └────────┬─────────┘
                        │                               │
                        ▼                               ▼
               ┌─────────────────────────────────────────────────┐
               │           Signal Decay Adjustment               │
               │  (models adversary adaptation over time)        │
               └────────────────────┬────────────────────────────┘
                                    │
                                    ▼
               ┌─────────────────────────────────────────────────┐
               │          Cost-Aware Routing                     │
               │  Low/High risk → fast path (skip expensive)     │
               │  Borderline    → expensive deep analysis model  │
               └────────────────────┬────────────────────────────┘
                                    │
                                    ▼
               ┌─────────────────────────────────────────────────┐
               │            Decision Engine                      │
               │  (risk_score, confidence) → decision + reason   │
               └────────────────────┬────────────────────────────┘
                                    │
                                    ▼
               ┌─────────────────────────────────────────────────┐
               │        Explainable JSON Response                │
               │  { risk_score, decision, explanation, ... }     │
               └─────────────────────────────────────────────────┘
```

---

## Project Structure

```
backend/
├── app/
│   ├── __init__.py      # Package marker
│   ├── main.py          # FastAPI app, CORS, routes, health check
│   ├── schemas.py       # Pydantic request/response models
│   ├── services.py      # Detection pipeline + decision engine (zero FastAPI imports)
│   ├── errors.py        # Global exception handlers — consistent error contract
│   └── config.py        # Env-based settings via Pydantic BaseSettings
├── .env                 # Environment variables
├── requirements.txt     # Minimal dependencies (4 packages)
└── README.md            # You are here
```

| File | Responsibility |
|---|---|
| `main.py` | App initialization, CORS middleware, route registration, `/` and `/health` endpoints |
| `schemas.py` | Pydantic models defining the API contract — request validation and response shape |
| `services.py` | All business logic: signal detection, decay tracking, cost routing, decision engine |
| `errors.py` | Catches every exception type and returns a uniform JSON error envelope |
| `config.py` | Loads environment variables with sensible defaults, exposes a `settings` singleton |

---

## Getting Started

### Prerequisites

- Python 3.11+
- pip

### Installation

```bash
cd backend
pip install -r requirements.txt
```

### Running the Server

```bash
uvicorn app.main:app --reload
```

The server starts at `http://127.0.0.1:8000`.

### Verify

```bash
# Root
curl http://localhost:8000/

# Health check
curl http://localhost:8000/health

# Analyze content
curl -X POST http://localhost:8000/analyze-content \
  -H "Content-Type: application/json" \
  -d '{"content_text": "Click here for free money!"}'
```

### Interactive Docs

FastAPI auto-generates Swagger UI at:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## API Reference

### `GET /`

Returns app status.

**Response:**
```json
{
  "app": "ContentShield",
  "status": "running",
  "env": "dev"
}
```

### `GET /health`

Lightweight health check for monitoring / load balancers.

**Response:**
```json
{
  "status": "ok"
}
```

### `POST /analyze-content`

Analyzes user-generated content through the detection pipeline.

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `content_text` | string | Yes | The text content to analyze (1–10,000 chars) |
| `content_type` | string | No | Content surface: `"post"`, `"comment"`, `"message"` |
| `source` | string | No | Origin platform: `"web"`, `"mobile"`, `"api"` |

**Example Request:**
```json
{
  "content_text": "Act now! Limited offer — buy followers cheap!",
  "content_type": "comment",
  "source": "web"
}
```

**Success Response (200):**

| Field | Type | Description |
|---|---|---|
| `success` | boolean | Always `true` on success |
| `data.risk_score` | float | Risk level from 0.0 (safe) to 1.0 (dangerous) |
| `data.decision` | string | One of: `"allow"`, `"flag"`, `"escalate"`, `"delay"` |
| `data.explanation` | string | Human-readable reason for the decision |
| `data.confidence_level` | string | `"low"`, `"medium"`, or `"high"` |
| `data.signals_used` | list | Which detection signals contributed to the result |

**Example Response:**
```json
{
  "success": true,
  "data": {
    "risk_score": 0.6152,
    "decision": "flag",
    "explanation": "High-confidence risk detected — auto-flagged for policy violation.",
    "confidence_level": "high",
    "signals_used": ["contextual_heuristics", "semantic_model", "deep_analysis_model"]
  }
}
```

**Error Response (422 — Validation):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "body.content_text: Field required"
  }
}
```

---

## Pipeline Deep Dive

The `services.py` module contains five subsystems that run in sequence on every request:

### 1. Detection Signals

Two independent scoring signals run on every piece of content:

- **Semantic signal** — Simulates an ML model (transformer / LLM). In production, this
  calls an external model API. Currently uses a deterministic hash-based stub so the
  same input always returns the same score.

- **Contextual signal** — Cheap heuristic analysis: pattern matching against known risky
  phrases, content length checks, and metadata-based adjustments (e.g., comments receive
  a higher base risk than posts).

### 2. Adaptive Signal Decay

Real-world adversaries learn and adapt. Once they know which signals a platform uses,
they craft content to evade them. This subsystem models that:

- Every time a signal is used, a usage counter increments.
- The more a signal is used, the lower its **decay factor** (a multiplier between 0.3 and 1.0).
- Signal scores are multiplied by this factor, reducing their influence over time.
- Decay rate: **3% per use**, floored at 0.3 (signals never become fully useless).

This forces the system to eventually distrust over-relied-upon signals — a key insight
from real trust & safety engineering.

### 3. Cost-Aware Routing

Not all content needs expensive analysis:

| Combined Score | Path | Rationale |
|---|---|---|
| < 0.3 | **Fast path** | Clearly safe — skip expensive model |
| 0.3 – 0.7 | **Expensive path** | Borderline — invoke deep analysis for accuracy |
| > 0.7 | **Fast path** | Clearly risky — expensive model won't change the decision |

This mirrors real production systems where GPU-intensive models cost money and add
latency. Only ambiguous cases justify the cost.

### 4. Decision Engine

Maps `(risk_score, confidence)` to one of four actions:

| Confidence | Risk Score | Decision | Meaning |
|---|---|---|---|
| High (>=0.7) | High (>=0.6) | `flag` | Auto-action: remove / restrict |
| High (>=0.7) | Low (<0.6) | `allow` | Safe, pass through |
| Medium (0.4–0.7) | Any | `escalate` | Send to human review queue |
| Low (<0.4) | Any | `delay` | Queue for re-analysis later |

Every decision includes a human-readable **explanation** string — critical for
trust, auditability, and user-facing transparency.

### 5. Model API Placeholder

The `call_model_api()` function is a clearly marked drop-in point. To connect a real
model:

```python
import httpx
from app.config import settings

def call_model_api(text: str) -> float:
    resp = httpx.post(
        settings.ml_api_url,
        json={"text": text},
        headers={"Authorization": f"Bearer {settings.ml_api_key}"},
    )
    return resp.json()["score"]
```

Set `ML_API_URL` and `ML_API_KEY` in `.env` and the rest of the pipeline works
unchanged.

---

## Configuration

All configuration flows through `config.py` using Pydantic BaseSettings, which
reads from environment variables and falls back to `.env`.

| Variable | Default | Description |
|---|---|---|
| `APP_NAME` | `ContentShield` | Application name (shown in `/` and Swagger) |
| `DEBUG` | `false` | Enable FastAPI debug mode |
| `ENVIRONMENT` | `dev` | `dev` / `staging` / `prod` |
| `ML_API_URL` | `""` (empty) | External ML model endpoint URL |
| `ML_API_KEY` | `""` (empty) | API key for the ML model |

---

## Error Handling

Every error — whether HTTP, validation, or unexpected crash — returns the **exact same
JSON shape**. This is critical for three reasons specific to content-safety platforms:

1. **Untrusted input** — Every request contains user-generated content that may be
   malformed, oversized, or intentionally crafted to crash the service.

2. **Adversarial probing** — Attackers send garbage payloads to discover stack traces,
   library versions, or internal paths. A uniform envelope reveals nothing.

3. **Platform reliability** — Downstream consumers (frontend, dashboards, human review
   tools) depend on a predictable contract.

### Error Envelope

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable explanation"
  }
}
```

### Error Codes

| Code | HTTP Status | Trigger |
|---|---|---|
| `HTTP_ERROR` | Varies | Standard HTTP exceptions (404, 405, etc.) |
| `VALIDATION_ERROR` | 422 | Request body fails Pydantic validation |
| `INTERNAL_ERROR` | 500 | Unhandled exception (details never leaked) |

---

## Extending the System

### Add a New Detection Signal

1. Write a scoring function in `services.py` that takes text and returns a `float` (0–1).
2. Call it inside `analyze_content()`, apply decay, and append the signal name.
3. Adjust the `combined` score weighting.

### Connect a Real ML Model

1. Set `ML_API_URL` and `ML_API_KEY` in `.env`.
2. Replace the body of `call_model_api()` in `services.py` with an HTTP call.

### Add New Endpoints

1. Define request/response models in `schemas.py`.
2. Add the route in `main.py` (or extract to a router if the file grows).
3. Put business logic in `services.py` — keep routes thin.

### Add a Database

1. Add your ORM / client to `requirements.txt`.
2. Create a `db.py` module for connection setup.
3. Call it from `services.py` — never from route handlers directly.

---

## Dependencies

| Package | Purpose |
|---|---|
| `fastapi` | Web framework |
| `uvicorn[standard]` | ASGI server with hot reload |
| `pydantic-settings` | Typed settings from environment variables |
| `python-dotenv` | `.env` file loading |

---

## License

Hackathon project — BNU 2026.
