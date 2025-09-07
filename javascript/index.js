import express from 'express';
import pg from 'pg';

const { Pool } = pg;

// Create a PostgreSQL connection pool
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'hello_world_db',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Hello World! Welcome to the Express + PostgreSQL API' });
});

// Get all users endpoint
app.get('/users', async (req, res) => {
    try {
        const client = await pool.connect();
        try {
            const result = await client.query(
                'SELECT id, name, email, created_at FROM users ORDER BY id'
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

// Demonstrate the security issue with read-only transactions
app.get('/users-test', async (req, res) => {
    try {
        const client = await pool.connect();

        // ✅ Here's a safe query that works fine and that is what you innocently expect from users:
        const sqlQueryFromUser = "SELECT id, name, email, created_at FROM users WHERE id > 5 ORDER BY id"

        // ❌ this fails and indeed an error is thrown by PostgreSQL:
        // Database query error: error: cannot execute INSERT in a read-only transaction
        //const sqlInsertNewUser = ";INSERT INTO users (name, email) VALUES ('Eve', 'eve@gibson.com')"

        // ☠️ this works and bypasses the READ ONLY transaction, creating a new user
        // const sqlQueryFromUser = "COMMIT; INSERT INTO users (name, email) VALUES ('Eve', 'eve@gibson.com')"

        // ☠️ this works and creates a denial of service on the database causing every query to fail as
        // it is more than the threshold of query timeout
        // const sqlQueryFromUser = "COMMIT; SET statement_timeout TO 1;"

        try {
            await client.query('BEGIN TRANSACTION READ ONLY');
            // Let's test transactions with a simple read-only query
            const result = await client.query(
                sqlQueryFromUser
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

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        const client = await pool.connect();
        try {
            await client.query('SELECT 1');
            res.json({ status: 'healthy', database: 'connected' });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ status: 'unhealthy', database: 'disconnected' });
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await pool.end();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Shutting down gracefully...');
    await pool.end();
    process.exit(0);
});

app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}`);
    console.log('Connected to PostgreSQL');
});
