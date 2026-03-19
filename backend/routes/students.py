from flask import Blueprint, jsonify, request
from db import get_db_connection, release_db_connection

students_bp = Blueprint('students', __name__)

# GET all students
@students_bp.route('/api/students', methods=['GET'])
def get_students():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT 
                s.id,
                s.name,
                p.full_name as parent_name,
                c.room_number as class_group
            FROM students s
            LEFT JOIN parents p ON s.parent_id = p.parent_id
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
                "parentPhone": "",  # Will need to get from parent/user table
                "classGroup": student[3] or "Not Assigned"
            })
        
        return jsonify(students_list), 200
        
    except Exception as e:
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
        
        cursor = conn.cursor()
        
        # Insert or update health profile
        cursor.execute("""
            INSERT INTO health_profiles (student_id, allergies, emergency_contact)
            VALUES (%s, %s, '')
            ON CONFLICT (student_id) 
            DO UPDATE SET allergies = EXCLUDED.allergies
            RETURNING student_id
        """, (student_id, ','.join(allergies) if allergies else ''))
        
        conn.commit()
        cursor.close()
        
        return jsonify({"message": "Health record added"}), 201
        
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)