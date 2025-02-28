from fastapi import APIRouter, HTTPException, Depends
from ....app.db.crud.user_crud import (
    create_user,
    get_user_by_id, 
    get_user_by_email, 
    update_user, 
    delete_user, 
    list_users
)
from ....app.db.core.connection import users_collection
from ..schemas.user_schemas import (
    CreateUserRequest, 
    NewUserSchema, 
    UserSchema, 
    DeleteUserResponse, 
    UpdateUserSchema, 
    LoginRequest, 
    LoginResponse
)
from ..utils import is_valid_password

router = APIRouter()

@router.post("/test/create-user", response_model=NewUserSchema)
async def register_user(user: CreateUserRequest):
    created_user = await create_user(users_collection, user)
    if not created_user:
        raise HTTPException(status_code=500, detail="Failed to create user")
    return created_user

@router.get("/test/get-user/{user_id}", response_model=UserSchema)
async def get_user(user_id: str):
    user = await get_user_by_id(users_collection, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/test/get-user-by-email/{email}", response_model=UserSchema)
async def get_user_by_email_endpoint(email: str):
    user = await get_user_by_email(users_collection, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/test/list-users", response_model=list[UserSchema])
async def get_all_users():
    return await list_users(users_collection)

@router.put("/test/update-user/{user_id}", response_model=UserSchema)
async def update_existing_user(user_id: str, user_update: UpdateUserSchema):
    updated_user = await update_user(users_collection, user_id, user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

@router.delete("/test/delete-user/{user_id}", response_model=DeleteUserResponse)
async def delete_existing_user(user_id: str):
    result = await delete_user(users_collection, user_id)
    if result.delete_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return result

@router.post("/test/login/", response_model=LoginResponse)
async def login_user(request: LoginRequest):
    if not request.username and not request.email:
        raise HTTPException(status_code=400, detail="Username or email is required")

    user = await users_collection.find_one(
        {"$or": [{"username": request.username}, {"email": request.email}]}
    )

    if not user or not is_valid_password(request.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return LoginResponse(
        message="Login successful",
        user_id=str(user["_id"]),
        username=user["username"],
        fullname=user.get("full_name", ""),
        email=user["email"],
        role=user.get("role", "user"),
    )














# from fastapi import APIRouter, HTTPException
# from ....app.db.crud.user_crud import (
#     create_user,
#     get_user_by_id, 
#     get_user_by_email, 
#     update_user, 
#     delete_user, 
#     list_users
# )
# from ....app.db.core.connection import users_collection
# from ..schemas.user_schemas import CreateUserRequest, NewUserSchema, UserSchema, DeleteUserResponse, UpdateUserSchema, LoginRequest, LoginResponse
# from ..utils import is_valid_password

# router = APIRouter()

# @router.post("/test/create-user", response_model=NewUserSchema)
# async def register_user(user: CreateUserRequest):
#     try:
#         created_user = await create_user(users_collection, user)
#         return created_user
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")

# @router.get("/test/get-user/{user_id}", response_model=UserSchema)
# async def get_user(user_id: str):
#     try:
#         user = await get_user_by_id(users_collection, user_id)
#         if not user:
#             raise HTTPException(status_code=404, detail="User not found")
#         return user
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error retrieving user: {str(e)}")

# @router.get("/test/get-user-by-email/{email}", response_model=UserSchema)
# async def get_user_by_email_endpoint(email: str):
#     try:
#         user = await get_user_by_email(users_collection, email)
#         if not user:
#             raise HTTPException(status_code=404, detail="User not found")
#         return user
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error retrieving user: {str(e)}")

# @router.get("/test/list-users", response_model=list[UserSchema])
# async def get_all_users():
#     try:
#         users = await list_users(users_collection)
#         return users
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error listing users: {str(e)}")

# @router.put("/test/update-user/{user_id}", response_model=UserSchema)
# async def update_existing_user(user_id: str, user_update: UpdateUserSchema):
#     try:
#         updated_user = await update_user(users_collection, user_id, user_update)
#         if not updated_user:
#             raise HTTPException(status_code=404, detail="User not found")
#         return updated_user
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error updating user: {str(e)}")

# @router.delete("/test/delete-user/{user_id}", response_model=DeleteUserResponse)
# async def delete_existing_user(user_id: str):
#     try:
#         result = await delete_user(users_collection, user_id)
#         if not result:
#             raise HTTPException(status_code=404, detail="User not found")
#         return result
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error deleting user: {str(e)}")




# @router.post("/test/login/", response_model=LoginResponse)
# async def login_user(request: LoginRequest):
#     try:
#         if not request.username and not request.email:
#             raise HTTPException(status_code=400, detail="Username or email is required")

#         user = await users_collection.find_one(
#             {"$or": [{"username": request.username}, {"email": request.email}]}
#         )

#         if not user or not is_valid_password(request.password, user["hashed_password"]):
#             raise HTTPException(status_code=401, detail="Invalid credentials")

#         return LoginResponse(
#             message="Login successful",
#             user_id=str(user["_id"]),
#             username=user["username"],
#             fullname=user.get("full_name", ""),
#             email=user["email"],
#             role=user.get("role", "user"),
#         )

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error logging in: {str(e)}")
    
