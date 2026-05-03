from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
import os
import uuid
from ....core.database import get_db
from ....models import models
from ....services.ocr_service import ocr_service
from ....services.nlp_service import nlp_service

router = APIRouter()

UPLOAD_DIR = "uploads/papers"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=None)
async def upload_paper(
    file: UploadFile = File(...),
    subject: str = None,
    year: int = None,
    db: Session = Depends(get_db)
):
    file_id = str(uuid.uuid4())
    file_extension = os.path.splitext(file.filename)[1]
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}{file_extension}")
    
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Create DB entry
    db_paper = models.ExamPaper(
        title=file.filename,
        subject=subject,
        year=year,
        file_path=file_path,
        status="processing"
    )
    db.add(db_paper)
    db.commit()
    db.refresh(db_paper)
    
    # Run OCR and NLP (In a real app, this should be a background task)
    try:
        text = await ocr_service.process_file(file_path)
        questions_data = nlp_service.extract_questions(text)
        
        for q in questions_data:
            keywords = nlp_service.get_keywords(q['text'])
            topic = keywords[0] if keywords else "General"
            difficulty = nlp_service.classify_difficulty(q['text'])
            
            db_q = models.Question(
                paper_id=db_paper.id,
                text=q['text'],
                topic=topic,
                difficulty=difficulty,
                marks=5.0 # Default marks
            )
            db.add(db_q)
        
        db_paper.status = "completed"
        db.commit()
    except Exception as e:
        db_paper.status = "error"
        db.commit()
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"id": db_paper.id, "status": db_paper.status}

@router.get("/", response_model=None)
def get_papers(db: Session = Depends(get_db)):
    return db.query(models.ExamPaper).all()
