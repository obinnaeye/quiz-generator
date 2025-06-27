from fastapi import APIRouter, HTTPException
from ..models.quiz_history_models import QuizHistoryModel
from ....app.db.core.connection import quiz_history_collection  

router = APIRouter()

@router.post("/save-quiz")
async def save_quiz(quiz: QuizHistoryModel):
    try:
        quiz_data = quiz.dict(by_alias=True, exclude_none=True)
        result = await quiz_history_collection.insert_one(quiz_data)
        return {"message": "Quiz saved", "quiz_id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
