from fastapi import FastAPI, Query, HTTPException
from app.api import healthcheck
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from .app_store import (
    generate_csv,
    generate_docx,
    generate_pdf,
    generate_txt,
)
from libs.model import (
    UserModel,
    LoginRequestModel,
    LoginResponseModel,
)
from libs.query import (
    GenerateQuizQuery,
)
from .mock_quiz_data import quiz_data_multiple_choice, quiz_data_true_false, quiz_data_open_ended

app = FastAPI()

app.include_router(healthcheck.router, prefix="/api", tags=["healthcheck"])

@app.get("/api")
def read_root():
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

# @app.get("/api/generate-quiz")
# def generate_quiz():
#     return {"message": "quiz generated"}

@app.get("/generate-quiz")
async def generate_quiz(query: GenerateQuizQuery = Query(...)):
    if query.question_type == "multichoice":
        questions = quiz_data_multiple_choice
    elif query.question_type == "true-false":
        questions = quiz_data_true_false
    elif query.question_type == "open-ended":
        questions = quiz_data_open_ended
    else:
        raise HTTPException(status_code=400, detail="Invalid question type")

    print('a call was made to the generate-quiz method with these params', {query.question_type, query.num_question})
    return {"quiz_data": questions[:query.num_question]}


@app.get("/download-quiz/")
async def download_quiz(
    format: str = Query("txt", description="File format for the quiz data (txt, csv, pdf, etc.)"),
    type: str = Query("multichoice", description="Type of questions requested (multichoice, true-false, open-ended)"),
    numQuestion: int = Query(..., description="Number of questions to include in the download", ge=1)
):
    if type == "multichoice":
        quiz_data = quiz_data_multiple_choice
    elif type == "true-false":
        quiz_data = quiz_data_true_false
    elif type == "open-ended":
        quiz_data = quiz_data_open_ended
    else:
        raise HTTPException(status_code=400, detail="Unsupported question_type")

    sliced_quiz_data = quiz_data[:numQuestion]
    
    if format == "txt":
        buffer = generate_txt(sliced_quiz_data)
        content_type = "text/plain"
    elif format == "csv":
        buffer = generate_csv(sliced_quiz_data)
        content_type = "text/csv"
    elif format == "pdf":
        buffer = generate_pdf(sliced_quiz_data)
        content_type = "application/pdf"
    elif format == "docx":
        buffer = generate_docx(sliced_quiz_data)
        content_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format")

    return StreamingResponse(
        buffer, media_type=content_type, headers={
            "Content-Disposition": f"attachment; filename=quiz_data.{format}"
        }
    )
