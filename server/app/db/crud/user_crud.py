from typing import Optional, List, Dict
from motor.motor_asyncio import AsyncIOMotorCollection
from pymongo import ReturnDocument
from bson import ObjectId
from datetime import datetime, timezone
from app.db.models.models import PyObjectId, UserDB, UserCreate, Update_UserDB

async def create_user(users_collection: AsyncIOMotorCollection, user: UserCreate) -> Dict[str, str]:
    try:
        user_dict = user.model_dump()
        user_dict["hashed_password"] = user_dict.pop("password")  # Placeholder for future password hashing
        user_dict["is_active"] = True
        user_dict["role"] = "user"
        user_dict["created_at"] = datetime.now()
        user_dict["updated_at"] = None
        
        new_user = await users_collection.insert_one(user_dict)
        print("new user successfully created with id: ", str(new_user.inserted_id))
        return {"message": "user created succesfully", "new_user_ID": str(new_user.inserted_id)}
    except Exception as e:
        print(f"Error creating user: {e}")
        return None

async def get_user_by_id(users_collection: AsyncIOMotorCollection, user_id: str) -> Optional[UserDB]:
    try:
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            user["_id"] = PyObjectId(user["_id"])
            return UserDB(**user)
        return None
    except Exception as e:
        print(f"Error retrieving user: {e}")
        return None

async def get_user_by_email(users_collection: AsyncIOMotorCollection, email: str) -> Optional[UserDB]:
    try:
        user = await users_collection.find_one({"email": email})
        if user:
            user["_id"] = PyObjectId(user["_id"])
            return UserDB(**user)
        return None
    except Exception as e:
        print(f"Error retrieving user by email: {e}")
        return None



async def update_user(users_collection: AsyncIOMotorCollection, user_id: str, user_update: Update_UserDB) -> Optional[UserDB]:
    try:
        update_data = user_update.model_dump(exclude_unset=True)
        update_data["updated_at"] = datetime.now()

        updated_user = await users_collection.find_one_and_update(
            {"_id": ObjectId(user_id)},
            {"$set": update_data},
            return_document=ReturnDocument.AFTER  # Ensures we return the updated document
        )

        if updated_user:
            return {
                "message": "User updated successfully",
                "updated_user": {
                    "_id": str(updated_user["_id"]),
                    "username": updated_user["username"],
                    "email": updated_user["email"],
                    "full_name": updated_user.get("full_name", None),
                    "quizzes": updated_user.get("quizzes", []),
                    "created_at": updated_user["created_at"].isoformat(),
                    "updated_at": updated_user["updated_at"].isoformat()
                }
            }

        return None

    except Exception as e:
        print(f"Error updating user: {e}")
        return None


from typing import Dict

async def delete_user(users_collection: AsyncIOMotorCollection, user_id: str) -> Dict[str, str]:
    try:
        result = await users_collection.delete_one({"_id": ObjectId(user_id)})

        if result.deleted_count > 0 :
            return {"message": "User deleted successfully",
                    "deleted_count": result.deleted_count}
        else:
            return {"error": "User not found"}
    
    except Exception as e:
        print(f"Error deleting user: {e}")
        return {"error": "An error occurred while deleting the user"}



async def list_users(users_collection: AsyncIOMotorCollection) -> List[UserDB]:
    try:
        users_cursor = users_collection.find()
        users = await users_cursor.to_list(length=None)

        # Convert ObjectId to string and handle missing fields
        user_list = []
        for user in users:
            user["_id"] = PyObjectId(user["_id"])
            user_list.append(UserDB(**user))

        return user_list

    except Exception as e:
        print(f"Error listing users: {e}")
        return []

