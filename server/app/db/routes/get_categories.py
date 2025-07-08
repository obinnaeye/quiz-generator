from fastapi import APIRouter, Query
from typing import List
from ....app.db.core.connection import quiz_categories_collection
from ....app.db.models.quiz_category_models import QuizCategoryModel

router = APIRouter()


@router.get("/categories", response_model=List[str])
async def get_categories():
    """
    Get all distinct main categories.
    """
    categories = await quiz_categories_collection.distinct("category")
    return categories


@router.get("/category/{category}/types", response_model=List[str])
async def get_quiz_types(category: str):
    """
    Get all question types for a given category.
    """
    types = await quiz_categories_collection.distinct(
        "question_type", {"category": category}
    )
    return types


@router.get(
    "/category/{category}/type/{question_type}",
    response_model=List[QuizCategoryModel],
)
async def get_quizzes_by_category_type(
    category: str,
    question_type: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(5, ge=1, le=50),
):
    """
    Get quizzes for a specific category and question type with pagination.
    """
    skip = (page - 1) * page_size
    quizzes = await quiz_categories_collection.find(
        {"category": category, "question_type": question_type}
    ).skip(skip).limit(page_size).to_list(length=page_size)
    return quizzes
