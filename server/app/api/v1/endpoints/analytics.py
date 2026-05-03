from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....models import models
from ....services.prediction_service import prediction_service

router = APIRouter()

@router.get("/topic-frequency")
def get_topic_frequency(db: Session = Depends(get_db)):
    questions = db.query(models.Question).all()
    topic_data = []
    for q in questions:
        topic_data.append({
            "topic": q.topic,
            "year": q.paper.year if q.paper else 2024,
            "marks": q.marks or 0
        })
    
    if not topic_data:
        return []
        
    predictions = prediction_service.calculate_importance(topic_data)
    return predictions

@router.get("/readiness-score")
def get_readiness_score(db: Session = Depends(get_db)):
    # Mock readiness score calculation
    return {"readiness": 75.5, "confidence": "High"}
