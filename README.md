# ExamIntel AI 🚀

An advanced intelligent exam preparation platform that analyzes past question papers, predicts high-yield topics, maps syllabus coverage, and generates personalized AI study plans.

## ✨ Features

- **Multi-Paper Upload**: Support for PDF and Image formats.
- **AI OCR & NLP**: Automated question extraction and semantic topic clustering.
- **Predictive Analytics**: Topic probability scoring and trend analysis.
- **Visual Dashboards**: Enterprise-grade analytics using Recharts.
- **Smart Study Planner**: Dynamic schedules based on exam dates and readiness.
- **Futuristic UI**: Built with Next.js 14, Tailwind CSS, and Framer Motion.

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Shadcn UI.
- **Backend**: FastAPI (Python), SQLAlchemy, PostgreSQL.
- **AI/NLP**: spaCy, Sentence Transformers, Pytesseract OCR.
- **Deployment**: Docker, Vercel, Render.

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.10+ (for local backend development)

### Running with Docker

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/examintel-ai.git
   cd examintel-ai
   ```

2. Start the services:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`
   - API Docs: `http://localhost:8000/docs`

### Local Development

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📂 Project Structure

- `frontend/`: Next.js application.
- `backend/`: FastAPI application.
- `ai_engine/`: Core AI logic (OCR, NLP, Predictions).
- `docker-compose.yml`: Container orchestration.

## 📄 License

MIT License.
