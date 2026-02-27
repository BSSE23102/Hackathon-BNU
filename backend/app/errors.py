from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


def error_response(code: str, message: str, status: int = 500) -> JSONResponse:
    return JSONResponse(
        status_code=status,
        content={
            "success": False,
            "error": {"code": code, "message": message},
        },
    )


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(_req: Request, exc: StarletteHTTPException):
        return error_response(
            code="HTTP_ERROR",
            message=str(exc.detail),
            status=exc.status_code,
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(_req: Request, exc: RequestValidationError):
        messages = "; ".join(
            f"{'.'.join(str(l) for l in e['loc'])}: {e['msg']}" for e in exc.errors()
        )
        return error_response(
            code="VALIDATION_ERROR",
            message=messages,
            status=422,
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(_req: Request, _exc: Exception):
        return error_response(
            code="INTERNAL_ERROR",
            message="An unexpected error occurred.",
            status=500,
        )
