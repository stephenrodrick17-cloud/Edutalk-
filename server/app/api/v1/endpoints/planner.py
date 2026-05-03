from fastapi import APIRouter, Depends
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....models import models
from ....services.planner_service import planner_service
from ....services.llm_service import llm_service

router = APIRouter()

class PlanRequest(BaseModel):
    exam_date: str  # ISO format date string
    subject: str = "Computer Science"
    daily_hours: float = 4.0

@router.post("/generate")
async def generate_study_plan(request: PlanRequest, db: Session = Depends(get_db)):
    """Generate a personalized study plan based on topic analysis and exam date."""
    # Get questions from DB to determine topics
    questions = db.query(models.Question).all()
    
    # Build topics list from DB or use defaults
    if questions:
        topic_counts = {}
        for q in questions:
            topic = q.topic or "General"
            if topic not in topic_counts:
                topic_counts[topic] = {"name": topic, "priority": 0, "size": 0}
            topic_counts[topic]["priority"] += 1
            topic_counts[topic]["size"] += 2  # 2 hours per question occurrence
        
        topics = list(topic_counts.values())
        # Normalize priority
        max_priority = max(t["priority"] for t in topics) if topics else 1
        for t in topics:
            t["priority"] = t["priority"] / max_priority
    else:
        # Default topics when no papers uploaded
        topics = [
            {"name": "Data Structures & Algorithms", "priority": 0.95, "size": 8},
            {"name": "Dynamic Programming", "priority": 0.92, "size": 6},
            {"name": "Graph Theory", "priority": 0.88, "size": 6},
            {"name": "Operating Systems", "priority": 0.80, "size": 5},
            {"name": "Database Management", "priority": 0.75, "size": 4},
            {"name": "Computer Networks", "priority": 0.70, "size": 4},
            {"name": "Object-Oriented Programming", "priority": 0.65, "size": 3},
            {"name": "Discrete Mathematics", "priority": 0.60, "size": 4},
        ]

    try:
        exam_dt = datetime.fromisoformat(request.exam_date)
    except ValueError:
        exam_dt = datetime.now()
        from datetime import timedelta
        exam_dt += timedelta(days=30)

    plan = planner_service.generate_plan(exam_dt, topics, request.daily_hours)

    return {
        "exam_date": request.exam_date,
        "subject": request.subject,
        "total_topics": len(topics),
        "daily_hours": request.daily_hours,
        "schedule": plan
    }

@router.get("/default")
async def get_default_plan():
    """Return a default study plan for display."""
    return {
        "schedule": [
            {"date": "2026-05-10", "topic": "Asymptotic Notation & Complexity", "hours": 3, "status": "completed"},
            {"date": "2026-05-11", "topic": "Divide and Conquer Strategies", "hours": 3, "status": "completed"},
            {"date": "2026-05-12", "topic": "Dynamic Programming Fundamentals", "hours": 4, "status": "in-progress"},
            {"date": "2026-05-13", "topic": "Graph Algorithms (BFS, DFS, Dijkstra)", "hours": 4, "status": "pending"},
            {"date": "2026-05-14", "topic": "Greedy Algorithms & Applications", "hours": 3, "status": "pending"},
            {"date": "2026-05-15", "topic": "Tree Data Structures (BST, AVL, B-Trees)", "hours": 4, "status": "pending"},
            {"date": "2026-05-16", "topic": "Heaps & Priority Queues", "hours": 3, "status": "pending"},
            {"date": "2026-05-17", "topic": "Hashing & Hash Tables", "hours": 2, "status": "pending"},
            {"date": "2026-05-18", "topic": "Revision: Units 1-4 (Practice Problems)", "hours": 4, "status": "pending"},
            {"date": "2026-05-19", "topic": "Operating Systems: Scheduling & Deadlocks", "hours": 3, "status": "pending"},
        ]
    }
