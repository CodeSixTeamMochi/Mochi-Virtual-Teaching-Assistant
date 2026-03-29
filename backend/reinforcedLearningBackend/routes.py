import json
from flask import request, jsonify
from . import rl_bp
from .services import generate_mochi_reply
from .services import get_or_create_phonetic_data

# Import your database connection from the root db.py file
from db import get_db_connection, release_db_connection

@rl_bp.route('/chat-with-mochi', methods=['POST'])
def chat_with_mochi():
    history_json = request.form.get('history', '[]')
    past_messages = json.loads(history_json)
    
    raw_student_id = request.form.get('student_id')

    try:
        student_id = int(raw_student_id) 
    except (TypeError, ValueError):
        print(f"WARNING: React did not send a valid student_id (Received: {raw_student_id}). Defaulting to 1.")
        student_id = 1

    if 'audio' not in request.files:
        return jsonify({"error": "No audio provided"}), 400

    audio_file = request.files['audio']
    audio_data = audio_file.read()

    try:
        # 1. Get the AI's response and error detection
        reply_data = generate_mochi_reply(audio_data, past_messages)
        
        # 2. Return the response to React so Mochi can speak
        return jsonify(reply_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@rl_bp.route('/speech-assessments', methods=['GET'])
def get_speech_assessments():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # Dynamically generating an ID to bypass the schema mismatch
        cursor.execute("""
            SELECT 
                row_number() OVER () AS id,
                sa.score, 
                sa.comments, 
                st.name AS student_name 
            FROM speech_assessments sa
            JOIN students st ON sa.student_id = st.student_id;
        """)

        columns = [desc[0] for desc in cursor.description]
        records = [dict(zip(columns, row)) for row in cursor.fetchall()]
        cursor.close()
        return jsonify(records)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)

@rl_bp.route('/speech-assessments', methods=['POST'])
def log_successful_assessment():
    conn = get_db_connection()
    try:
        data = request.get_json()
        student_id = data.get('student_id', 1)
        score = data.get('score', 100)
        comments = data.get('comments', 'Successfully pronounced word!')
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO speech_assessments (student_id, score, comments)
            VALUES (%s, %s, %s)
        """, (student_id, score, comments))
        
        conn.commit()
        cursor.close()
        return jsonify({"message": "Victory logged successfully!"}), 201
        
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)

@rl_bp.route('/speech-assessments/<int:id>', methods=['PATCH'])
def update_assessment(id):
    conn = get_db_connection()
    try:
        data = request.get_json()
        new_comment_addition = data.get('comments', ' [MASTERED]')

        cursor = conn.cursor()

        cursor.execute("""
            UPDATE speech_assessments
            SET comments = comments || %s
            WHERE id = %s
        """, (new_comment_addition, id))

        conn.commit()
        cursor.close()
        return jsonify({"message": "Successfully updated!"})
    except Exception as e:
         conn.rollback()
         return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)
        
@rl_bp.route('/speech-assessments/<int:id>', methods=['DELETE'])
def delete_assessment(id):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM speech_assessments WHERE id = %s", (id,))
        conn.commit()
        cursor.close()
        return jsonify({"message": "Successfully deleted!"})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)

@rl_bp.route('/students', methods=['GET'])
def get_classroom_roster():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # 1. Ask the database for BOTH the ID and the Name
        cursor.execute("SELECT student_id, name FROM students ORDER BY name ASC;")
        
        # 2. Package them into a neat dictionary for React
        columns = [desc[0] for desc in cursor.description]
        records = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        cursor.close()
        return jsonify(records)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)

from flask import request, jsonify

@rl_bp.route('/phonetics', methods=['POST'])
def get_dynamic_phonetics():
    data = request.get_json()
    target_word = data.get('word')
    
    if not target_word:
        return jsonify({"error": "No word provided"}), 400
        
    breakdown = get_or_create_phonetic_data(target_word)
    
    if breakdown:
        return jsonify(breakdown), 200
    else:
        return jsonify({"error": "Failed to generate phonetics"}), 500
        
@rl_bp.route('/test-db')
def test_db():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT 1;") 
        cursor.close()
        return jsonify({"status": "success", "message": "Connected to Neon Cloud!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        release_db_connection(conn)