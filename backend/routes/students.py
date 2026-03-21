from flask import Blueprint, jsonify, request
from db import get_db_connection, release_db_connection

students_bp = Blueprint('students', __name__)

# GET all students + Health Profiles
@students_bp.route('/api/students', methods=['GET'])
def get_students():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # FIXED: Joining the health_profiles table to grab all medical data
        cursor.execute("""
            SELECT 
                s.student_id,
                s.name,
                hp.emergency_contact,
                c.room_number,
                hp.allergies,
                hp."Medicines",
                hp.blood_type
            FROM students s
            LEFT JOIN classrooms c ON s.classroom_id = c.classroom_id
            LEFT JOIN health_profiles hp ON s.student_id = hp.student_id
            ORDER BY s.name
        """)
        students = cursor.fetchall()
        cursor.close()
        
        students_list = []
        for student in students:
            # PostgreSQL stores these as text, React expects arrays. Let's split them safely!
            allergies_raw = student[4]
            medicines_raw = student[5]
            
            allergies_list = [a.strip() for a in allergies_raw.split(',')] if allergies_raw else []
            medicines_list = [m.strip() for m in medicines_raw.split(',')] if medicines_raw else []
            
            students_list.append({
                "id": str(student[0]),
                "name": student[1] or "Unknown",
                "parentPhone": student[2] or "N/A",
                "classGroup": str(student[3]) if student[3] else "Not Assigned",
                "allergies": allergies_list,
                "medicines": medicines_list,
                "bloodType": student[6] or "Unknown"
            })
        
        return jsonify(students_list), 200
        
    except Exception as e:
        print(f"Students Route Error (GET): {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: release_db_connection(conn)


# POST - Add/Update student health records
@students_bp.route('/api/students/health', methods=['POST'])
def add_student_health():
    conn = get_db_connection()
    try:
        data = request.get_json()
        student_id = data.get('id')
        allergies = data.get('allergies', [])
        medicines = data.get('medicines', [])
        blood_type = data.get('bloodType', 'Unknown')
        emergency_contact = data.get('parentPhone', '')
        
        cursor = conn.cursor()
        
        # FIXED: Updating all columns in the health profile
        cursor.execute("""
            INSERT INTO health_profiles (student_id, allergies, emergency_contact, "Medicines", blood_type)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (student_id) 
            DO UPDATE SET 
                allergies = EXCLUDED.allergies,
                emergency_contact = EXCLUDED.emergency_contact,
                "Medicines" = EXCLUDED."Medicines",
                blood_type = EXCLUDED.blood_type
            RETURNING student_id
        """, (
            student_id, 
            ','.join(allergies) if allergies else '',
            emergency_contact,
            ','.join(medicines) if medicines else '',
            blood_type
        ))
        
        conn.commit()
        cursor.close()
        
        return jsonify({"message": "Health record synchronized successfully"}), 201
        
    except Exception as e:
        if conn: conn.rollback()
        print(f"Students Route Error (POST): {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: release_db_connection(conn)