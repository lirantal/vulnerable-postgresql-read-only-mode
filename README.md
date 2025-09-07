# PostgreSQL API Examples

This repository contains examples of connecting to PostgreSQL from both Python (FastAPI) and JavaScript (Express) applications.

## Features

- **Python FastAPI application** (in `python/` directory)
  - FastAPI web framework with asyncpg
  - Runs on port 8000
- **JavaScript Express application** (in `javascript/` directory)  
  - Express web framework with pg package
  - Runs on port 3000
- **Shared PostgreSQL database** via Docker Compose
- Sample endpoints: `/users`, `/users-test`, `/health`
- Pre-loaded sample user data

## Prerequisites

- **For Python**: Python 3.8+, uv package manager
- **For JavaScript**: Node.js 16+, npm
- Docker and Docker Compose

## Quick Start

### 1. Start PostgreSQL Database (Required for both applications)

```bash
# Start the PostgreSQL container
docker compose up -d

# Check if the database is ready
docker compose ps
```

### 2A. Run Python Application

```bash
# Navigate to Python directory
cd python/

# Install dependencies
uv sync

# Run the FastAPI application
uv run python main.py
```

The Python API will be available at `http://localhost:8000`

### 2B. Run JavaScript Application  

```bash
# Navigate to JavaScript directory
cd javascript/

# Install dependencies
npm install

# Run the Express application
npm start
```

The JavaScript API will be available at `http://localhost:3000`

### 3. Test the Applications

## API Endpoints

Both applications expose the same endpoints on different ports:

### Python FastAPI (port 8000)
```bash
# Health Check
curl http://localhost:8000/health

# Get All Users
curl http://localhost:8000/users

# Test Endpoint
curl http://localhost:8000/users-test
```

### JavaScript Express (port 3000)  
```bash
# Health Check
curl http://localhost:3000/health

# Get All Users  
curl http://localhost:3000/users

# Test Endpoint
curl http://localhost:3000/users-test
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
# Python
curl http://localhost:8000/users-test

# JavaScript  
curl http://localhost:3000/users-test
```

Both endpoints currently return the first 3 users. You can modify the queries in the respective applications to test your own queries.

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
├── python/             # Python FastAPI application
│   ├── main.py        # FastAPI application  
│   ├── pyproject.toml # Project configuration (uv)
│   └── README.md      # Python-specific documentation
├── javascript/        # JavaScript Express application
│   ├── index.js       # Express application
│   ├── package.json   # npm configuration
│   └── README.md      # JavaScript-specific documentation
├── docker-compose.yml # PostgreSQL setup (shared)
├── init.sql          # Database initialization (shared)
└── README.md         # This file
```

### Customizing the Test Endpoints

#### Python (FastAPI)
Edit the `/users-test` endpoint in `python/main.py`:

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

#### JavaScript (Express)
Edit the `/users-test` endpoint in `javascript/index.js`:

```javascript
app.get('/users-test', async (req, res) => {
  try {
    const client = await pool.connect();
    try {
      // TODO: Replace this query with your own test query
      const result = await client.query(
        'SELECT id, name, email, created_at FROM users WHERE id <= 3 ORDER BY id'
      );
      res.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Adding New Dependencies

#### Python
```bash
cd python/
# Add a new dependency
uv add package-name

# Add a development dependency
uv add --dev package-name
```

#### JavaScript
```bash
cd javascript/
# Add a new dependency
npm install package-name

# Add a development dependency  
npm install --save-dev package-name
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

Then update the connection in the respective applications:

**Python** (`python/main.py`):
```python
port=5433,  # Change from 5432 to 5433
```

**JavaScript** (`javascript/index.js`):
```javascript
const pool = new Pool({
  // ... other config
  port: 5433,  // Change from 5432 to 5433
});
```

## API Documentation

### Python FastAPI
Once the Python application is running, you can access:

- Interactive API docs: http://localhost:8000/docs
- Alternative API docs: http://localhost:8000/redoc 

### JavaScript Express
The JavaScript application provides JSON responses at:
- http://localhost:3000/ (endpoints listed above)

## Directory-Specific Information

For detailed setup and usage instructions for each application:
- See `python/README.md` for Python/FastAPI specific information
- See `javascript/README.md` for JavaScript/Express specific information