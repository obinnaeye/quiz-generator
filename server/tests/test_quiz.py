import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient
from fastapi import FastAPI

# Import the router you want to test
from server.app.quiz.routers.quiz import router as quiz_router

# To avoid triggering any unwanted side effects (e.g., updating quiz history),
# we can monkeypatch the update_quiz_history function to a dummy function.
def dummy_update_quiz_history(user_id, data):
    return None

# Apply the dummy function to the module where it's used.
import server.app.quiz.utils.questions as questions_module
questions_module.update_quiz_history = dummy_update_quiz_history

# Create a test FastAPI app and include only the quiz router
app = FastAPI()
app.include_router(quiz_router, prefix="/api")

client = TestClient(app)

# --------------------------
# Tests for /get-questions
# --------------------------
def test_get_questions_multichoice_success():
    payload = {
        "question_type": "multichoice",
        "num_questions": 3
    }
    response = client.post("/api/get-questions", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 3
    # Check that each returned question has the expected keys
    for question in data:
        assert "question" in question
        assert "options" in question
        assert "question_type" in question
        assert "answer" in question

def test_get_questions_true_false_success():
    payload = {
        "question_type": "true-false",
        "num_questions": 5
    }
    response = client.post("/api/get-questions", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 5
    for question in data:
        assert "question" in question
        assert "options" in question
        assert isinstance(question["options"], list)
        assert "question_type" in question
        assert question["question_type"] == "true-false"
        assert "answer" in question

def test_get_questions_open_ended_success():
    payload = {
        "question_type": "open-ended",
        "num_questions": 3
    }
    response = client.post("/api/get-questions", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 3
    for question in data:
        # Open-ended questions might not have options so expect an empty list
        assert "question" in question
        assert "options" in question
        assert question["options"] == []  # expecting an empty list
        assert "question_type" in question
        assert question["question_type"] == "open-ended"
        assert "answer" in question
        assert question["answer"] != ""  # answer field should not be empty

def test_get_questions_invalid_type():
    payload = {
        "question_type": "invalid-type",
        "num_questions": 2
    }
    response = client.post("/api/get-questions", json=payload)
    assert response.status_code == 400
    data = response.json()
    assert "Invalid question type" in data["detail"]

def test_get_questions_exceeding_available():
    # Assuming there are 10 multichoice questions in your mock data
    payload = {
        "question_type": "multichoice",
        "num_questions": 20
    }
    response = client.post("/api/get-questions", json=payload)
    assert response.status_code == 400
    data = response.json()
    assert "Requested" in data["detail"]

# --------------------------
# Tests for /grade-answers
# --------------------------
def test_grade_answers_multichoice():
    # Simulate a multichoice question with one correct and one incorrect answer.
    payload = [
        {
            "question": "What is the capital of France?",
            "user_answer": "Paris",
            "correct_answer": "Paris",
            "question_type": "multichoice"
        },
        {
            "question": "Which planet is known as the Red Planet?",
            "user_answer": "Jupiter",  # Incorrect answer
            "correct_answer": "Mars",
            "question_type": "multichoice"
        },
    ]
    response = client.post("/api/grade-answers", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2
    # Verify the first question is marked correct
    assert data[0]["is_correct"] is True
    assert data[0]["result"] == "Correct"
    # Verify the second question is marked incorrect
    assert data[1]["is_correct"] is False
    assert data[1]["result"] == "Incorrect"

def test_grade_answers_true_false():
    # Simulate grading for true-false questions.
    # Note: In our mocks, the "answer" might be stored as a number (0 or 1), but our API converts them to string.
    payload = [
        {
            "question": "The Earth is flat.",
            "user_answer": "false",
            "correct_answer": "false",
            "question_type": "true-false"
        },
        {
            "question": "Water boils at 100°C.",
            "user_answer": "true",
            "correct_answer": "true",
            "question_type": "true-false"
        },
        {
            "question": "The sun revolves around the Earth.",
            "user_answer": "false",
            "correct_answer": "false",
            "question_type": "true-false"
        },
    ]
    response = client.post("/api/grade-answers", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 3
    # Verify that each answer is graded correctly
    for item in data:
        if item["question"] == "Water boils at 100°C.":
            assert item["is_correct"] is True
            assert item["result"] == "Correct"
        else:
            assert item["is_correct"] is True
            assert item["result"] == "Correct"

def test_grade_answers_open_ended():
    # For open-ended questions, grading is based on similarity.
    payload = [
        {
            "question": "Explain the process of photosynthesis.",
            "user_answer": "Photosynthesis uses sunlight to make food from carbon dioxide and water.",
            "correct_answer": (
                "Photosynthesis is the process by which green plants and some organisms use sunlight to synthesize foods with the help of chlorophyll. "
                "It involves the conversion of carbon dioxide and water into glucose and oxygen."
            ),
            "question_type": "open-ended"
        }
    ]
    response = client.post("/api/grade-answers", json=payload)
    assert response.status_code == 200
    data = response.json()
    # Check that we get an accuracy percentage and a result
    assert "accuracy_percentage" in data[0]
    assert "result" in data[0]
    # Since the answers are similar, we expect the response to include a correctness flag.
    assert data[0]["is_correct"] in [True, False]  # Depending on the similarity threshold

# --------------------------
# Tests for /generate-quiz
# --------------------------
@pytest.mark.asyncio
async def test_generate_quiz():
    payload = {
        "profession": "Engineer",
        "num_questions": 3,
        "question_type": "multichoice",
        "difficulty_level": "medium"
    }
    response = client.post("/api/generate-quiz", json=payload)
    assert response.status_code == 200
    data = response.json()
    # Verify the response contains expected keys and values
    assert data["message"] == "Quiz generated successfully"
    assert data["profession"] == "Engineer"
    assert data["num_questions"] == 3
    assert data["question_type"] == "multichoice"
    assert data["difficulty_level"] == "medium"
    # In this mock response, the questions are static. Adjust the test as needed.
    assert isinstance(data["questions"], list)
