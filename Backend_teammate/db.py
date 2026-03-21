import os
import psycopg2
from psycopg2 import pool
from dotenv import load_dotenv

# Load the hidden variables from the .env file
load_dotenv()

# Initialize connection pool
try:
    db_pool = psycopg2.pool.SimpleConnectionPool(
        1, 10,
        dsn=os.getenv("DATABASE_URL")
    )
    print("Successfully connected to Neon Cloud Database")
except Exception as e:
    print(f"Database connection failed: {e}")

def get_db_connection():
    """Fetches a connection from the pool"""
    return db_pool.getconn()

def release_db_connection(conn):
    """Returns the connection to the pool after use"""
    db_pool.putconn(conn)