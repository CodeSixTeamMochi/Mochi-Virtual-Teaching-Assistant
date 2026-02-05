import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app) # CRITICAL: Allows React to talk to Python

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

@app.route('/api/correction', methods=['POST'])
def correction():
    data = request.json
    child_text = data.get('text')
    target = data.get('target')

    prompt = f"""
    You are Mochi, a friendly preschool assistant. 
    A child tried to say '{target}' but said '{child_text}'.
    Check for mispronunciation.
    If correct: Celebrate!
    If wrong: Give a 1-sentence gentle correction for a 5-year-old.
    
    RESPONSE FORMAT (MANDATORY JSON):
    {{
        "mochi_feedback": "Your friendly response here",
        "is_correct": true/false
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        # Clean up Gemini's response to ensure it's pure JSON
        clean_text = response.text.replace('```json', '').replace('```', '').strip()
        return jsonify(json.loads(clean_text))
    except Exception as e:
        return jsonify({"mochi_feedback": "Oh no! My brain is sleepy. Try again!", "is_correct": False})

if __name__ == "__main__":
    app.run(port=5000, debug=True)