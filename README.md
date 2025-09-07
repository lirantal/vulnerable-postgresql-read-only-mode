# Hello World PostgreSQL API

A simple FastAPI application with PostgreSQL using asyncpg for database connections.

## Features

- FastAPI web framework
- PostgreSQL database with asyncpg
- Docker Compose setup for easy development
- Two endpoints: `/users` and `/users-test`
- Health check endpoint
- Sample user data pre-loaded

## Prerequisites

- Python 3.8+
- Docker and Docker Compose
- uv (Python package manager)

## Quick Start

### 1. Install Dependencies

```bash
# Install uv if you haven't already
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install project dependencies
uv sync
```

### 2. Start PostgreSQL Database

```bash
# Start the PostgreSQL container
docker compose up -d

# Check if the database is ready
docker compose ps
```

### 3. Run the Application

```bash
# Run the FastAPI application
uv run python main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
```bash
curl http://localhost:8000/health
```

### Get All Users
```bash
curl http://localhost:8000/users
```

Expected response:
```json
[
  {"id":1,"name":"John Doe","email":"john.doe@example.com","created_at":"2025-07-20T17:45:23.955156Z"},
  {"id":2,"name":"Jane Smith","email":"jane.smith@example.com","created_at":"2025-07-20T17:45:23.955156Z"},
  {"id":3,"name":"Bob Johnson","email":"bob.johnson@example.com","created_at":"2025-07-20T17:45:23.955156Z"},
  {"id":4,"name":"Alice Brown","email":"alice.brown@example.com","created_at":"2025-07-20T17:45:23.955156Z"},
  {"id":5,"name":"Charlie Wilson","email":"charlie.wilson@example.com","created_at":"2025-07-20T17:45:23.955156Z"}
]
```

### Test Endpoint (Customizable)
```bash
curl http://localhost:8000/users-test
```

This endpoint currently returns the first 3 users. You can modify the query in `main.py` to test your own queries.

## Database Setup

The database is automatically set up when you run `docker compose up -d`. The `init.sql` file creates the users table and inserts sample data.

### Manual Database Setup (if needed)

If you need to manually set up the database:

```bash
# Connect to the PostgreSQL container
docker exec -it hello_world_postgres psql -U postgres -d hello_world_db

# Or run the init script manually
docker exec -i hello_world_postgres psql -U postgres -d hello_world_db < init.sql
```

## Connecting to PostgreSQL Database

### Using Docker Exec

```bash
# Connect to PostgreSQL inside the container
docker exec -it hello_world_postgres psql -U postgres -d hello_world_db
```

### Using psql locally

```bash
# Connect from your local machine
psql -h localhost -p 5432 -U postgres -d hello_world_db
```

Password: `postgres`

### Useful PostgreSQL Commands

Once connected to the database:

```sql
-- List all tables
\dt

-- View users table structure
\d users

-- Query all users
SELECT * FROM users;

-- Count users
SELECT COUNT(*) FROM users;

-- Exit psql
\q
```

## Development

### Project Structure

```
.
├── main.py              # FastAPI application
├── pyproject.toml       # Project configuration (uv)
├── docker-compose.yml   # PostgreSQL setup
├── init.sql            # Database initialization
└── README.md           # This file
```

### Customizing the Test Endpoint

Edit the `/users-test` endpoint in `main.py` to test your own queries:

```python
@app.get("/users-test", response_model=List[User])
async def get_users_test():
    """Test endpoint with a placeholder query that you can replace with your own"""
    # Replace this query with your own test query
    query = "SELECT id, name, email, created_at FROM users WHERE id <= 3 ORDER BY id"
    
    pool = lifespan_context.pool
    async with pool.acquire() as conn:
        result = await conn.fetch(query)
    
    return [User(**dict(row)) for row in result]
```

### Adding New Dependencies

```bash
# Add a new dependency
uv add package-name

# Add a development dependency
uv add --dev package-name
```

## Troubleshooting

### Database Connection Issues

1. Make sure PostgreSQL is running:
   ```bash
   docker compose ps
   ```

2. Check database logs:
   ```bash
   docker compose logs postgres
   ```

3. Restart the database:
   ```bash
   docker compose restart postgres
   ```

### Port Already in Use

If port 5432 is already in use, modify the `docker-compose.yml` file:

```yaml
ports:
  - "5433:5432"  # Change 5432 to 5433
```

Then update the connection in `main.py`:

```python
port=5433,  # Change from 5432 to 5433
```

## API Documentation

Once the application is running, you can access:

- Interactive API docs: http://localhost:8000/docs
- Alternative API docs: http://localhost:8000/redoc 


## Project Structure

The project includes:
- pyproject.toml - Project configuration using uv package manager
- main.py - FastAPI application with the exact structure you requested
- docker-compose.yml - PostgreSQL setup with Docker
- init.sql - Database initialization script that creates the users table and inserts sample data
- README.md - Comprehensive documentation with setup and usage instructions
- .gitignore - Standard Python gitignore file