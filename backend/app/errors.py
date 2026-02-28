"""
Global Error Handling
─────────────────────
Why this matters for a content-safety platform:

1. Untrusted input — every request contains user-generated content that may be
   malformed, oversized, or intentionally crafted to crash the service.
   Consistent error handling prevents information leakage to adversaries.

2. Adversarial probing — attackers send garbage to discover stack traces,
   library versions, or internal paths.  A uniform error envelope reveals nothing.

3. Platform reliability — downstream services (frontend, dashboards, human review
   queues) depend on a predictable response contract.  If errors change shape
   per endpoint, every consumer needs special-case handling.
"""

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


def _error_envelope(code: str, message: str, status: int = 500) -> JSONResponse:
    return JSONResponse(
        status_code=status,
        content={
            "success": False,
            "error": {"code": code, "message": message},
        },
    )


def register_error_handlers(app: FastAPI) -> None:

    @app.exception_handler(StarletteHTTPException)
    async def http_exc(_req: Request, exc: StarletteHTTPException):
        return _error_envelope("HTTP_ERROR", str(exc.detail), exc.status_code)

    @app.exception_handler(RequestValidationError)
    async def validation_exc(_req: Request, exc: RequestValidationError):
        # Surface which fields failed without exposing internals
        parts = [
            f"{'.'.join(str(loc) for loc in e['loc'])}: {e['msg']}"
            for e in exc.errors()
        ]
        return _error_envelope("VALIDATION_ERROR", "; ".join(parts), 422)

    @app.exception_handler(Exception)
    async def catch_all(_req: Request, _exc: Exception):
        # Never leak stack traces — adversaries use them to refine attacks
        return _error_envelope("INTERNAL_ERROR", "An unexpected error occurred.", 500)
