from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from app.quiz.utils.questions import get_questions  # Import your logic for fetching questions
from app.quiz.utils.grading import grade_answers  # Import your grading logic

router = APIRouter()

# Define request body structure for grading answers
class UserAnswer(BaseModel):
    question: str
    user_answer: str
    correct_answer: str
    question_type: str  # Add question_type to the model

# API Route to grade answers
@router.post("/grade-answers/")
@router.post("/grade-answers/")
async def grade_user_answers(user_answers: List[UserAnswer]):
    try:
        # Convert each Pydantic model instance to a dict
        graded_result = grade_answers([ua.dict() for ua in user_answers])
        return graded_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error grading answers: {str(e)}")


# Define request body structure for fetching questions
class QuestionRequest(BaseModel):
    question_type: str
    num_questions: int

class QuizQuestion(BaseModel):
    question: str
    options: List[str] | None = None
    question_type: str
    answer: str  # ✅ Added the answer field

# API Route to fetch questions
@router.post("/get-questions/", response_model=List[QuizQuestion])
def fetch_questions(request: QuestionRequest):
    try:
        selected_questions = get_questions(request.question_type, request.num_questions)

        return [
            {
                "question": q["question"],
                "options": q.get("options", []) if isinstance(q.get("options"), list) else [],
                "question_type": request.question_type,
                "answer": str(q.get("answer")) if q.get("answer") is not None else ""

            }
            for q in selected_questions
        ]
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error retrieving questions")

# Define request body structure for quiz generation
class QuizRequest(BaseModel):
    profession: str
    num_questions: int
    question_type: str
    difficulty_level: str

# API Route to generate a quiz
@router.post("/generate-quiz")
async def generate_quiz(request: QuizRequest):
    # Simulate quiz generation logic
    return {
        "message": "Quiz generated successfully",
        "profession": request.profession,
        "num_questions": request.num_questions,
        "question_type": request.question_type,
        "difficulty_level": request.difficulty_level,
        "questions": ["Q1", "Q2", "Q3"],  # Replace with actual quiz data
    }
