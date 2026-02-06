import os
import time
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import base64

load_dotenv()
app = Flask(__name__)
CORS(app)

model = genai.GenerativeModel('models/gemini-2.5-flash')
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# MOCHI SYSTEM INSTRUCTION 
MOCHI_INSTRUCTIONS = """
You are Mochi, a warm, friendly virtual teaching assistant for preschoolers. 
The child will speak to you freely. 

GOALS:
1. Respond to the child's content naturally (e.g., if they talk about a cat, talk about a cat).
2. IDENTIFY SPEECH ERRORS: Watch for 'f' for 'th', 'w' for 'r', and 'w' for 'l'.
3. GENTLE CORRECTION: After your natural response, add a gentle correction if you heard a mistake.
   Example: "A wabbit! How cute! I love rabbits too. Try to make a 'rrr' sound with your tongue!"

SAFETY:
- Block all violence/scary topics. Redirect to animals or colors.
- Use simple words for a 5-year-old.
"""

@app.route('/api/chat-with-mochi', methods=['POST'])
def chat_with_mochi():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio provided"}), 400

    audio_file = request.files['audio']
    audio_data = audio_file.read()

    try:
    
        encoded_audio = base64.b64encode(audio_data).decode('utf-8')

        # 3. Include the MOCHI_INSTRUCTIONS as a system prompt
        response = model.generate_content([
            MOCHI_INSTRUCTIONS,  # Give Mochi her personality!
            {
                "mime_type": "audio/webm", 
                "data": encoded_audio
            }
        ])

        return jsonify({"mochiResponse": response.text})

    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"error": "Mochi is sleepy right now!"}), 500
    
if __name__ == "__main__":
    app.run(port=5000, debug=True)