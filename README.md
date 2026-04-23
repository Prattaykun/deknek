# Full Stack Internship Assignment

This repository contains a complete full stack web application using:

- Frontend: Next.js (App Router, TypeScript, Tailwind CSS)
- UI: shadcn-style reusable components with polished motion/visual system
- Backend: FastAPI (Python)
- Database: MongoDB Atlas
- Auth: JWT token authentication

## Project Structure

- `frontend` - Next.js client app
- `backend` - FastAPI REST API

## Features Implemented

- User signup with validation
- User login with hashed password verification
- JWT access token generation
- Protected `/api/auth/me` route
- MongoDB user persistence
- Unique index on user email
- Modern responsive UI with animation

## Local Setup

### 1) Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend runs at: `http://localhost:8000`

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

## Environment Variables

### Backend (`backend/.env`)

Already configured with your provided MongoDB URI.

- `MONGODB_URL`
- `DATABASE_NAME`
- `JWT_SECRET_KEY`
- `JWT_ALGORITHM`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `FRONTEND_ORIGIN`

### Frontend (`frontend/.env.local`)

- `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`

## Deployment

### Backend (Render)

1. Push `backend` folder to GitHub.
2. Create a new **Web Service** on Render.
3. Build command:
   - `pip install -r requirements.txt`
4. Start command:
   - `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables from `backend/.env`.

### Frontend (Vercel)

1. Import the `frontend` folder repo in Vercel.
2. Add env var:
   - `NEXT_PUBLIC_API_BASE_URL=https://<your-render-service>.onrender.com`
3. Deploy.

## Submission Checklist

- GitHub repository link
- Live deployed frontend link (Vercel)
- Live deployed backend link (Render)
- Ensure frontend env points to deployed backend URL
