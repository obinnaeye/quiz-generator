from fastapi import APIRouter, HTTPException
from app.db.crud.user_crud import (
    create_user, get_user_by_id, get_user_by_email, update_user, delete_user, list_users
)
from app.db.models.models import UserCreate, UserDB, Update_UserDB
from app.db.core.connection import users_collection

router = APIRouter()

@router.post("/test/create-user", response_model= dict[str, str])
async def register_user(user: UserCreate):
    try:
        created_user = await create_user(users_collection, user)
        return created_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")

@router.get("/test/get-user/{user_id}", response_model=UserDB)
async def get_user(user_id: str):
    try:
        user = await get_user_by_id(users_collection, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving user: {str(e)}")

@router.get("/test/get-user-by-email/{email}", response_model=UserDB)
async def get_user_by_email_endpoint(email: str):
    try:
        user = await get_user_by_email(users_collection, email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving user: {str(e)}")

@router.get("/test/list-users", response_model=list[UserDB])
async def get_all_users():
    try:
        users = await list_users(users_collection)
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing users: {str(e)}")

@router.put("/test/update-user/{user_id}")
async def update_existing_user(user_id: str, user_update: Update_UserDB):
    try:
        updated_user = await update_user(users_collection, user_id, user_update)
        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")
        return updated_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating user: {str(e)}")

@router.delete("/test/delete-user/{user_id}")
async def delete_existing_user(user_id: str):
    try:
        result = await delete_user(users_collection, user_id)
        if not result:
            raise HTTPException(status_code=404, detail="User not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting user: {str(e)}")
