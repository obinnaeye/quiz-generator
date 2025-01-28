from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from mock_data.multi_choice import mock_multiple_choice_questions
from mock_data.open_ended import mock_open_ended_questions
from mock_data.true_false import mock_true_false_questions
import random

app = FastAPI()

class QuestionRequest(BaseModel):
    question_type: str
    num_questions: int

def shuffle_array(array):
    
    return random.sample(array, len(array))

@app.post("/get-shuffled-questions/")
async def get_shuffled_questions(request: QuestionRequest):
    # Validate `question_type`
    valid_types = ["multichoice", "true-false", "open-ended"]
    if request.question_type not in valid_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid question_type '{request.question_type}'. Valid types are: {valid_types}."
        )
    
    # Fetch questions based on type
    if request.question_type == "multichoice":
        questions = shuffle_array(mock_multiple_choice_questions)
    elif request.question_type == "true-false":
        questions = shuffle_array(mock_true_false_questions)
    elif request.question_type == "open-ended":
        questions = shuffle_array(mock_open_ended_questions)

    # Validate `num_questions`
    if request.num_questions < 1:
        raise HTTPException(
            status_code=400,
            detail="num_questions must be at least 1."
        )
    if request.num_questions > len(questions):
        raise HTTPException(
            status_code=400,
            detail=f"Requested {request.num_questions} questions, but only {len(questions)} available."
        )
    
    return {"questions": questions[:request.num_questions]}
