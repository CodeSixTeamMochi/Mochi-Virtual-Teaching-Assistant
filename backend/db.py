import os
import psycopg2
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

def get_db_connection():
    try:
        # Securely fetch the URI from the environment
        NEON_URI = os.environ.get("DATABASE_URL")
        
        if not NEON_URI:
            print("Error: No DATABASE_URL found in .env file.")
            return None

        conn = psycopg2.connect(NEON_URI)
        return conn
    except Exception as e:
        print(f"Error connecting to Neon database: {e}")
        return None