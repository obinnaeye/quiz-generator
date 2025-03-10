from typing import Any
from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import StreamingResponse
from api import healthcheck
import logging
from fastapi.middleware.cors import CORSMiddleware
from api.v1.crud import (
    download_quiz,
    generate_quiz,
    get_user_quiz_history
)
from schemas.model import (
    UserModel,
    LoginRequestModel,
    LoginResponseModel,
)
from schemas.query import (
    GenerateQuizQuery,
    DownloadQuizQuery,
    GetUserQuizHistoryQuery
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        # logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)

app = FastAPI()

app.include_router(healthcheck.router, prefix="/api", tags=["healthcheck"])
logger = logging.getLogger(__name__)

@app.get("/api")
def read_root():
    logger.info("Root endpoint accessed")
    return {"message": "Welcome to the Quiz App API!"}

mock_db: list[UserModel] = []

# The Register functionality
@app.post("/register/", response_model=UserModel)
def create_user(user:UserModel):
    if any(existing_user.username == user.username for existing_user in mock_db):
        raise HTTPException(status_code=400, detail="Username already taken")

    if any(existing_user.email == user.email for existing_user in mock_db):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    mock_db.append(user)
    return user

# List all the users
@app.get("/users/", response_model=list[UserModel])
def list_users():
    return mock_db

@app.post("/login/", response_model=LoginResponseModel)
def login(request: LoginRequestModel):  
    user = next((u for u in mock_db if (u.username == request.username_or_email or u.email == request.username_or_email) and u.password == request.password), None)

    if user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": "Login successful", "user": user}

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Or use ["*"] to allow all origins (less secure)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

@app.get("/generate-quiz")
async def generate_quiz_handler(query: GenerateQuizQuery = Query(...))-> dict[str, Any]:
    logger.info("Received query: %s" % query)
    return generate_quiz(query.user_id, query.question_type, query.num_question)

@app.get("/get-user-quiz-history")
def get_user_quiz_history_handler(query: GetUserQuizHistoryQuery = Query(...))-> list:
    logger.info("Received query: %s" % query)
    return get_user_quiz_history(query.user_id)

@app.get("/download-quiz")
async def download_quiz_handler(query: DownloadQuizQuery = Query(...)) -> StreamingResponse:
    logger.info("Received query: %s" % query)
    return download_quiz(query.format, query.question_type, query.num_question)
