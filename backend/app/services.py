"""
Detection & Decision Pipeline
──────────────────────────────
Zero FastAPI imports — pure business logic only.

Architecture:
  content → [semantic signal] + [contextual signal]
          → signal decay adjustment
          → cost-aware routing (fast / expensive path)
          → decision engine
          → explainable result
"""

from __future__ import annotations

import hashlib
import random
import time
from dataclasses import dataclass, field

from app.schemas import AnalyzeRequest, AnalysisResult


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MODEL API PLACEHOLDER
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def call_model_api(text: str) -> float:
    """
    PLACEHOLDER — replace with a real model call.

    Integration point:
        import httpx
        resp = httpx.post(settings.model_api_url, json={"text": text},
                          headers={"Authorization": f"Bearer {settings.model_api_key}"})
        return resp.json()["score"]
    """
    # Simulated: hash-based deterministic score so the same input → same result
    digest = hashlib.sha256(text.encode()).hexdigest()
    return int(digest[:4], 16) / 0xFFFF


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SIGNAL DECAY TRACKER
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Adversaries adapt.  When they learn which signals we use, they craft
# content to evade those signals.  We simulate this with a usage counter:
# the more a signal is used, the less we trust its output.

@dataclass
class SignalDecayTracker:
    usage_counts: dict[str, int] = field(default_factory=dict)
    decay_rate: float = 0.03   # confidence drops 3 % per repeated use

    def record_use(self, signal_name: str) -> None:
        self.usage_counts[signal_name] = self.usage_counts.get(signal_name, 0) + 1

    def decay_factor(self, signal_name: str) -> float:
        """Returns a multiplier in (0, 1].  Fresh signal → 1.0, repeated → decays."""
        uses = self.usage_counts.get(signal_name, 0)
        return max(0.3, 1.0 - uses * self.decay_rate)


# Singleton — persists across requests while the server runs
_decay_tracker = SignalDecayTracker()


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# DETECTION SIGNALS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RISKY_PATTERNS = ["free money", "click here", "act now", "limited offer", "buy followers"]


def semantic_risk_score(text: str) -> float:
    """Simulated ML signal — in production this calls a transformer model."""
    return call_model_api(text)


def contextual_risk_score(text: str, content_type: str | None) -> float:
    """Heuristic signal based on surface patterns and metadata."""
    score = 0.0
    lower = text.lower()

    for pattern in RISKY_PATTERNS:
        if pattern in lower:
            score += 0.2

    if len(text) < 20:
        score += 0.1       # very short content is suspicious at scale
    if content_type == "comment":
        score += 0.05       # comments are higher-risk surface area

    return min(score, 1.0)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# COST-AWARE ROUTING
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Real systems can't afford expensive models on every request.
# Fast path:    cheap heuristics only (< 1 ms)
# Expensive path: full model inference (simulated ~200 ms)

def needs_expensive_path(fast_score: float) -> bool:
    """Borderline content (0.3–0.7) gets routed to the expensive model."""
    return 0.3 <= fast_score <= 0.7


def run_expensive_analysis(text: str) -> float:
    """Simulated expensive model — adds latency but higher accuracy."""
    time.sleep(0.01)  # kept short for demo; represents a heavier model call
    return call_model_api(text[::-1])  # different hash = different "model"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# DECISION ENGINE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def make_decision(score: float, confidence: float) -> tuple[str, str]:
    """
    Maps risk score + confidence → (decision, explanation).

    Matrix:
        High confidence + high risk  →  flag  (auto-action)
        High confidence + low risk   →  allow
        Medium confidence            →  escalate to human review
        Low confidence               →  delay and observe
    """
    if confidence >= 0.7:
        if score >= 0.6:
            return "flag", "High-confidence risk detected — auto-flagged for policy violation."
        return "allow", "Content analysed with high confidence — no issues found."

    if confidence >= 0.4:
        return "escalate", "Borderline signals — routed to human review for final judgment."

    return "delay", "Low-confidence signals — content queued for delayed re-analysis."


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MAIN PIPELINE  (the only public function)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def analyze_content(req: AnalyzeRequest) -> AnalysisResult:
    signals_used: list[str] = []

    # 1. Fast contextual signal (cheap, always runs)
    ctx_score = contextual_risk_score(req.content_text, req.content_type)
    _decay_tracker.record_use("contextual")
    ctx_decay = _decay_tracker.decay_factor("contextual")
    ctx_score *= ctx_decay
    signals_used.append("contextual_heuristics")

    # 2. Semantic signal (simulated ML — always runs in this demo)
    sem_score = semantic_risk_score(req.content_text)
    _decay_tracker.record_use("semantic")
    sem_decay = _decay_tracker.decay_factor("semantic")
    sem_score *= sem_decay
    signals_used.append("semantic_model")

    # 3. Cost-aware routing: only invoke expensive model on borderline content
    combined = (sem_score * 0.6) + (ctx_score * 0.4)

    if needs_expensive_path(combined):
        expensive = run_expensive_analysis(req.content_text)
        combined = (combined + expensive) / 2
        signals_used.append("deep_analysis_model")

    # 4. Confidence = average freshness of all signals used
    confidence = (sem_decay + ctx_decay) / 2

    # 5. Decision
    risk_score = round(min(combined, 1.0), 4)
    decision, explanation = make_decision(risk_score, confidence)

    confidence_level = "high" if confidence >= 0.7 else ("medium" if confidence >= 0.4 else "low")

    return AnalysisResult(
        risk_score=risk_score,
        decision=decision,
        explanation=explanation,
        confidence_level=confidence_level,
        signals_used=signals_used,
    )
