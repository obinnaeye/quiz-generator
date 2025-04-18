import pytest

@pytest.mark.asyncio
async def test_seeded_quiz(seed_database):
    fetched = await seed_database["quizzes"].find_one({"title": "Space Exploration"})
    assert fetched["description"] == "Discover the wonders of the cosmos."
    assert fetched["quiz_type"] == "true-false"
    assert "questions" in fetched
