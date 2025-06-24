from fastapi import APIRouter
from .health import router as health_router
from .quizzes import router as quizzes_router
from .users import router as users_router
from .folders_routes import router as folder_router

__all__ = ["router"]


router = APIRouter()

router.include_router(health_router, prefix="/health", tags=["health"])
router.include_router(quizzes_router, prefix="/quizzes", tags=["quizzes"])
router.include_router(users_router, prefix="/users", tags=["users"])
router.include_router(folder_router, prefix="/folders", tags=["folders"])
