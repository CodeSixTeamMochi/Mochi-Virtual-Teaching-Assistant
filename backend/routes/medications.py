from flask import Blueprint, jsonify, request
from db import get_db_connection, release_db_connection

medications_bp = Blueprint('medications', __name__)

# GET all medication schedules
@medications_bp.route('/api/medications', methods=['GET'])
def get_medications():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
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
            LEFT JOIN students s ON ms.student_id = s.id
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
                "dosage": med[3],
                "time": med[4],
                "status": med[5],
                "seenAt": med[6].isoformat() if med[6] else None,
                "completedAt": med[7].isoformat() if med[7] else None,
                "notes": ""  # Can add notes column if needed
            })
        
        return jsonify(medications_list), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)


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
        
        # Get student_id from name
        cursor.execute("SELECT id FROM students WHERE name = %s LIMIT 1", (student_name,))
        student = cursor.fetchone()
        
        if not student:
            return jsonify({"error": "Student not found"}), 404
        
        student_id = student[0]
        
        # Insert schedule
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
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)


# PUT - Update medication status
@medications_bp.route('/api/medications/<schedule_id>/status', methods=['PUT'])
def update_medication_status(schedule_id):
    conn = get_db_connection()
    try:
        data = request.get_json()
        status = data.get('status')
        
        if status not in ['pending', 'seen', 'completed']:
            return jsonify({"error": "Invalid status"}), 400
        
        cursor = conn.cursor()
        
        if status == 'seen':
            # Create or update log with 'seen' status
            cursor.execute("""
                INSERT INTO medication_logs (schedule_id, administered_at, status)
                VALUES (%s, CURRENT_TIMESTAMP, 'seen')
                ON CONFLICT (schedule_id) 
                DO UPDATE SET administered_at = CURRENT_TIMESTAMP, status = 'seen'
                RETURNING administered_at
            """, (schedule_id,))
            
        elif status == 'completed':
            # Update log to completed
            cursor.execute("""
                UPDATE medication_logs
                SET status = 'completed', administered_at = CURRENT_TIMESTAMP
                WHERE schedule_id = %s
                RETURNING administered_at
            """, (schedule_id,))
        
        result = cursor.fetchone()
        conn.commit()
        cursor.close()
        
        return jsonify({
            "status": status,
            "timestamp": result[0].isoformat() if result else None
        }), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)