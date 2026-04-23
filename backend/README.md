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
- `MONGODB_TLS_DISABLE_OCSP_ENDPOINT_CHECK=true` can help avoid TLS OCSP endpoint issues in hosted environments.

## Render Deploy

- Use `rootDir=backend` for the Python service.
- Pin Python to `3.12.10` (via `backend/runtime.txt` or the root `render.yaml` blueprint).
- Keep secrets in Render environment variables: `MONGODB_URL`, `JWT_SECRET_KEY`, `FRONTEND_ORIGIN`.
- Start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```
