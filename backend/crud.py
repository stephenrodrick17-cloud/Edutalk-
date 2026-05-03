from sqlalchemy.orm import Session
import models, schemas, auth

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password, full_name=user.full_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_paper(db: Session, paper: schemas.PaperCreate, owner_id: int, file_path: str):
    db_paper = models.Paper(**paper.dict(), owner_id=owner_id, file_path=file_path)
    db.add(db_paper)
    db.commit()
    db.refresh(db_paper)
    return db_paper

def get_papers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Paper).offset(skip).limit(limit).all()

def create_question(db: Session, question: schemas.QuestionBase, paper_id: int, topic_id: int = None):
    db_question = models.Question(**question.dict(), paper_id=paper_id, topic_id=topic_id)
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

def get_topics(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Topic).offset(skip).limit(limit).all()

def get_or_create_topic(db: Session, name: str, subject: str):
    db_topic = db.query(models.Topic).filter(models.Topic.name == name, models.Topic.subject == subject).first()
    if not db_topic:
        db_topic = models.Topic(name=name, subject=subject)
        db.add(db_topic)
        db.commit()
        db.refresh(db_topic)
    return db_topic
