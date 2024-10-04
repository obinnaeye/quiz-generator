from fastapi import FastAPI, Query, HTTPException
from app.api import healthcheck
from enum import Enum
from pydantic import BaseModel, EmailStr
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(healthcheck.router, prefix="/api", tags=["healthcheck"])

@app.get("/api")
def read_root():
    return {"message": "Welcome to the Quiz App API!"}


class User(BaseModel):
    username: str
    email: EmailStr
    password: str

mock_db: list[User] = []


# The Register functionality
@app.post("/register/", response_model=User)
def create_user(user:User):
    if any(existing_user.username == user.username for existing_user in mock_db):
        raise HTTPException(status_code=400, detail="Username already taken")
    
    mock_db.append(user)
    return user

# List all the users
@app.get("/users/", response_model=list[User])
def list_users():
    return mock_db

# The login using username or email and password
@app.post("/login/")
def login(username_or_email: str, password: str):
    user = next((u for u in mock_db if (u.username == username_or_email or u.email == username_or_email) and u.password == password), None)

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

@app.get("/api/generate-quiz")
def generate_quiz():
    return {"message": "quiz generated"}