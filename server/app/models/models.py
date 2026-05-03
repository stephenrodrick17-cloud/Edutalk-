from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    papers = relationship("ExamPaper", back_populates="owner")
    study_plans = relationship("StudyPlan", back_populates="user")

class ExamPaper(Base):
    __tablename__ = "exam_papers"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    subject = Column(String, index=True)
    year = Column(Integer)
    file_path = Column(String)
    status = Column(String, default="pending") # pending, processing, completed, error
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="papers")
    questions = relationship("Question", back_populates="paper", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    paper_id = Column(Integer, ForeignKey("exam_papers.id"))
    text = Column(Text, nullable=False)
    marks = Column(Float)
    topic = Column(String, index=True)
    difficulty = Column(String) # easy, medium, hard
    semantic_vector = Column(JSON) # Store embeddings if needed

    paper = relationship("ExamPaper", back_populates="questions")

class Syllabus(Base):
    __tablename__ = "syllabuses"
    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String, index=True)
    content = Column(JSON) # Hierarchical structure of topics
    owner_id = Column(Integer, ForeignKey("users.id"))

class StudyPlan(Base):
    __tablename__ = "study_plans"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    exam_date = Column(DateTime)
    daily_hours = Column(Float)
    plan_data = Column(JSON) # Schedule details
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="study_plans")
