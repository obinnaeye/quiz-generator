from fastapi import APIRouter, HTTPException
from ....app.db.core.connection import quiz_history_collection
from bson import ObjectId  
from datetime import datetime

router = APIRouter()

# Helper function to serialize MongoDB document
def serialize_mongo_document(doc):
    doc_dict = {}
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            doc_dict[key] = str(value)
        elif isinstance(value, datetime):
            doc_dict[key] = value.isoformat()
        else:
            doc_dict[key] = value
    return doc_dict

@router.get("/quiz-history/{user_id}")
async def get_quiz_history(user_id: str):
    try:
        cursor = quiz_history_collection.find({"user_id": user_id}).sort("_id", -1)
        quizzes = await cursor.to_list(length=100)
        serialized_quizzes = [serialize_mongo_document(quiz) for quiz in quizzes]
        return serialized_quizzes
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))