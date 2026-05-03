from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, JSON, Boolean, Text
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    
    papers = relationship("Paper", back_populates="owner")
    study_plans = relationship("StudyPlan", back_populates="owner")

class Paper(Base):
    __tablename__ = "papers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    subject = Column(String)
    year = Column(Integer)
    file_path = Column(String)
    upload_date = Column(DateTime, default=datetime.datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("User", back_populates="papers")
    questions = relationship("Question", back_populates="paper")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    paper_id = Column(Integer, ForeignKey("papers.id"))
    text = Column(Text)
    marks = Column(Float)
    difficulty = Column(String) # easy, medium, hard
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=True)
    
    paper = relationship("Paper", back_populates="questions")
    topic = relationship("Topic", back_populates="questions")

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    subject = Column(String)
    frequency = Column(Integer, default=0)
    importance_score = Column(Float, default=0.0)
    
    questions = relationship("Question", back_populates="topic")

class StudyPlan(Base):
    __tablename__ = "study_plans"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    schedule = Column(JSON) # Detailed day-by-day plan
    
    owner = relationship("User", back_populates="study_plans")

class Syllabus(Base):
    __tablename__ = "syllabuses"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String, unique=True)
    content = Column(Text) # Extracted syllabus text
    file_path = Column(String)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)
