# Dockerfile

# ---------- FRONTEND BUILD STAGE ----------
    FROM node:18 AS frontend-build

    # Set the working directory inside the container for the frontend
    WORKDIR /client
    
    # Install PNPM globally
    RUN npm install -g pnpm
    
    # Copy the client directory to the container
    COPY client/ .
    
    # Install frontend dependencies and build the app
    RUN pnpm install
    RUN pnpm run build
    
    # ---------- BACKEND BUILD STAGE ----------
    FROM python:3.12 AS backend-build
    
    # Set the working directory inside the container for the backend
    WORKDIR /server
    
    # Install pipenv globally
    RUN python3 -m pip install --upgrade pip
    RUN python3 -m pip install pipenv
    
    # Copy the Pipfile and Pipfile.lock
    COPY server/Pipfile server/Pipfile.lock ./

    # Set timeout
    ENV PIP_DEFAULT_TIMEOUT=100

    RUN pip install --upgrade pip pipenv && \
    pipenv install --system --deploy
    
    # Copy the rest of the backend code
    COPY server/ .
    
    # ---------- FINAL STAGE ----------
    FROM python:3.12
    
    # Set environment variables for frontend and backend ports
    ENV BACKEND_PORT=8000
    ENV FRONTEND_PORT=3000
    
    # Expose the necessary ports
    EXPOSE ${FRONTEND_PORT}
    EXPOSE ${BACKEND_PORT}
    
    # Copy built frontend from frontend-build stage
    COPY --from=frontend-build /client/.next /client/.next
    COPY --from=frontend-build /client/node_modules /client/node_modules
    COPY --from=frontend-build /client/public /client/public
    
    # Copy the backend from backend-build stage
    COPY --from=backend-build /server /server
    
    # Set the default command for the backend (FastAPI)
    CMD ["pipenv", "run", "fastapi", "dev", "server/app/main.py", "--host", "0.0.0.0", "--port", "${BACKEND_PORT}"]
    