import json
from google import genai
from google.genai import types
from db import get_db_connection, release_db_connection
import os

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_or_create_phonetic_data(word):
    normalized_word = word.lower().strip()
    conn = get_db_connection()
    
    try:
        cursor = conn.cursor()
        
        # 1. Check if the word is already in the database
        cursor.execute("""
            SELECT word, phonemes, target_sound, difficulty, category 
            FROM phonetic_dictionary 
            WHERE word = %s
        """, (normalized_word,))
        
        row = cursor.fetchone()
        
        if row:
            print(f"Found '{normalized_word}' in Neon database!")
            return {
                "word": row[0],
                "phonemes": row[1], 
                "targetSound": row[2],
                "difficulty": row[3],
                "category": row[4]
            }

        # 2. If it's NOT in the DB, ask Gemini to generate it.
        print(f"GEMINI: '{normalized_word}' missing. Generating new phonetic data...")
        
        prompt = f"""
        You are a clinical speech-language pathologist. Break down the word '{normalized_word}'.
        Return ONLY valid JSON in this exact format:
        {{
            "phonemes": ["y", "eh", "l", "oe"],
            "targetSound": "y", 
            "difficulty": 1, 
            "category": "COLORS"
        }}
        Rules: 
        - phonemes: array of phonetic string representations.
        - targetSound: the most common consonant sound a preschooler might struggle with in this word (e.g., 'r', 'l', 'th', 's', 'y').
        - difficulty: 1, 2, or 3.
        - category: choose from ANIMALS, FRUIT, VEGETABLES, COLORS, NUMBERS, OBJECTS, ACTIONS, BODY, NATURE.
        """
        
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt,
            config=types.GenerateContentConfig(response_mime_type="application/json")
        )
        
        new_data = json.loads(response.text)
        
        # 3. Save to database
        cursor.execute("""
            INSERT INTO phonetic_dictionary (word, phonemes, target_sound, difficulty, category)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            normalized_word, 
            json.dumps(new_data["phonemes"]), 
            new_data["targetSound"], 
            new_data["difficulty"], 
            new_data["category"]
        ))
        conn.commit()
        cursor.close()

        print(f"SUCCESS: '{normalized_word}' generated and saved to database!")

        # Format it for React
        new_data["word"] = normalized_word
        return new_data

    except Exception as e:
        print(f"Error in dynamic dictionary generation: {e}")
        if conn: conn.rollback()
        return None
    finally:
        release_db_connection(conn)