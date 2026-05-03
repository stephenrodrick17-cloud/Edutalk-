from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any, Dict
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class PaperBase(BaseModel):
    title: str
    subject: str
    year: int

class PaperCreate(PaperBase):
    pass

class Paper(PaperBase):
    id: int
    file_path: str
    upload_date: datetime
    owner_id: int

    class Config:
        orm_mode = True

class QuestionBase(BaseModel):
    text: str
    marks: float
    difficulty: str

class Question(QuestionBase):
    id: int
    paper_id: int
    topic_id: Optional[int]

    class Config:
        orm_mode = True

class TopicBase(BaseModel):
    name: str
    subject: str

class Topic(TopicBase):
    id: int
    frequency: int
    importance_score: float

    class Config:
        orm_mode = True

class StudyPlanBase(BaseModel):
    title: str
    start_date: datetime
    end_date: datetime
    schedule: Any

class StudyPlan(StudyPlanBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = []
