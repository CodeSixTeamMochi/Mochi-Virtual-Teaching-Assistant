from db import get_db_connection, release_db_connection

def create_emergency_contacts_table():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS emergency_contacts (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                icon VARCHAR(50) DEFAULT 'hospital'
            );
        """)
        
        # Insert default contacts if table is empty
        cursor.execute("SELECT COUNT(*) FROM emergency_contacts")
        count = cursor.fetchone()[0]
        
        if count == 0:
            cursor.execute("""
                INSERT INTO emergency_contacts (name, phone, icon) VALUES
                ('Ambulance Service', '1990', 'ambulance'),
                ('School Nurse', '+94 77 123 4567', 'nurse'),
                ('Nearest Hospital', '+94 11 234 5678', 'hospital')
            """)
        
        conn.commit()
        cursor.close()
        print("✅ Emergency contacts table created successfully!")
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Error creating table: {e}")
    finally:
        release_db_connection(conn)

if __name__ == '__main__':
    create_emergency_contacts_table()