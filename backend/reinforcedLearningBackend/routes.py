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
                
                # Assuming student_id is 1 for the demo. You can make this dynamic later!
                student_id = 1 
                
                cursor.execute("""
                    INSERT INTO speech_assessments 
                    (student_id, error_type, detected_speech, correction_given, status) 
                    VALUES (%s, %s, %s, %s, 'needs_practice')
                """, (
                    student_id, 
                    error_data.get("error_type", "Phonetic Error"), 
                    error_data.get("detected_speech", ""), 
                    error_data.get("correction_given", "")
                ))
                
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
        cursor.execute("SELECT id, student_id, error_type, detected_speech, correction_given, status FROM speech_assessments ORDER BY id DESC;")
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
        new_status = data.get('status', 'mastered')
        cursor = conn.cursor()
        cursor.execute("UPDATE speech_assessments SET status = %s WHERE id = %s", (new_status, id))
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