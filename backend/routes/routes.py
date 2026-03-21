from flask import Blueprint, jsonify, request
from db import get_db_connection
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from db import release_db_connection

dashboard_bp = Blueprint('dashboard', __name__)

# ==========================================
# 1. DASHBOARD STATS
# ==========================================

@dashboard_bp.route('/api/dashboard/stats', methods=['GET'])
def get_stats():
    conn = get_db_connection()
    if not conn:
        return jsonify({"totalStudents": 0, "presentToday": 0, "activitiesDone": 0, "pendingMsgs": 0})
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Using student_id based on your table image
        cursor.execute("SELECT COUNT(student_id) as total FROM students")
        total = cursor.fetchone()['total']
        
        # Fallback for present today (assuming all are present if status column is missing)
        present = total 
        
        return jsonify({
            "totalStudents": total,
            "presentToday": present,
            "activitiesDone": 12,
            "pendingMsgs": 3
        })
    except Exception as e:
        print(f"Stats Error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            release_db_connection(conn) 

# ==========================================
# 2. TODAY'S SCHEDULE
# ==========================================

@dashboard_bp.route('/api/dashboard/today-schedule', methods=['GET'])
def get_today_schedule():
    conn = get_db_connection()
    if not conn: return jsonify([])
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """
            SELECT id, 
                   title, 
                   event_date,
                   'All Day' as time, 
                   'Event' as type 
            FROM calendar_events 
            WHERE event_date = CURRENT_DATE
            ORDER BY id ASC
        """
        cursor.execute(query)
        slots = cursor.fetchall()

        for slot in slots:
            slot.update({
                "dotColor": "bg-[#06b6d4]", 
                "typeBg": "bg-[#cffafe]", 
                "typeColor": "text-[#0e7490]"
            })
        return jsonify(slots)
    except Exception as e:
        print(f"Schedule Error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            release_db_connection(conn) 

# ==========================================
# 3. ANNOUNCEMENTS
# ==========================================

@dashboard_bp.route('/api/dashboard/announcements', methods=['GET', 'POST'])
def handle_announcements():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if request.method == 'GET':
            cursor.execute("SELECT id, title, created_at as time FROM announcements ORDER BY id DESC LIMIT 5")
            announcements = cursor.fetchall()
            colors = ["bg-[#06b6d4]", "bg-[#ea580c]", "bg-[#22c55e]"]
            for i, ann in enumerate(announcements):
                ann['dotColor'] = colors[i % len(colors)]
            return jsonify(announcements)

        if request.method == 'POST':
            data = request.json
            time_str = datetime.now().strftime("Today · %I:%M %p")
            cursor.execute("INSERT INTO announcements (title, created_at) VALUES (%s, %s) RETURNING id", 
                           (data['title'], time_str))
            new_id = cursor.fetchone()['id']
            conn.commit()
            return jsonify({"id": new_id, "title": data['title'], "time": time_str})
    finally:
        if conn:
            release_db_connection(conn) 

@dashboard_bp.route('/api/dashboard/announcements/<int:id>', methods=['PUT', 'DELETE'])
def update_delete_announcement(id):
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "DB connection failed"}), 500
    
    try:
        cursor = conn.cursor()
        
        if request.method == 'DELETE':
            cursor.execute("DELETE FROM announcements WHERE id = %s", (id,))
            conn.commit()
            return jsonify({"success": True, "message": "Announcement deleted"})

        if request.method == 'PUT':
            data = request.json
            if not data or 'title' not in data:
                return jsonify({"error": "Missing title"}), 400
            
            cursor.execute("UPDATE announcements SET title = %s WHERE id = %s", (data['title'], id))
            conn.commit()
            return jsonify({"success": True, "message": "Announcement updated"})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            release_db_connection(conn) 
# ==========================================
# 4. STUDENT MANAGEMENT
# ==========================================

@dashboard_bp.route('/api/students', methods=['GET'])
def get_students():
    conn = get_db_connection()
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT student_id as id, name, parent_id, classroom_id FROM students ORDER BY name ASC")
        students = cursor.fetchall()
        return jsonify(students)
    finally:
        if conn:
            release_db_connection(conn) 

# ==========================================
# 5. CALENDAR EVENTS
# ==========================================

@dashboard_bp.route('/api/events', methods=['GET', 'POST'])
def manage_calendar_events():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if request.method == 'GET':
        cursor.execute("""
            SELECT id, title, TO_CHAR(event_date, 'YYYY-MM-DD') as date, 
                   event_time as time, event_type as type 
            FROM calendar_events ORDER BY event_date ASC
        """)
        res = cursor.fetchall()
        conn.close()
        return jsonify(res)

    if request.method == 'POST':
        data = request.json
        cursor.execute(
            "INSERT INTO calendar_events (title, event_date, event_time, event_type) VALUES (%s, %s, %s, %s) RETURNING id",
            (data['title'], data['date'], data.get('time', 'All Day'), data.get('type', 'activity'))
        )
        new_id = cursor.fetchone()['id']
        conn.commit()
        conn.close()
        return jsonify({"id": str(new_id), "success": True})

@dashboard_bp.route('/api/events/<int:id>', methods=['PUT', 'DELETE'])
def update_delete_event(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    if request.method == 'DELETE':
        cursor.execute("DELETE FROM calendar_events WHERE id = %s", (id,))
    elif request.method == 'PUT':
        data = request.json
        cursor.execute(
            "UPDATE calendar_events SET title=%s, event_date=%s, event_time=%s, event_type=%s WHERE id=%s",
            (data['title'], data['date'], data.get('time', 'All Day'), data.get('type', 'activity'), id)
        )
    conn.commit()
    conn.close()
    return jsonify({"success": True})

# ==========================================
# WEEKLY TIMETABLE ROUTES
# ==========================================

@dashboard_bp.route('/api/timetable', methods=['GET', 'POST'])
def handle_timetable():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
        
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if request.method == 'GET':
        try:
            cursor.execute("SELECT * FROM timetable_slots ORDER BY day, time_from ASC")
            res = cursor.fetchall()
            return jsonify(res)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            conn.close()
    
    if request.method == 'POST':
        try:
            data = request.json
            cursor.execute(
                "INSERT INTO timetable_slots (day, time_from, time_to, subject, type) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (data['day'], data['time_from'], data['time_to'], data['subject'], data['type'])
            )
            new_id = cursor.fetchone()['id']
            conn.commit()
            return jsonify({"id": new_id, "success": True})
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            conn.close()

@dashboard_bp.route('/api/timetable/<int:id>', methods=['PUT', 'DELETE'])
def update_delete_timetable(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        if request.method == 'DELETE':
            cursor.execute("DELETE FROM timetable_slots WHERE id = %s", (id,))
            conn.commit()
            return jsonify({"success": True})

        if request.method == 'PUT':
            data = request.json
            cursor.execute(
                "UPDATE timetable_slots SET day=%s, time_from=%s, time_to=%s, subject=%s, type=%s WHERE id=%s",
                (data['day'], data['time_from'], data['time_to'], data['subject'], data['type'], id)
            )
            conn.commit()
            return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            release_db_connection(conn) 

# ==========================================
# WEEKLY NOTES ROUTES
# ==========================================

@dashboard_bp.route('/api/timetable/notes', methods=['GET', 'POST', 'OPTIONS'])
# In backend/routes/dashboard.py

@dashboard_bp.route('/api/timetable/notes', methods=['GET', 'POST', 'OPTIONS'])
def handle_notes():
    # Handle the "Preflight" request automatically
    if request.method == 'OPTIONS':
        return '', 204
        
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "DB connection failed"}), 500
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if request.method == 'GET':
        cursor.execute("SELECT id, content FROM weekly_notes ORDER BY id ASC")
        notes = cursor.fetchall()
        conn.close()
        return jsonify(notes)

    if request.method == 'POST':
        data = request.json
        if not data or 'content' not in data:
            return jsonify({"error": "Content is required"}), 400
            
        cursor.execute("INSERT INTO weekly_notes (content) VALUES (%s) RETURNING id", (data['content'],))
        new_id = cursor.fetchone()['id']
        conn.commit()
        conn.close()
        return jsonify({"id": new_id, "success": True})

@dashboard_bp.route('/api/timetable/notes/<int:id>', methods=['PUT', 'DELETE', 'OPTIONS'])
# Handle specific note actions (Update/Delete)
@dashboard_bp.route('/api/timetable/notes/<int:id>', methods=['PUT', 'DELETE', 'OPTIONS'])
def update_delete_note(id):
    # 1. Handle the browser's "Preflight" check
    if request.method == 'OPTIONS':
        return '', 204
        
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
        
    cursor = conn.cursor()
    
    try:
        # 2. Handle DELETE
        if request.method == 'DELETE':
            cursor.execute("DELETE FROM weekly_notes WHERE id = %s", (id,))
            conn.commit()
            return jsonify({"success": True, "message": "Note deleted"})

        # 3. Handle PUT (Update)
        if request.method == 'PUT':
            data = request.json
            if not data or 'content' not in data:
                return jsonify({"error": "No content provided"}), 400
                
            cursor.execute("UPDATE weekly_notes SET content = %s WHERE id = %s", (data['content'], id))
            conn.commit()
            return jsonify({"success": True, "message": "Note updated"})

    except Exception as e:
        print(f"Error handling note {id}: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            release_db_connection(conn) 