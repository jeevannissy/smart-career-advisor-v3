# SmartEduCare Backend — Setup & Run Guide

## Folder structure
```
backend/
├── app.py              ← Flask entry point  (run this)
├── parsing.py          ← PDF / DOCX / TXT extraction
├── skills.py           ← Skill database + extraction logic
├── fit_classifier.py   ← Weighted scoring algorithm
├── requirements.txt
└── uploads/            ← auto-created on first run
```

## 1. Install dependencies
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 2. Run the server
```bash
python app.py
# → Running on http://127.0.0.1:5000
```

## 3. Frontend connection
The React app (Vite, port 5173) already calls:
```
POST http://127.0.0.1:5000/analyze
```
CORS is pre-configured for localhost:5173 and localhost:3000.

## 4. API contract

### POST /analyze
**Request** — multipart/form-data
| Field  | Type | Description                     |
|--------|------|---------------------------------|
| resume | file | Candidate resume (PDF/DOCX/TXT) |
| job    | file | Job description (PDF/DOCX/TXT)  |

**Response — success**
```json
{
  "success": true,
  "score": 74,
  "resume_skills": ["python", "react", "sql"],
  "job_skills":    ["python", "react", "kubernetes", "docker"],
  "score_detail": {
    "skill_overlap_pct": 65.0,
    "text_similarity_pct": 42.3,
    "content_bonus_pct": 70.0
  },
  "suggestions": {
    "skill_gap_analysis":   ["Missing skill: Kubernetes", "Missing skill: Docker"],
    "recommended_learning": ["Complete Kubernetes for Developers (LFS158x)", "..."],
    "suggested_projects":   ["Dockerised microservices app with Compose", "..."],
    "career_roles":         ["Full Stack Developer", "DevOps Engineer"],
    "career_growth_tips":   ["Build a portfolio website showcasing your best projects", "..."]
  }
}
```

**Response — error**
```json
{ "success": false, "error": "Both 'resume' and 'job' files are required." }
```

### GET /health
```json
{ "status": "ok", "service": "SmartEduCare API" }
```
