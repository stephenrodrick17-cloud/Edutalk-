from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class QuestionBase(BaseModel):
    text: str
    marks: Optional[float] = 5.0
    topic: Optional[str] = "General"
    difficulty: Optional[str] = "medium"

class QuestionCreate(QuestionBase):
    paper_id: int

class Question(QuestionBase):
    id: int
    paper_id: int

    class Config:
        from_attributes = True

class PaperBase(BaseModel):
    title: str
    subject: Optional[str] = None
    year: Optional[int] = None

class PaperCreate(PaperBase):
    pass

class Paper(PaperBase):
    id: int
    status: str
    created_at: datetime
    questions: List[Question] = []

    class Config:
        from_attributes = True

class TopicPrediction(BaseModel):
    topic: str
    probability: float
    difficulty: str
    importance_score: float
