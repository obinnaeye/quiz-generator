from fastapi import FastAPI
from app.api import healthcheck
from typing import Union

app = FastAPI()

app.include_router(healthcheck.router, prefix="/api", tags=["healthcheck"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Quiz App API!"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
