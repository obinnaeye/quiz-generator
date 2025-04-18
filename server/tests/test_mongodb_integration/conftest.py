# tests/conftest.py
import pytest
import pytest_asyncio
from testcontainers.mongodb import MongoDbContainer
from motor.motor_asyncio import AsyncIOMotorClient
from ...app.databaseSeeding import seed_quizzes_collection, seed_users_collection
from ...app.seed_data import seed_quizzes, seed_user_data


@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"


@pytest.fixture(scope="session")
def mongo_container():
    # Context manager already starts the container
    with MongoDbContainer("mongo:latest") as mongo:
        yield mongo


@pytest_asyncio.fixture(scope="function")
async def motor_client(mongo_container):
    uri = mongo_container.get_connection_url()
    client = AsyncIOMotorClient(uri)
    yield client
    client.close()  # ensure clean teardown


@pytest_asyncio.fixture(scope="function")
async def test_db(motor_client):
    db = motor_client.test_db  # use any name here
    # Clean all collections before each test
    for name in await db.list_collection_names():
        await db.drop_collection(name)
    yield db


@pytest_asyncio.fixture(scope="function")
async def seed_database(test_db):
    # Seed async
    await seed_users_collection(test_db["users"], seed_user_data)
    await seed_quizzes_collection(test_db["quizzes"], seed_quizzes)
    yield test_db  # yield the seeded db in case tests want to access it




@pytest_asyncio.fixture(scope="function", autouse=True)
async def cleanup_db_after_test(test_db):
    yield
    for name in await test_db.list_collection_names():
        await test_db.drop_collection(name)

