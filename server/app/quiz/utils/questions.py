from fastapi import HTTPException
import random
from server.app.quiz.mock_data.multi_choice import mock_multiple_choice_questions
from server.app.quiz.mock_data.true_false import mock_true_false_questions
from server.app.quiz.mock_data.open_ended import mock_open_ended_questions

# Import the update_quiz_history function (adjust the import path as needed)
from server.api.v1.crud.update_quiz_history import update_quiz_history

def get_questions(question_type: str, num_questions: int, user_id: str = "defaultUserId"):
    # Mapping user input to the correct data source
    question_data = {
        "multichoice": mock_multiple_choice_questions,
        "true-false": mock_true_false_questions,
        "open-ended": mock_open_ended_questions,
    }

    # Validate question type
    if question_type not in question_data:
        raise HTTPException(status_code=400, detail=f"Invalid question type: {question_type}")

    questions = question_data[question_type]

    # Validate the requested number of questions
    if num_questions > len(questions):
        raise HTTPException(
            status_code=400,
            detail=f"Requested {num_questions} questions, but only {len(questions)} available.",
        )

    # Return only the requested number of questions
    data = random.sample(questions, num_questions)
    
    # Update the user's quiz history with the selected questions
    update_quiz_history(user_id, data)
    
    return data
