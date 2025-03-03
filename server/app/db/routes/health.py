from fastapi import APIRouter
from ....app.db.core.connection import database

router = APIRouter()

@router.get("/dbhealth")
async def health_check():
    try:
        await database.command("ping")
        return {"status": "healthy"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}
