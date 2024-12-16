from motor.motor_asyncio import AsyncIOMotorCollection
from bson import ObjectId
from app.db.models.models import User

async def create_user(users_collection: AsyncIOMotorCollection, user_data: dict):
    new_user = await users_collection.insert_one(user_data)
    return str(new_user.inserted_id)

async def get_user_by_id(users_collection: AsyncIOMotorCollection, user_id: str):
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if user:
        return User(**user)
    return None
