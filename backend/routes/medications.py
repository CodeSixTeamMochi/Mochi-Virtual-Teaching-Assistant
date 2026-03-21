from flask import Blueprint, jsonify, request
from db import get_db_connection, release_db_connection
import datetime

medications_bp = Blueprint('medications', __name__)

# GET all medication schedules
@medications_bp.route('/api/medications', methods=['GET'])
def get_medications():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        # FIXED: Changed s.id to s.student_id
        cursor.execute("""
            SELECT 
                ms.schedule_id,
                s.name as student_name,
                ms.medication_name,
                ms.dosage,
                ms.time_of_day,
                COALESCE(ml.status, 'pending') as status,
                ml.administered_at as seen_at,
                CASE WHEN ml.status = 'completed' THEN ml.administered_at END as completed_at
            FROM medication_schedules ms
            LEFT JOIN students s ON ms.student_id = s.student_id 
            LEFT JOIN medication_logs ml ON ms.schedule_id = ml.schedule_id
            ORDER BY ms.time_of_day
        """)
        medications = cursor.fetchall()
        cursor.close()
        
        medications_list = []
        for med in medications:
            medications_list.append({
                "id": str(med[0]),
                "studentName": med[1] or "Unknown",
                "medicationName": med[2],
                "dosage": str(med[3]), 
                "time": str(med[4]), 
                "status": med[5],
                "seenAt": med[6].isoformat() if med[6] else None,
                "completedAt": med[7].isoformat() if med[7] else None,
                "notes": ""
            })
        
        return jsonify(medications_list), 200
        
    except Exception as e:
        print(f"Medication Route Error (GET): {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: release_db_connection(conn)


# POST - Add medication schedule
@medications_bp.route('/api/medications', methods=['POST'])
def add_medication():
    conn = get_db_connection()
    try:
        data = request.get_json()
        student_name = data.get('studentName')
        medication_name = data.get('medicationName')
        dosage = data.get('dosage')
        time_of_day = data.get('time')
        
        if not all([student_name, medication_name, dosage, time_of_day]):
            return jsonify({"error": "Missing required fields"}), 400
        
        cursor = conn.cursor()
        
        # FIXED: Changed SELECT id to SELECT student_id
        cursor.execute("SELECT student_id FROM students WHERE name = %s LIMIT 1", (student_name,))
        student = cursor.fetchone()
        
        if not student:
            return jsonify({"error": "Student not found"}), 404
        
        student_id = student[0]
        
        cursor.execute("""
            INSERT INTO medication_schedules (student_id, medication_name, dosage, time_of_day)
            VALUES (%s, %s, %s, %s)
            RETURNING schedule_id
        """, (student_id, medication_name, dosage, time_of_day))
        
        schedule_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        
        return jsonify({
            "id": str(schedule_id),
            "studentName": student_name,
            "medicationName": medication_name,
            "dosage": dosage,
            "time": time_of_day,
            "status": "pending",
            "seenAt": None,
            "completedAt": None,
            "notes": data.get('notes', '')
        }), 201
        
    except Exception as e:
        if conn: conn.rollback()
        print(f"Medication Route Error (POST): {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: release_db_connection(conn)


# PUT - Update medication status
@medications_bp.route('/api/medications/<schedule_id>', methods=['PUT'])
def update_medication_status(schedule_id):
    conn = get_db_connection()
    try:
        data = request.get_json()
        status = data.get('status')
        
        if status not in ['pending', 'seen', 'completed']:
            return jsonify({"error": "Invalid status"}), 400
        
        cursor = conn.cursor()
        
        if status == 'seen':
            cursor.execute("""
                INSERT INTO medication_logs (schedule_id, administered_at, status)
                VALUES (%s, CURRENT_TIMESTAMP, 'seen')
                ON CONFLICT (schedule_id) 
                DO UPDATE SET administered_at = CURRENT_TIMESTAMP, status = 'seen'
                RETURNING administered_at
            """, (schedule_id,))
            
        elif status == 'completed':
            cursor.execute("""
                UPDATE medication_logs
                SET status = 'completed', administered_at = CURRENT_TIMESTAMP
                WHERE schedule_id = %s
                RETURNING administered_at
            """, (schedule_id,))
        else:
            cursor.execute("DELETE FROM medication_logs WHERE schedule_id = %s", (schedule_id,))
        
        conn.commit()
        cursor.close()
        return jsonify({"status": status}), 200
        
    except Exception as e:
        if conn: conn.rollback()
        print(f"Medication Route Error (PUT): {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: release_db_connection(conn)


# DELETE 
@medications_bp.route('/api/medications/<schedule_id>', methods=['DELETE'])
def delete_medication(schedule_id):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM medication_logs WHERE schedule_id = %s", (schedule_id,))
        cursor.execute("DELETE FROM medication_schedules WHERE schedule_id = %s", (schedule_id,))
        conn.commit()
        cursor.close()
        return jsonify({"success": True}), 200
    except Exception as e:
        if conn: conn.rollback()
        print(f"Medication Route Error (DELETE): {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: release_db_connection(conn)