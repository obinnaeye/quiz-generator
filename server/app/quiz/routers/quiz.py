from fastapi import APIRouter, HTTPException
from typing import List, Literal
from pydantic import BaseModel
from server.app.quiz.utils.questions import get_questions
from server.app.quiz.utils.grading import grade_answers
from server.app.quiz.utils.openai_grading import grade_answers_openai

router = APIRouter()

class UserAnswer(BaseModel):
    question: str
    user_answer: str
    correct_answer: str
    question_type: str
    source: Literal["mock", "ai"] = "mock"

@router.post("/grade-answers")
async def grade_user_answers(user_answers: List[UserAnswer]):
    try:
        parsed_answers = [ua.dict() for ua in user_answers]
        source = parsed_answers[0].get("source", "mock")

        if source == "ai":
            graded_result = await grade_answers_openai(parsed_answers)
        else:
            graded_result = grade_answers(parsed_answers)

        return graded_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error grading answers: {str(e)}")

class QuestionRequest(BaseModel):
    question_type: str
    num_questions: int
    profession: str | None = None
    audience_type: str | None = None
    custom_instruction: str | None = None
    difficulty_level: str | None = None

class QuizQuestion(BaseModel):
    question: str
    options: List[str] | None = None
    question_type: str
    answer: str

@router.post("/get-questions", response_model=List[QuizQuestion])
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

class QuizRequest(BaseModel):
    profession: str
    num_questions: int
    question_type: str
    difficulty_level: str

@router.post("/generate-quiz")
async def generate_quiz(request: QuizRequest):
    return {
        "message": "Quiz generated successfully",
        "profession": request.profession,
        "num_questions": request.num_questions,
        "question_type": request.question_type,
        "difficulty_level": request.difficulty_level,
        "questions": ["Q1", "Q2", "Q3"],
    }
