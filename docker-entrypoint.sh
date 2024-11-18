#!/bin/bash

# Start the backend (FastAPI)
pipenv run fastapi dev server/app/main.py --host 0.0.0.0 --port ${BACKEND_PORT} &

# Start the frontend (Next.js)
cd /client && pnpm install && pnpm run dev --port ${FRONTEND_PORT}
