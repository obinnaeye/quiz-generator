from fastapi import APIRouter, HTTPException
from ....app.db.core.connection import saved_quiz_collection
from bson import ObjectId

router = APIRouter()

@router.get("/saved-quizzes/{user_id}")
async def get_saved_quizzes(user_id: str):
    try:
        cursor = saved_quiz_collection.find({"user_id": user_id})
        quizzes = await cursor.to_list(length=100)
        for quiz in quizzes:
            quiz["_id"] = str(quiz["_id"])
        return quizzes
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
