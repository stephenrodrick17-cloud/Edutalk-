FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for OCR and PostgreSQL
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    libmagic1 \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/
COPY ai_engine/ ./ai_engine/

WORKDIR /app/backend
ENV PYTHONPATH=/app

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
