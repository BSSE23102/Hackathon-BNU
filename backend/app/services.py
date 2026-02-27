from app.schemas import ProcessRequest, ProcessResult


def process_input(payload: ProcessRequest) -> ProcessResult:
    """Core business logic — kept free of any FastAPI objects for testability."""
    processed_text = payload.text.strip().upper()
    return ProcessResult(
        result=processed_text,
        metadata={"length": len(payload.text), "options_provided": payload.options is not None},
    )
