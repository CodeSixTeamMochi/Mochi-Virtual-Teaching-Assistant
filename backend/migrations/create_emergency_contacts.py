import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import get_db_connection, release_db_connection

def create_emergency_contacts_table():
    """Create emergency_contacts table in Neon database"""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # Create table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS emergency_contacts (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                type VARCHAR(100) NOT NULL,
                icon VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Check if table has data
        cursor.execute("SELECT COUNT(*) FROM emergency_contacts")
        count = cursor.fetchone()[0]
        
        # Insert default data if empty
        if count == 0:
            cursor.execute("""
                INSERT INTO emergency_contacts (name, phone, type, icon) VALUES
                ('Ambulance Service', '1990', 'Ambulance', 'ambulance'),
                ('School Nurse', '+94 77 123 4567', 'Nurse', 'nurse'),
                ('Nearest Hospital', '+94 11 234 5678', 'Hospital', 'hospital')
            """)
            print("✅ Inserted 3 default emergency contacts")
        else:
            print(f"ℹ️  Table already has {count} contacts")
        
        conn.commit()
        cursor.close()
        print("✅ Emergency contacts table created successfully!")
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Error: {e}")
    finally:
        release_db_connection(conn)

if __name__ == '__main__':
    print("Creating emergency_contacts table...")
    create_emergency_contacts_table()