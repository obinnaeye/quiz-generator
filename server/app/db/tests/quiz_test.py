import pytest
from app.db.core.database import db_instance

# Define sample data
sample_quiz = {
    "title": "Sample Quiz",
    "description": "A simple quiz for testing.",
    "questions": [
        {"question": "What is 2+2?", "options": ["3", "4"], "answer": "4"}
    ]
}

@pytest.fixture(scope="module")
def setup_test_db():
    """
    Connect to the test database and clean it up after tests.
    """
    db_instance.connect(is_test=True)
    yield  # Run tests
    db_instance.client.drop_database("quiz_generator_test")  # Cleanup after tests

def test_database_connection(setup_test_db):
    """
    Test if the database connection is established successfully.
    """
    assert db_instance.db is not None

def test_insert_quiz(setup_test_db):
    """
    Test inserting a quiz into the database.
    """
    collection = db_instance.get_collection("quizzes")
    quiz_id = collection.insert_one(sample_quiz).inserted_id
    assert quiz_id is not None

def test_fetch_quizzes(setup_test_db):
    """
    Test fetching quizzes from the database.
    """
    collection = db_instance.get_collection("quizzes")
    quizzes = list(collection.find())
    assert len(quizzes) > 0
    assert quizzes[0]["title"] == sample_quiz["title"]

def test_quiz_data_integrity(setup_test_db):
    """
    Test that the fetched quiz matches the inserted data.
    """
    collection = db_instance.get_collection("quizzes")
    quiz = collection.find_one({"title": sample_quiz["title"]})
    assert quiz is not None
    assert quiz["description"] == sample_quiz["description"]
    assert quiz["questions"] == sample_quiz["questions"]
