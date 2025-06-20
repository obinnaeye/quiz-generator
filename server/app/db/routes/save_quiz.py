from fastapi import APIRouter, HTTPException
from ..models.saved_quiz_model import SavedQuizModel
from ....app.db.core.connection import saved_quiz_collection

router = APIRouter()

@router.post("/save-quiz-entry")
async def save_quiz_entry(quiz: SavedQuizModel):
    try:
        result = await saved_quiz_collection.insert_one(quiz.dict(by_alias=True))
        return {"message": "Quiz saved successfully", "quiz_id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
