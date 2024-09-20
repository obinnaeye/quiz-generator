from fastapi.testclient import TestClient
import pytest
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

# Create a mock FastAPI app for testing
app = FastAPI()

# Define a Quiz model
class Quiz(BaseModel):
    id: int
    title: str
    questions: List[str]

# Mock database (in-memory)
mock_db = []

# Define the test client
client = TestClient(app)

# Test data
test_quiz = Quiz(id=1, title="Sample Quiz", questions=["What is your name?", "What is your age?"])

# Tests

def test_create_quiz_success():
    # Simulate creating a quiz
    mock_db.append(test_quiz)
    
    response = client.post("/quizzes/", json=test_quiz.dict())
    
    # Assertions to validate the response
    assert response.status_code == 200
    assert response.json() == test_quiz.dict()

def test_create_quiz_missing_title():
    response = client.post("/quizzes/", json={"questions": ["What is your name?"]})
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Title and questions are required"

def test_create_quiz_missing_questions():
    response = client.post("/quizzes/", json={"title": "Sample Quiz"})
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Title and questions are required"

def test_get_quiz_success():
    # Simulate creating a quiz first to retrieve it
    mock_db.append(test_quiz)
    
    response = client.get("/quizzes/1")
    
    assert response.status_code == 200
    assert response.json() == test_quiz.dict()

def test_get_quiz_not_found():
    response = client.get("/quizzes/999")  # Assuming this ID does not exist
    
    assert response.status_code == 404
    assert response.json()["detail"] == "Quiz not found"

def test_update_quiz_success():
    # Simulate creating a quiz first to update it
    mock_db.append(test_quiz)
    
    updated_quiz = Quiz(id=1, title="Updated Sample Quiz", questions=["What is your favorite color?"])
    
    response = client.put("/quizzes/1", json=updated_quiz.dict())
    
    assert response.status_code == 200
    assert response.json() == updated_quiz.dict()

def test_update_quiz_not_found():
    updated_quiz = Quiz(id=999, title="Updated Sample Quiz", questions=["What is your favorite color?"])
    
    response = client.put("/quizzes/999", json=updated_quiz.dict())
    
    assert response.status_code == 404
    assert response.json()["detail"] == "Quiz not found"

def test_delete_quiz_success():
    # Simulate creating a quiz first to delete it
    mock_db.append(test_quiz)
    
    response = client.delete("/quizzes/1")
    
    assert response.status_code == 200
    
    # Verify that the quiz cannot be retrieved anymore
    get_response = client.get("/quizzes/1")
    
    assert get_response.status_code == 404
    assert get_response.json()["detail"] == "Quiz not found"

def test_delete_quiz_not_found():
    response = client.delete("/quizzes/999")  # Assuming this ID does not exist
    
    assert response.status_code == 404
    assert response.json()["detail"] == "Quiz not found"