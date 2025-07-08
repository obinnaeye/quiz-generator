# seed_all_categories.py

import asyncio
import os
from datetime import timezone
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import importlib.util

# ─── Load environment ──────────────────────────────────────────────
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client["quizApp_db"]
collection = db["quizzes_category"]

# ─── Load Python seed files dynamically ────────────────────────────
def load_py_seed_data(file_path: str):
    if not Path(file_path).exists():
        print(f"⚠️ File not found: {file_path}")
        return []

    module_name = Path(file_path).stem
    spec = importlib.util.spec_from_file_location(module_name, file_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)  # type: ignore

    return getattr(module, "data", [])

# ─── Quiz Structure ────────────────────────────────────────────────
structure = {
    "Art & Literature": ["Famous Paintings", "Authors & Books", "Literary Devices", "Art Movements", "Poetry"],
    "English Language": ["Grammar", "Vocabulary", "Synonyms & Antonyms", "Idioms & Phrases", "Spelling", "Reading Comprehension"],
    "Culture & Religion": ["Religions of the World", "Festivals", "Traditions", "Languages"],
    "Brain Teasers": ["Riddles", "Logic Puzzles", "Lateral Thinking", "Pattern Recognition"],
}

QUESTION_TYPES = ["multiple choice", "true or false", "open ended", "short answer"]
QUESTIONS_PER_TYPE = 10  # Total 40 per subcategory

# ─── Seeder Function ───────────────────────────────────────────────
async def seed_subcategory(cat: str, subcat: str):
    seed_path = Path(cat.replace(" ", "_")) / subcat.replace(" ", "_") / "questions.py"
    seed_path = seed_path.resolve()

    data = load_py_seed_data(str(seed_path))
    if not data:
        print(f"⚠️ No data loaded from {seed_path}")
        return

    for qtype in QUESTION_TYPES:
        filtered = [q for q in data if q["question_type"] == qtype]
        selected = filtered[:QUESTIONS_PER_TYPE]

        if len(selected) < QUESTIONS_PER_TYPE:
            print(f"⚠️ Not enough {qtype} questions in {cat}/{subcat}. Only {len(selected)} found.")

        doc = {
            "category": cat,
            "subcategory": subcat,
            "question_type": qtype,
            "questions": selected,
            "created_at": datetime.now(timezone.utc)
        }

        await collection.insert_one(doc)
        print(f"✅ Inserted {len(selected)} {qtype} questions for {cat}/{subcat}")

# ─── Main Runner ───────────────────────────────────────────────────
async def main():
    for category, subcategories in structure.items():
        for subcategory in subcategories:
            await seed_subcategory(category, subcategory)

if __name__ == "__main__":
    asyncio.run(main())
