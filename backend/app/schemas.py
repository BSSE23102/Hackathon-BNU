from pydantic import BaseModel, Field


# ── Request ──────────────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    content_text: str = Field(..., min_length=1, max_length=10_000)
    content_type: str | None = Field(None, examples=["post", "comment", "message"])
    source: str | None = Field(None, examples=["web", "mobile", "api"])


# ── Response ─────────────────────────────────────────────────────────

class AnalysisResult(BaseModel):
    risk_score: float = Field(..., ge=0.0, le=1.0)
    decision: str = Field(..., examples=["allow", "flag", "escalate", "delay"])
    explanation: str
    confidence_level: str = Field(..., examples=["low", "medium", "high"])
    signals_used: list[str] = []


class AnalyzeResponse(BaseModel):
    success: bool = True
    data: AnalysisResult
