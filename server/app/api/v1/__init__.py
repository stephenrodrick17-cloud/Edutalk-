from fastapi import APIRouter
from .endpoints import papers, analytics, chat, planner, predictions

api_router = APIRouter()

api_router.include_router(papers.router, prefix="/papers", tags=["papers"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(planner.router, prefix="/planner", tags=["planner"])
api_router.include_router(predictions.router, prefix="/predictions", tags=["predictions"])
