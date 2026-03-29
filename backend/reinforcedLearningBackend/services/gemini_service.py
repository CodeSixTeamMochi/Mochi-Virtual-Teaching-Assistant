import os
import json
from google import genai
from google.genai import types

# Configure the NEW Gemini Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

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
    "error_type": "Phonetic Substitution / Vowel Distortion",
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
4. HYPER-VIGILANT SPEECH DETECTION:
   - Children often substitute consonants AND distort vowels at the same time.
   - If you hear a nonsense word like "webbit", "wibbit", or "wabbit", realize they are trying to say "rabbit".
   - If you hear "wed", "wid", or "wad", realize they are trying to say "red".
   - Watch for ANY phonetic approximation where 'r' becomes 'w', 'l' becomes 'w', or 'th' becomes 'f'/'s'. Do not treat these as normal words.

SAFETY:
- Block all violence/scary topics. Redirect to animals or colors.
- Use simple words for a 5-year-old.
"""

def generate_mochi_reply(audio_data, past_messages):
    """Handles communication with the new Gemini SDK."""
    try:
        # 1. In the NEW SDK, System Instructions go into a Config object
        config = types.GenerateContentConfig(
            system_instruction=MOCHI_INSTRUCTIONS + "\nIMPORTANT: Refer to the previous chat history.",
            temperature=0.7,
            response_mime_type="application/json" # To ensure clean JSON output
        )

        contents = []

        recent_messages = past_messages[-6:]

        if len(recent_messages) > 0 and recent_messages[0]['role'] != 'child':
            recent_messages = recent_messages[1:]

        # 2. Build the contents array
        for msg in recent_messages[-6:]:
            role = "user" if msg['role'] == 'child' else "model"
            contents.append(
                types.Content(
                    role=role, 
                    parts=[types.Part.from_text(text=msg['text'])]
                )
            )

        # 3. Add the NEW Audio Request
        audio_part = types.Part.from_bytes(data=audio_data, mime_type="audio/webm")
        text_part = types.Part.from_text(text="Please listen to this and answer based on what we've talked about before.")
        
        contents.append(
            types.Content(role="user", parts=[text_part, audio_part])
        )

        # 4. Generate Content using the client directly
        response = client.models.generate_content(
            model='gemini-2.0-flash', 
            contents=contents,
            config=config
        )

        try:
            ai_data = json.loads(response.text)
        except json.JSONDecodeError:
            ai_data = {"transcription": "...", "mochiResponse": response.text}

        return {
            "transcription": ai_data.get("transcription", ""),
            "mochiResponse": ai_data.get("mochiResponse", ""),
            "mood": ai_data.get("mood", "HAPPY"),
            "speech_error": ai_data.get("speech_error", None)
        }

    except Exception as e:
        print(f"Memory/API Error: {e}")
        raise Exception("Mochi forgot what we were talking about!")