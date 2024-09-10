from fastapi import FastAPI
from app.api import healthcheck

app = FastAPI()

app.include_router(healthcheck.router, prefix="/api", tags=["healthcheck"])

@app.get("/api")
def read_root():
    return {"message": "Welcome to the Quiz App API!"}
