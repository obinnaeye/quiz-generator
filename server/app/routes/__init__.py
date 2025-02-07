from fastapi import APIRouter
from app.routes.health import router as health_router
from app.routes.quizzes import router as quizzes_router
from app.routes.users import router as users_router

router = APIRouter()

router.include_router(health_router, prefix="/health", tags=["health"])
router.include_router(quizzes_router, prefix="/quizzes", tags=["quizzes"])
router.include_router(users_router, prefix="/users", tags=["users"])

