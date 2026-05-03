from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas, auth, crud, database
from database import engine, get_db
from llm_service import LLMService
from ai_engine.ocr import OCREngine
import os

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ExamIntel AI API")
llm = LLMService()
ocr = OCREngine()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False, # Must be False when using allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.get("/")
def read_root():
    return {"message": "Welcome to ExamIntel AI API"}

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.post("/upload-paper/")
async def upload_paper(
    title: str,
    subject: str,
    year: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    print(f"--- UPLOAD START: {file.filename} ---")
    
    # 1. Save file to a secure absolute path
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        upload_dir = os.path.join(base_dir, "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        
        file_path = os.path.join(upload_dir, file.filename)
        content = await file.read()
        
        with open(file_path, "wb") as f:
            f.write(content)
        print(f"1. File saved at: {file_path}")
    except Exception as e:
        print(f"ERROR Step 1: {str(e)}")
        raise HTTPException(status_code=500, detail=f"File save error: {str(e)}")
    
    # 2. Extract Text & Analyze
    analysis = None
    try:
        print(f"2. Starting extraction/analysis for {file.filename}")
        
        # If it's an image, we can try direct vision analysis first or as a fallback
        is_image = file.filename.lower().endswith(('.png', '.jpg', '.jpeg'))
        
        if is_image:
            try:
                # Try PDF.co first for text extraction (as requested)
                extracted_text = await ocr.extract_with_pdf_co(file_path)
                if extracted_text:
                    print("2a. PDF.co text extraction successful. Sending to LLM...")
                    analysis = await llm.analyze_paper_text(extracted_text)
            except Exception as e:
                print(f"2b. PDF.co failed for image, falling back to Gemini Vision: {str(e)}")
            
            # If PDF.co failed or didn't return text, use Gemini Vision directly
            if not analysis:
                print("2c. Starting direct Gemini Vision analysis...")
                analysis = await llm.analyze_paper_image(file_path)
        else:
            # It's a PDF
            extracted_text = await ocr.extract_with_pdf_co(file_path)
            if not extracted_text:
                raise HTTPException(status_code=400, detail="Could not extract text from PDF via PDF.co")
            
            print("2d. PDF text extraction successful. Sending to LLM...")
            analysis = await llm.analyze_paper_text(extracted_text)
            
        if not analysis:
            raise HTTPException(status_code=400, detail="Could not analyze document. AI returned no results.")
            
        print(f"3. Analysis successful ({len(analysis.get('questions', []))} questions found)")
    except Exception as e:
        print(f"ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
    
    print(f"--- UPLOAD COMPLETE: {file.filename} ---")
    return {
        "filename": file.filename, 
        "status": "success",
        "analysis": analysis
    }

@app.post("/upload-syllabus/")
async def upload_syllabus(
    subject: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_path = f"uploads/syllabus_{file.filename}"
    os.makedirs("uploads", exist_ok=True)
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Extract Text using PDF.co (preferred) or local OCR
    if file.filename.lower().endswith(('.pdf', '.png', '.jpg', '.jpeg')):
        extracted_text = await ocr.extract_with_pdf_co(file_path)
    else:
        extracted_text = ocr.extract_from_bytes(content)
        
    # Save to DB logic here...
    
    return {"status": "syllabus uploaded", "subject": subject}

@app.get("/generate-plan/{subject}")
async def generate_plan(subject: str, db: Session = Depends(get_db)):
    # 1. Get analytics for subject
    # 2. Call llm.generate_study_plan
    plan = await llm.generate_study_plan({"subject": subject}, "2026-06-01")
    return plan

@app.get("/practice-questions/{topic}")
async def get_practice_questions(topic: str, difficulty: str = "medium"):
    questions = await llm.generate_practice_questions(topic, difficulty)
    return {"topic": topic, "questions": questions}

@app.post("/chat")
async def chat(request: schemas.ChatRequest):
    response = await llm.chat_with_teacher(request.message, request.history)
    return {"response": response}

@app.get("/analytics/topics")
async def get_topic_analytics(db: Session = Depends(get_db)):
    # Logic to return topic frequency and trends
    return {"topics": []}

@app.get("/predictions")
async def get_predictions(db: Session = Depends(get_db)):
    # Logic to return predicted topics
    return {"predictions": []}
