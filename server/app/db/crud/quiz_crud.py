from motor.motor_asyncio import AsyncIOMotorCollection
from bson import ObjectId
from app.db.models.models import PyObjectId, Quiz

async def create_quiz(quizzes_collection: AsyncIOMotorCollection, quiz_data: dict):
    try:
        new_quiz = await quizzes_collection.insert_one(quiz_data)
        print("new quiz successfully created with id: ", str(new_quiz.inserted_id))
        return str(new_quiz.inserted_id)  
    except Exception as e:
        print(f"Error occurred while creating quiz: {e}")
        return None 


async def get_quiz(quizzes_collection: AsyncIOMotorCollection, quiz_id: str):
    try:
        quiz = await quizzes_collection.find_one({"_id": ObjectId(quiz_id)})
        if quiz:
            quiz["_id"] = PyObjectId(quiz["_id"])
            return Quiz(**quiz)  
        return None  
    except Exception as e:
        print(f"Error occurred while retrieving quiz: {e}")
        return None 


async def update_quiz(quizzes_collection: AsyncIOMotorCollection, quiz_id: str, update_data: Quiz):
    try:
        update_data_dict = update_data.model_dump(exclude_unset=True)

        result = await quizzes_collection.update_one(
            {"_id": ObjectId(quiz_id)}, 
            {"$set": update_data_dict}
        )

        if result.matched_count == 0:
            return None 
        
        updated_quiz = await quizzes_collection.find_one(ObjectId(quiz_id))
        if updated_quiz:
            updated_quiz["_id"] = PyObjectId(updated_quiz["_id"]) 
            return {
                "message": "Quiz updated successfully",
                "updated_quiz": Quiz(**updated_quiz),
                "modified_count": str(result.modified_count)
            }
        else:
            return {"message": "Quiz not found after update"}

    except Exception as e:
        print(f"Error occurred while updating or retrieving quiz: {e}")
        return None



async def delete_quiz(quizzes_collection: AsyncIOMotorCollection, quiz_id: str):
    try:
        result = await quizzes_collection.delete_one({"_id": ObjectId(quiz_id)})
        return result.deleted_count  
    except Exception as e:
        print(f"Error occurred while deleting quiz: {e}")
        return None  


