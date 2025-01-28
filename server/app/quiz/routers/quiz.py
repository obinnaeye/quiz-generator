from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict
from pydantic import BaseModel
import random

# Import mock data
from app.quiz.mock_data.multi_choice import mock_multiple_choice_questions
from app.quiz.mock_data.true_false import mock_true_false_questions
from app.quiz.mock_data.open_ended import mock_open_ended_questions

app = FastAPI()

# Allow CORS for all origins (adjust this for your use case)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to specific domains like ['http://localhost:3000']
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

router = APIRouter()

class QuizQuestion(BaseModel):
    question: str
    options: Optional[List[str]]
    question_type: str

def get_mock_data() -> Dict[str, List[dict]]:
    return {
        "multiple_choice": mock_multiple_choice_questions,
        "true_false": mock_true_false_questions,
        "open_ended": mock_open_ended_questions,
    }

@router.get("/quiz", response_model=List[QuizQuestion])
def get_quiz(mock_data: Dict[str, List[dict]] = Depends(get_mock_data)):
    """
    Fetch a randomized set of quiz questions.
    
    - Returns a mix of multiple-choice, true/false, and open-ended questions.
    """
    try:
        multichoice = random.sample(mock_data["multiple_choice"], 2)
        true_false = random.sample(mock_data["true_false"], 2)
        open_ended = random.sample(mock_data["open_ended"], 1)

        questions = multichoice + true_false + open_ended
        random.shuffle(questions)

        return [
            {
                "question": q["question"],
                "options": q.get("options"),
                "question_type": (
                    "multichoice" if "options" in q and len(q.get("options", [])) > 2
                    else "true-false" if q.get("options") == ["true", "false"]
                    else "open-ended"
                ),
            }
            for q in questions
        ]
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Not enough questions in one or more categories") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching quiz questions") from e

@router.get("/quizzes")
def get_all_quizzes(mock_data: Dict[str, List[dict]] = Depends(get_mock_data)):
    """
    Fetch all quizzes from the mock data files.
    """
    try:
        return {"quizzes": mock_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching all quizzes") from e

# Register the router
app.include_router(router)
