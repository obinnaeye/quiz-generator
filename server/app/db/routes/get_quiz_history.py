from fastapi import APIRouter, HTTPException
from ....app.db.core.connection import quiz_history_collection
from bson import ObjectId  

router = APIRouter()

# Helper function to serialize MongoDB document
def serialize_mongo_document(doc):
    doc["_id"] = str(doc["_id"])
    return doc

@router.get("/quiz-history/{user_id}")
async def get_quiz_history(user_id: str):
    try:
        cursor = quiz_history_collection.find({"user_id": user_id})
        quizzes = await cursor.to_list(length=100)

        # Safely serialize all documents
        serialized_quizzes = [serialize_mongo_document(quiz) for quiz in quizzes]

        return serialized_quizzes
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
