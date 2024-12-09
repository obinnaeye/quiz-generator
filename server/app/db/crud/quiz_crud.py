from app.db.core.database import db_instance
from bson.objectid import ObjectId

def get_all_quizzes():
    """
    Fetch all quizzes from the database.
    """
    collection = db_instance.get_collection("quizzes")
    return list(collection.find())

def get_quiz_by_id(quiz_id: str):
    """
    Fetch a quiz by its ID.
    """
    collection = db_instance.get_collection("quizzes")
    return collection.find_one({"_id": ObjectId(quiz_id)})

def create_quiz(quiz_data: dict):
    """
    Create a new quiz in the database.
    """
    collection = db_instance.get_collection("quizzes")
    result = collection.insert_one(quiz_data)
    return str(result.inserted_id)
