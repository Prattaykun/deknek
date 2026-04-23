# FastAPI Backend

## Stack

- FastAPI
- Motor (MongoDB async driver)
- JWT (`python-jose`)
- Password hashing (`passlib` + bcrypt)

## Run Locally

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

- `GET /health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token required)

## Notes

- On startup, backend connects to MongoDB and ensures a unique email index.
- CORS origin is controlled by `FRONTEND_ORIGIN` in `.env`.
