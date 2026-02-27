from pydantic import BaseModel


class ProcessRequest(BaseModel):
    text: str
    options: dict | None = None


class ProcessResult(BaseModel):
    result: str
    metadata: dict = {}


class SuccessResponse(BaseModel):
    success: bool = True
    data: ProcessResult
