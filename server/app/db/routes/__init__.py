from fastapi import APIRouter
from ....app.db.routes.health import router as health_router
from ....app.db.routes.quizzes import router as quizzes_router

router = APIRouter()

router.include_router(health_router, prefix="/health", tags=["health"])
router.include_router(quizzes_router, prefix="/quizzes", tags=["quizzes"])
