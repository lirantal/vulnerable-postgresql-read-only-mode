import asyncio
from contextlib import asynccontextmanager
from typing import List

import asyncpg
from fastapi import FastAPI, Request
from pydantic import BaseModel


from datetime import datetime

class User(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime


class LifespanContext:
    def __init__(self):
        self.pool: asyncpg.Pool | None = None


lifespan_context = LifespanContext()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    lifespan_context.pool = await asyncpg.create_pool(
        host="localhost",
        port=5432,
        user="postgres",
        password="postgres",
        database="hello_world_db",
        min_size=1,
        max_size=10,
    )
    print("Connected to PostgreSQL")
    
    yield
    
    # Shutdown
    if lifespan_context.pool:
        await lifespan_context.pool.close()
        print("Disconnected from PostgreSQL")


app = FastAPI(
    title="Hello World API",
    description="A simple FastAPI application with PostgreSQL using asyncpg",
    version="0.1.0",
    lifespan=lifespan,
)


@app.get("/")
async def root():
    return {"message": "Hello World! Welcome to the FastAPI + PostgreSQL API"}


@app.get("/users", response_model=List[User])
async def get_users():
    """Get all users from the database using asyncpg"""
    query = "SELECT id, name, email, created_at FROM users ORDER BY id"
    
    pool = lifespan_context.pool
    async with pool.acquire() as conn:
        result = await conn.fetch(query)
    
    return [User(**dict(row)) for row in result]


@app.get("/users-test", response_model=List[User])
async def get_users_test():
    """Test endpoint with a placeholder query that you can replace with your own"""
    # TODO: Replace this query with your own test query
    # This is a placeholder query that returns user data
    query = "SELECT id, name, email, created_at FROM users WHERE id <= 3 ORDER BY id"
    
    pool = lifespan_context.pool
    async with pool.acquire() as conn:
        result = await conn.fetch(query)
    
    return [User(**dict(row)) for row in result]


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "database": "connected"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 