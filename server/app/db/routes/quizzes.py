
from fastapi import APIRouter, HTTPException
from ....app.db.crud.quiz_crud import create_quiz, get_quiz, update_quiz, delete_quiz
from ....app.db.models.models import Quiz, UpdateQuiz
from bson import ObjectId
from ....app.db.core.connection import quizzes_collection

router = APIRouter()

@router.post("/test/create-quiz")
async def create_new_quiz(quiz_data: dict):
    try:
        quiz_id = await create_quiz(quizzes_collection, quiz_data)
        return {"quiz_id": quiz_id}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating quiz: {str(e)}")


@router.get("/test/get-quiz/{quiz_id}", response_model=Quiz)
async def get_quiz_by_id(quiz_id: str):
    try:
        quiz = await get_quiz(quizzes_collection, quiz_id)
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        return quiz
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving quiz: {str(e)}")

@router.put("/test/update-quiz/{quiz_id}")
async def update_existing_quiz(quiz_id: str, quiz_update: UpdateQuiz):
    try:
        updated_quiz_data = await update_quiz(quizzes_collection, quiz_id, quiz_update)
        if not updated_quiz_data:
            raise HTTPException(status_code=404, detail="Quiz not found")
        return updated_quiz_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating quiz: {str(e)}")

@router.delete("/test/delete-quiz/{quiz_id}")
async def delete_existing_quiz(quiz_id: str):
    try:
        result = await delete_quiz(quizzes_collection ,quiz_id)
        if not result:
            raise HTTPException(status_code=404, detail="Quiz not found")
        return {"message": "Quiz deleted successfully", "delete_count": str(result)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting quiz: {str(e)}")
    