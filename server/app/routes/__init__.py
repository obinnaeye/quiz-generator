from fastapi import APIRouter
from app.routes.health import router as health_router
from app.routes.quizzes import router as quizzes_router

router = APIRouter()

router.include_router(health_router, prefix="/health", tags=["health"])
router.include_router(quizzes_router, prefix="/quizzes", tags=["quizzes"])

