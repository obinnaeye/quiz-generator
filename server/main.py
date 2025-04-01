
from fastapi import FastAPI, Query, HTTPException, Body, Depends 
from fastapi.responses import StreamingResponse
import logging
from contextlib import asynccontextmanager
from typing import Dict, Any, List
from fastapi.middleware.cors import CORSMiddleware

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

from pydantic import BaseModel
from redis import Redis
import random
import os
from dotenv import load_dotenv
from server.celery_config import celery
from server.tasks import send_otp_task
from server.email_utils import send_otp_email
import jwt
from datetime import datetime, timedelta
from .app.db.routes import router as db_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await startUp()
    yield


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

mock_db: List[UserModel] = []

@app.get("/api")
def read_root():
    logger.info("Root endpoint accessed")
    return {"message": "Welcome to the Quiz App API!"}


load_dotenv()  # Load environment variables

mock_db: list[UserModel] = []

# The Register functionality
# Redis setup
redis_client = Redis(host="localhost", port=6379, db=0, decode_responses=True)

# Generate OTP
def generate_otp():
    return str(random.randint(100000, 999999))  # 6-digit OTP

# Generate JWT token
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"

def generate_verification_token(email: str):
    expire = datetime.utcnow() + timedelta(minutes=5)  # Token expires in 5 minutes
    payload = {"sub": email, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

# Decode JWT token
def decode_verification_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid token")

@app.post("/register/")
async def register_user(user: UserModel):
    # Check if email already exists
    if any(u["email"] == user.email for u in mock_db):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    otp = generate_otp()
    token = generate_verification_token(user.email)
    
    # Store OTP and token in Redis
    redis_client.setex(f"otp:{user.email}", 300, otp)  # OTP expires in 5 minutes
    redis_client.setex(f"token:{user.email}", 1800, token)  # Token expires in 30 minutes
    
    # Asynchronously send email via Celery
    send_otp_task.delay(user.email, otp, token)
    
    # Add user to mock database with is_verified=False
    mock_db.append(user.dict())
    
    return {"message": "User registered. Please check your email for verification."}

# Verify OTP
@app.post("/verify-otp/")
async def verify_otp(email: str, otp: str):
    stored_otp = redis_client.get(f"otp:{email}")
    attempts = int(redis_client.get(f"attempts:{email}") or 0)
    
    if attempts >= 4:
        raise HTTPException(status_code=403, detail="Too many attempts. Request a new OTP.")
    if stored_otp is None:
        raise HTTPException(status_code=400, detail="OTP expired or not requested.")
    if otp != stored_otp:
        redis_client.incr(f"attempts:{email}")  # Increase attempt count
        raise HTTPException(status_code=401, detail="Invalid OTP. Try again.")
    
    # OTP verified: Mark user as verified
    for user in mock_db:
        if user["email"] == email:
            user["is_verified"] = True
            break
    
    # Clean up Redis keys
    redis_client.delete(f"otp:{email}")
    redis_client.delete(f"token:{email}")  # Also delete the token
    return {"message": "OTP verified successfully!"}

# Verify Link
@app.get("/verify-link/")
async def verify_link(token: str):
    try:
        email = decode_verification_token(token)
    except HTTPException as e:
        raise e  # Re-raise the exception for invalid/expired tokens
    
    # Token verified: Mark user as verified
    for user in mock_db:
        if user["email"] == email:
            user["is_verified"] = True
            break
    
    # Clean up Redis keys
    redis_client.delete(f"token:{email}")
    redis_client.delete(f"otp:{email}")  # Also delete the OTP
    return {"message": "Email verified successfully!"}

@app.get("/users/", response_model=List[UserModel])
def list_users():
    return mock_db

@app.post("/login/", response_model=LoginResponseModel)
def login(request: LoginRequestModel):
    user = next(
        (
            u for u in mock_db 
            if (u.username == request.username_or_email or u.email == request.username_or_email)
            and u.password == request.password
        ),
        None
    )
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "user": user}

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
