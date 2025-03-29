# ---------- FRONTEND SERVICE ----------
    FROM node:18 AS frontend-service

    RUN corepack enable


    WORKDIR /client
        
    COPY client/package.json client/pnpm-lock.yaml ./
    
    RUN pnpm install --frozen-lockfile
    
    COPY client/ .
        
# ---------- BACKEND SERVICE ----------
    FROM python:3.12 AS backend-service
    
    WORKDIR /server
    
    RUN python3 -m pip install --upgrade pip pipenv
    
    COPY server/Pipfile server/Pipfile.lock ./
    
    RUN pipenv install --system --deploy
    
    COPY server/ .
