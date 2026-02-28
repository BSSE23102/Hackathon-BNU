from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.errors import register_error_handlers
from app.schemas import AnalyzeRequest, AnalyzeResponse
from app.services import analyze_content

app = FastAPI(
    title=settings.app_name,
    description="Adaptive content-safety analysis pipeline",
    debug=settings.debug,
)

# ── Middleware ────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_error_handlers(app)

# ── Routes ───────────────────────────────────────────────────────────


@app.get("/")
async def root():
    return {"app": settings.app_name, "status": "running", "env": settings.environment}


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/analyze-content", response_model=AnalyzeResponse)
async def analyze(payload: AnalyzeRequest):
    result = analyze_content(payload)
    return AnalyzeResponse(data=result)
