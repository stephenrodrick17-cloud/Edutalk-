from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ....services.llm_service import llm_service

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    context: str = ""

@router.post("/message")
async def chat_message(request: ChatRequest):
    system_prompt = (
        "You are ExamIntel AI, a premium study assistant. "
        "Use the provided context about the student's exam performance to give specific advice. "
        "Be professional, encouraging, and provide mnemonics or study tips where appropriate."
    )
    
    prompt = f"User: {request.message}\nContext: {request.context}"
    
    response = await llm_service.generate_response(prompt, system_prompt)
    return {"response": response}
