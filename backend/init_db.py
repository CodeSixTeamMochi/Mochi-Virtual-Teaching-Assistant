import os
from dotenv import load_dotenv
load_dotenv()
import psycopg2

conn = psycopg2.connect(os.getenv('DATABASE_URL'))
cur = conn.cursor()

try:
    # Create lesson_plan table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS lesson_plan (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        cover_image TEXT,
        is_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Create lesson_items table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS lesson_items (
        id VARCHAR(50) PRIMARY KEY,
        lesson_id VARCHAR(50) REFERENCES lesson_plan(id) ON DELETE CASCADE,
        item_name VARCHAR(255) NOT NULL,
        spoken_text TEXT,
        image_url TEXT,
        display_order INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    conn.commit()
    print("Tables created successfully!")
except Exception as e:
    conn.rollback()
    print("Error creating tables:", e)
finally:
    cur.close()
    conn.close()
