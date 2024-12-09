from fastapi import APIRouter, HTTPException
from app.db.crud.quiz_crud import get_all_quizzes, get_quiz_by_id, create_quiz
from app.db.models.quiz_models import Quiz

router = APIRouter()

@router.get("/")
async def fetch_quizzes():
    """
    Retrieve all quizzes.
    """
    return {"quizzes": get_all_quizzes()}

@router.get("/{quiz_id}")
async def fetch_quiz(quiz_id: str):
    """
    Retrieve a quiz by ID.
    """
    quiz = get_quiz_by_id(quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz

@router.post("/")
async def add_quiz(quiz: Quiz):
    """
    Add a new quiz.
    """
    quiz_id = create_quiz(quiz.dict())
    return {"inserted_id": quiz_id}
