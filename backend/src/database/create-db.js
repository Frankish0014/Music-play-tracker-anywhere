import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

// Connect to postgres database to create our database
const adminClient = new Client({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER || 'rwanda_music',
  password: process.env.POSTGRES_PASSWORD || 'changeme',
  database: 'postgres', // Connect to default postgres database
});

async function createDatabase() {
  try {
    await adminClient.connect();
    console.log('Connected to PostgreSQL');

    const dbName = process.env.POSTGRES_DB || 'rwanda_music_db';
    
    // Check if database exists
    const result = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (result.rows.length === 0) {
      // Create database
      await adminClient.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database "${dbName}" created successfully`);
    } else {
      console.log(`✅ Database "${dbName}" already exists`);
    }

    await adminClient.end();
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    await adminClient.end();
    process.exit(1);
  }
}

createDatabase();

