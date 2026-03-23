import json
from flask import request, jsonify
from . import rl_bp
from .services import generate_mochi_reply

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
        print(f"⚠️ WARNING: React did not send a valid student_id (Received: {raw_student_id}). Defaulting to 1.")
        student_id = 1

    if 'audio' not in request.files:
        return jsonify({"error": "No audio provided"}), 400

    audio_file = request.files['audio']
    audio_data = audio_file.read()

    try:
        # 1. Get the AI's response and error detection
        reply_data = generate_mochi_reply(audio_data, past_messages)
        
        # 2. IF Mochi caught a mistake, save it to the Neon Database instantly!
        if reply_data.get("speech_error"):
            conn = get_db_connection()
            try:
                cursor = conn.cursor()
                error_data = reply_data["speech_error"]
                
                error_type = error_data.get("error_type", "Phonetic Error")
                detected = error_data.get("detected_speech", "")
                correction = error_data.get("correction_given", "")

                formatted_comment = f"[{error_type}] Said: '{detected}' | Target: '{correction}' | Status: Needs Practice"

                score = 50     # Standard score for a mistake
                
                cursor.execute("""
                    INSERT INTO speech_assessments (student_id, score, comments)
                    VALUES (%s, %s, %s)
                """, (student_id, score, formatted_comment))
                
                conn.commit()
                cursor.close()
            except Exception as db_error:
                print(f"Database insertion failed: {db_error}")
                conn.rollback()
            finally:
                release_db_connection(conn)

        # 3. Return the response to React so Mochi can speak
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