# backend/routes/medications.py

from flask import Blueprint, request, jsonify
from db import get_db_connection, release_db_connection

medications_bp = Blueprint('medications', __name__)

@medications_bp.route('/api/medications', methods=['GET'])
def get_medications():
    conn = get_db_connection()
    cursor = conn.cursor()

    # LEFT JOIN so schedules without a log entry are still returned.
    # Column indices:
    #   0: log_id          (None if no log yet)
    #   1: schedule_id
    #   2: administered_at
    #   3: status          (None if no log yet → defaults to 'pending')
    #   4: seen_at
    #   5: completed_at
    #   6: notes           (from medication_logs)
    #   7: student_id
    #   8: medication_name
    #   9: dosage
    #  10: time_of_day
    #  11: student_name
    cursor.execute("""
        SELECT m.log_id, ms.schedule_id, m.administered_at, m.status,
               m.seen_at, m.completed_at, m.notes,
               ms.student_id, ms.medication_name, ms.dosage, ms.time_of_day,
               s.name as student_name
        FROM medication_schedules ms
        JOIN students s ON ms.student_id = s.student_id
        LEFT JOIN medication_logs m ON ms.schedule_id = m.schedule_id
        ORDER BY ms.time_of_day
    """)

    medications = cursor.fetchall()
    release_db_connection(conn)

    return jsonify([{
        'id': str(row[0]) if row[0] else str(row[1]),
        'scheduleId': row[1],
        'administeredAt': row[2].isoformat() if row[2] else None,
        'status': row[3] or 'pending',
        'seenAt': row[4].isoformat() if row[4] else None,
        'completedAt': row[5].isoformat() if row[5] else None,
        'notes': row[6],
        'studentId': row[7],
        'medicationName': row[8],
        'dosage': row[9],
        'time': row[10],
        'studentName': row[11]
    } for row in medications])


@medications_bp.route('/api/medications', methods=['POST'])
def add_medication():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if schedule already exists to avoid duplicates
    cursor.execute("""
        SELECT schedule_id FROM medication_schedules 
        WHERE student_id = %s AND medication_name = %s AND time_of_day = %s
    """, (data['studentId'], data['medicationName'], data['time']))

    result = cursor.fetchone()

    if result:
        schedule_id = result[0]
    else:
        cursor.execute("""
            INSERT INTO medication_schedules (student_id, medication_name, dosage, time_of_day)
            VALUES (%s, %s, %s, %s)
            RETURNING schedule_id
        """, (data['studentId'], data['medicationName'], data['dosage'], data['time']))
        schedule_id = cursor.fetchone()[0]

    # Notes live in medication_logs only
    cursor.execute("""
        INSERT INTO medication_logs (schedule_id, status, notes)
        VALUES (%s, 'pending', %s)
        RETURNING log_id
    """, (schedule_id, data.get('notes', '')))

    log_id = cursor.fetchone()[0]

    # FIX: Look up the student name so the POST response matches the GET response.
    # Without this, the frontend adds the card with no studentName until page refresh.
    cursor.execute("""
        SELECT name FROM students WHERE student_id = %s
    """, (data['studentId'],))

    student_row = cursor.fetchone()
    student_name = student_row[0] if student_row else ''

    conn.commit()
    release_db_connection(conn)

    return jsonify({
        'id': str(log_id),
        'scheduleId': schedule_id,
        'studentId': data['studentId'],
        'studentName': student_name,        # FIX: now included so UI renders name immediately
        'medicationName': data['medicationName'],
        'dosage': data['dosage'],
        'time': data['time'],
        'notes': data.get('notes', ''),
        'status': 'pending',
        'seenAt': None,
        'completedAt': None,
        'message': 'Medication added successfully'
    }), 201


@medications_bp.route('/api/medications/<int:medication_id>/status', methods=['PUT'])
def update_medication_status(medication_id):
    data = request.json
    status = data.get('status')

    if status not in ['pending', 'seen', 'completed']:
        return jsonify({'error': 'Invalid status'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    if status == 'seen':
        cursor.execute("""
            UPDATE medication_logs
            SET status = %s, seen_at = NOW()
            WHERE log_id = %s
            RETURNING log_id, status, seen_at, completed_at
        """, (status, medication_id))

    elif status == 'completed':
        cursor.execute("""
            UPDATE medication_logs
            SET status = %s, completed_at = NOW(), administered_at = NOW()
            WHERE log_id = %s
            RETURNING log_id, status, seen_at, completed_at
        """, (status, medication_id))

        result = cursor.fetchone()

        if not result:
            release_db_connection(conn)
            return jsonify({'error': 'Medication not found'}), 404

        # Sync current_status on the parent schedule
        cursor.execute("""
            UPDATE medication_schedules
            SET current_status = 'completed'
            WHERE schedule_id = (
                SELECT schedule_id FROM medication_logs WHERE log_id = %s
            )
        """, (medication_id,))

        conn.commit()
        release_db_connection(conn)

        return jsonify({
            'message': 'Status updated successfully',
            'id': result[0],
            'status': result[1],
            'seenAt': result[2].isoformat() if result[2] else None,
            'completedAt': result[3].isoformat() if result[3] else None
        })

    else:  # pending
        cursor.execute("""
            UPDATE medication_logs
            SET status = %s, seen_at = NULL, completed_at = NULL, administered_at = NULL
            WHERE log_id = %s
            RETURNING log_id, status, seen_at, completed_at
        """, (status, medication_id))

    result = cursor.fetchone()

    if not result:
        release_db_connection(conn)
        return jsonify({'error': 'Medication not found'}), 404

    conn.commit()
    release_db_connection(conn)

    return jsonify({
        'message': 'Status updated successfully',
        'id': result[0],
        'status': result[1],
        'seenAt': result[2].isoformat() if result[2] else None,
        'completedAt': result[3].isoformat() if result[3] else None
    })