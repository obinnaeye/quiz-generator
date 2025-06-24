from fastapi.responses import StreamingResponse
from .api import healthcheck
import logging
from contextlib import asynccontextmanager
from typing import Dict, Any, List
from fastapi import FastAPI, Body, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from .api import healthcheck
from .api.v1.crud import download_quiz, generate_quiz, get_user_quiz_history
from .app.db.routes import router as db_router
from .app.db.core.connection import startUp
from server.app.quiz.routers.quiz import router as quiz_router
from .schemas.model import UserModel, LoginRequestModel, LoginResponseModel
from .schemas.query import (
    GenerateQuizQuery,
    DownloadQuizQuery,
    GetUserQuizHistoryQuery
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    await startUp()
    yield
from pydantic import BaseModel
from redis import Redis
import random
import os
from dotenv import load_dotenv
from server.celery_config import celery
from server.tasks import send_otp_task, send_password_reset_email
from server.email_utils import send_otp_email
import jwt
from datetime import datetime, timedelta
from .app.db.routes import router as db_router
from .app.auth.routes import router as auth_router  
from .app.db.core.connection import database, users_collection, quizzes_collection
from .app.db.core.redis import get_redis_client

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await startUp()
    redis_client = get_redis_client()

    # Stockage dans app.state
    app.state.database = database
    app.state.users_collection = users_collection
    app.state.quizzes_collection = quizzes_collection
    app.state.redis = redis_client

    yield

    # Shutdown (optionnel)
    redis_client.close()

app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(db_router)
app.include_router(quiz_router, prefix="/api", tags=["quiz"])
app.include_router(healthcheck.router, prefix="/api", tags=["healthcheck"])
app.include_router(auth_router, prefix="/auth", tags=["authentication"])

app.database = database

#mock_db: List[UserModel] = []

@app.get("/api")
def read_root():
    logger.info("Root endpoint accessed")
    return {"message": "Welcome to the Quiz App API!"}

load_dotenv()  

@app.get("/users/", response_model=List[UserModel])
def list_users():
    return mock_db

@app.post("/generate-quiz")
async def generate_quiz_handler(query: GenerateQuizQuery = Body(...)) -> Dict[str, Any]:
    logger.info("Received query: %s", query)
    return generate_quiz(query.user_id, query.question_type, query.num_question)

@app.post("/get-user-quiz-history")
def get_user_quiz_history_handler(query: GetUserQuizHistoryQuery = Body(...)) -> List[Any]:
    logger.info("Received query: %s", query)
    return get_user_quiz_history(query.user_id)

@app.get("/download-quiz")
async def download_quiz_handler(query: DownloadQuizQuery = Depends()) -> StreamingResponse:
    logger.info("Received query: %s", query)
    return download_quiz(query.format, query.question_type, query.num_question)
