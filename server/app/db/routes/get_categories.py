from fastapi import APIRouter
from ....app.db.core.connection import quiz_categories_collection

router = APIRouter()

@router.get("/categories")
async def get_categories():
    categories = await quiz_categories_collection.distinct("category")
    return categories

@router.get("/category/{category}/types")
async def get_quiz_types(category: str):
    types = await quiz_categories_collection.distinct("question_type", {"category": category})
    return types

@router.get("/category/{category}/type/{question_type}")
async def get_quizzes_by_category_type(category: str, question_type: str, page: int = 1, page_size: int = 5):
    skip = (page - 1) * page_size
    quizzes = await quiz_categories_collection.find(
        {"category": category, "question_type": question_type}
    ).skip(skip).limit(page_size).to_list(length=page_size)
    return quizzes
