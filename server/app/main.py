from fastapi import FastAPI, Query, HTTPException
from app.api import healthcheck  # Import the database route
from app.db.routers.quiz_router import router as quiz_router
from app.db.core.database import db_instance
from enum import Enum
from pydantic import BaseModel, EmailStr
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

db_instance.connect()

# Include routers
app.include_router(healthcheck.router, prefix="/api", tags=["healthcheck"])
app.include_router(quiz_router, prefix="/api/quizzes", tags=["quizzes"])  # Add the quiz router

@app.get("/api")
def read_root():
    return {"message": "Welcome to the Quiz App API!"}

# User model definitions
class User(BaseModel):
    username: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    username_or_email: str
    password: str

class LoginResponse(BaseModel):
    message: str
    user: User

mock_db: list[User] = []

# User registration
@app.post("/register/", response_model=User)
def create_user(user: User):
    if any(existing_user.username == user.username for existing_user in mock_db):
        raise HTTPException(status_code=400, detail="Username already taken")

    if any(existing_user.email == user.email for existing_user in mock_db):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    mock_db.append(user)
    return user

# List all users
@app.get("/users/", response_model=list[User])
def list_users():
    return mock_db

# User login
@app.post("/login/", response_model=LoginResponse)
def login(request: LoginRequest):
    user = next(
        (u for u in mock_db if
         (u.username == request.username_or_email or u.email == request.username_or_email) 
         and u.password == request.password), 
        None
    )

    if user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": "Login successful", "user": user}

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust for your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/generate-quiz")
def generate_quiz():
    return {"message": "quiz generated"}
