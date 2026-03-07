import json
import os
import time
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import base64

#Import the database connection
from db import get_db_connection, release_db_connection

load_dotenv()
app = Flask(__name__)
CORS(app)

model = genai.GenerativeModel('models/gemini-2.0-flash')
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# MOCHI SYSTEM INSTRUCTION 
MOCHI_INSTRUCTIONS = """
You are Mochi, a warm, friendly virtual teaching assistant for preschoolers. 
The child will speak to you freely.
ALWAYS check the provided chat history for the child's name and preferences.
DO NOT guess names (like Lily). If you don't know the name in the history, say "my friend" 
ALWAYS respond in valid JSON format exactly like this:
{
  "transcription": "what you heard",
  "mochiResponse": "your reply",
  "mood": "HAPPY" | "CELEBRATING" | "ENCOURAGING",
  "speech_error": {
    "error_type": "Phonetic Substitution",
    "detected_speech": "wabbit",
    "correction_given": "rabbit"
  }
}

NOTE: ONLY include the "speech_error" object if the child made a pronunciation mistake. If their speech was fine, leave "speech_error" out completely.

MOOD RULES:
- CELEBRATING: Use if the child says something great, gets a correct answer, or shares a fun fact.
- ENCOURAGING: Use for gentle speech corrections.
- HAPPY: Default state.

GOALS:
1. Respond to the child's content naturally (e.g., if they talk about a cat, talk about a cat).
2. IDENTIFY SPEECH ERRORS: Watch for 'f' for 'th', 'w' for 'r', and 'w' for 'l'.
3. GENTLE CORRECTION: After your natural response, add a gentle correction if you heard a mistake.
   Example: "A wabbit! How cute! I love rabbits too. Try to make a 'rrr' sound with your tongue!"

SAFETY:
- Block all violence/scary topics. Redirect to animals or colors.
- Use simple words for a 5-year-old.
"""

# MOCHI AUDIO ROUTE 

@app.route('/api/chat-with-mochi', methods=['POST'])
def chat_with_mochi():
    #Capture the history sent from the Frontend
    history_json = request.form.get('history', '[]')
    past_messages = json.loads(history_json)

    if 'audio' not in request.files:
        return jsonify({"error": "No audio provided"}), 400

    audio_file = request.files['audio']
    audio_data = audio_file.read()

    try:
        encoded_audio = base64.b64encode(audio_data).decode('utf-8')

        contents = [
            {"role": "user", "parts": [{"text": MOCHI_INSTRUCTIONS + "\nIMPORTANT: Refer to the previous chat history to answer questions about the child's name or interests."}]},
            {"role": "model", "parts": [{"text": "I will remember the child's details from our conversation history!"}]}
        ]

        for msg in past_messages[-6:]:
            gemini_role = "user" if msg['role'] == 'child' else "model"
            contents.append({
                "role": gemini_role, 
                "parts": [{"text": msg['text']}]
            })

        contents.append({
            "role": "user", 
            "parts": [
                {"text": "Please listen to this and answer based on what we've talked about before."},
                {"inline_data": {"mime_type": "audio/webm", "data": encoded_audio}}
            ]
        })

        # Include the MOCHI_INSTRUCTIONS as a system prompt
        response = model.generate_content(contents)

        raw_text = response.text.replace('```json', '').replace('```', '').strip()

        try:
            ai_data = json.loads(raw_text)
        except json.JSONDecodeError:
            ai_data = {"transcription": "...", "mochiResponse": raw_text}

        return jsonify({
            "transcription": ai_data.get("transcription", ""),
            "mochiResponse": ai_data.get("mochiResponse", ""),
            "mood": ai_data.get("mood", "HAPPY")
        })

    except Exception as e:
        print(f"Memory/API Error: {e}")
        return jsonify({"error": "Mochi forgot what we were talking about!"}), 500
    
# Phonetic Dashboard Database Route

@app.route('/api/speech-assessments', methods=['GET'])
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

@app.route('/api/speech-assessments/<int:id>', methods=['PATCH'])
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
        
@app.route('/api/speech-assessments/<int:id>', methods=['DELETE'])
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
        
@app.route('/api/test-db')
def test_db():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT 1;") # A simple ping to the database
        cursor.close()
        return jsonify({"status": "success", "message": "Connected to Neon Cloud!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        release_db_connection(conn)
    
if __name__ == "__main__":
    app.run(port=5000, debug=True)