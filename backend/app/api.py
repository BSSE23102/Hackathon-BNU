from fastapi import APIRouter

from app.schemas import ProcessRequest, SuccessResponse
from app.services import process_input

router = APIRouter()


@router.post("/process", response_model=SuccessResponse)
async def process_endpoint(payload: ProcessRequest):
    result = process_input(payload)
    return SuccessResponse(data=result)
