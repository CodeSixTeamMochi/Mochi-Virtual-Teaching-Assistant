from flask import Blueprint, jsonify, request
from db import get_db_connection, release_db_connection

students_bp = Blueprint('students', __name__)

# GET all students (for modal - students not yet in health records)
@students_bp.route('/api/students', methods=['GET'])
def get_students():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor = conn.cursor()
        
        # First, let's try a simple query to see what's in parents table
        try:
            cursor.execute("SELECT * FROM parents LIMIT 1")
            parent_sample = cursor.fetchone()
            if parent_sample:
                print(f"Parent table sample data: {parent_sample}")
                print(f"Parent table column count: {len(parent_sample)}")
        except Exception as e:
            print(f"Could not query parents table: {e}")
        
        cursor.execute("""
            SELECT 
                s.student_id,
                s.name,
                '' as parent_phone,
                COALESCE(c.room_number, 'Not Assigned') as class_group
            FROM students s
            LEFT JOIN classrooms c ON s.classroom_id = c.classroom_id
            ORDER BY s.name
        """)
        students = cursor.fetchall()
        cursor.close()
        
        students_list = []
        for student in students:
            students_list.append({
                "id": str(student[0]),
                "name": student[1],
                "parentPhone": student[2] or "",
                "classGroup": student[3] or "Not Assigned"
            })
        
        return jsonify(students_list), 200
        
    except Exception as e:
        print(f"Error in get_students: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)


# GET all students WITH health profiles (for display in health records)
@students_bp.route('/api/students/health-records', methods=['GET'])
def get_health_records():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT 
                s.student_id,
                s.name,
                COALESCE(hp.emergency_contact, '') as parent_phone,
                COALESCE(c.room_number, 'Not Assigned') as class_group,
                COALESCE(hp.allergies, '') as allergies
            FROM students s
            LEFT JOIN classrooms c ON s.classroom_id = c.classroom_id
            INNER JOIN health_profiles hp ON s.student_id = hp.student_id
            ORDER BY s.name
        """)
        records = cursor.fetchall()
        cursor.close()
        
        records_list = []
        for record in records:
            # Parse allergies from comma-separated string
            allergies_str = record[4] or ""
            allergies = [a.strip() for a in allergies_str.split(',') if a.strip()]
            
            records_list.append({
                "id": str(record[0]),
                "name": record[1],
                "parentPhone": record[2] or "",
                "classGroup": record[3] or "Not Assigned",
                "allergies": allergies,
                "medicines": []
            })
        
        return jsonify(records_list), 200
        
    except Exception as e:
        print(f"Error in get_health_records: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)


# POST add student health profile
@students_bp.route('/api/students/health', methods=['POST'])
def add_health_record():
    conn = get_db_connection()
    try:
        data = request.json
        student_id = data.get('id')
        allergies = ','.join(data.get('allergies', []))
        
        cursor = conn.cursor()
        
        # Insert into health_profiles
        cursor.execute("""
            INSERT INTO health_profiles (student_id, allergies, emergency_contact)
            VALUES (%s, %s, '')
            ON CONFLICT (student_id) DO UPDATE
            SET allergies = EXCLUDED.allergies
            RETURNING student_id
        """, (student_id, allergies))
        
        conn.commit()
        cursor.close()
        
        return jsonify({"message": "Health record added successfully", "id": student_id}), 201
        
    except Exception as e:
        print(f"Error in add_health_record: {str(e)}")
        import traceback
        traceback.print_exc()
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)


# POST - Add student to health records (creates health profile)
@students_bp.route('/api/students/health', methods=['POST'])
def add_student_health():
    conn = get_db_connection()
    try:
        data = request.get_json()
        student_id = data.get('id')
        allergies = data.get('allergies', [])
        medicines = data.get('medicines', [])
        
        if not student_id:
            return jsonify({"error": "Student ID is required"}), 400
        
        cursor = conn.cursor()
        
        # Convert allergies list to comma-separated string
        allergies_str = ','.join(allergies) if allergies else ''
        
        # Insert or update health profile
        cursor.execute("""
            INSERT INTO health_profiles (student_id, allergies, emergency_contact)
            VALUES (%s, %s, '')
            ON CONFLICT (student_id) 
            DO UPDATE SET allergies = EXCLUDED.allergies
            RETURNING student_id
        """, (student_id, allergies_str))
        
        conn.commit()
        cursor.close()
        
        return jsonify({
            "message": "Health record added successfully",
            "studentId": student_id
        }), 201
        
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)