from flask import Blueprint, jsonify
from db import get_db_connection, release_db_connection

classrooms_bp = Blueprint('classrooms', __name__)

# GET all classrooms
@classrooms_bp.route('/api/classrooms', methods=['GET'])
def get_classrooms():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT classroom_id, room_number
            FROM classrooms
            ORDER BY room_number
        """)
        classrooms = cursor.fetchall()
        cursor.close()
        
        classrooms_list = []
        for classroom in classrooms:
            classrooms_list.append({
                "id": str(classroom[0]),
                "name": classroom[1]
            })
        
        return jsonify(classrooms_list), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)