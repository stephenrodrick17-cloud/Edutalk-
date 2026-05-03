from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "ExamIntel AI"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-for-jwt" # Should be changed in production
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "examintel"
    # Fallback to SQLite for local development without Docker
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./examintel.db"

    GEMINI_API_KEY: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
