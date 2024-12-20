from fastapi import HTTPException
from ..mocks.mock_quiz_data import (
    quiz_data_multiple_choice,
    quiz_data_open_ended,
    quiz_data_true_false
)
from .update_quiz_history import update_quiz_history

def generate_quiz(user_id: str, question_type: str, num_question: int):
    if question_type == "multichoice":
        questions = quiz_data_multiple_choice
    elif question_type == "true-false":
        questions = quiz_data_true_false
    elif question_type == "open-ended":
        questions = quiz_data_open_ended
    else:
        raise HTTPException(status_code=400, detail="Invalid question type")

    data = questions[:num_question]
    update_quiz_history(user_id, data)
    # print('a call was made to the generate-quiz method with these params', {question_type, num_question})
    # print('generate-quiz method with the data for update', data)
    return {"quiz_data": data}
