import os
import base64
import logging
import uuid  # Added for unique ID generation
from google import genai
from google.genai import types
from flask import current_app

logger = logging.getLogger(__name__)

client = None

SAFETY_BLOCKLIST = [
    'gun', 'weapon', 'knife', 'sword', 'blood', 'gore', 'violence', 
    'kill', 'death', 'war', 'bomb', 'scary', 'fight', 'monster', '18+'
]

def init_gemini():
    global client
    try:
        api_key = current_app.config.get('GEMINI_API_KEY')
        if api_key:
            client = genai.Client(api_key=api_key)
            logger.info("Mochi's Backend Brain Initialized")
        else:
            logger.error("Mochi Error: Gemini API Key not found in Config.")
    except Exception as e:
        logger.error(f"Failed to initialize Gemini: {e}")

def summarize_query_for_unsplash(query):
    if not query or not query.strip():
        return "happy"
        
    global client
    if not client:
        return query

    try:
        summarize_prompt = f"Summarize this into 1 or 2 simple nouns for an image search: '{query}'"
        response = client.models.generate_content(
            model='gemini-3-flash-preview', 
            contents=summarize_prompt,
            config=types.GenerateContentConfig(temperature=0.3)
        )
        return response.text.strip().lower().replace('.', '')
    except Exception as e:
        logger.error(f"Summarization Error: {e}")
        return query 


def generate_ai_image(query):
    global client
    if not client:
        return get_puppy_fallback()

    normalized_query = (query or "").lower().strip()
    is_restricted = any(word in normalized_query for word in SAFETY_BLOCKLIST)
    effective_query = "a cute fluffy golden retriever puppy" if is_restricted else query

    try:
        model_id = 'gemini-3-pro-image-preview' 
        
        config = types.GenerateContentConfig(
            system_instruction="""
                You are Mochi, a professional AI photography assistant for kids.Your goal is to generate high-fidelity, photorealistic images
                SAFETY RULES:
                1. STRICTLY PROHIBITED: Weapons, violence, blood, or gore.
                2. If a user asks for something unsafe, always identify as Mochi and kindly refuse.
                3. Ensure all photos are bright, positive, and educational.
                4. Always provide a sophisticated 3-word super simple title for kids age 1-5.
            """,
            safety_settings=[
                types.SafetySetting(category='HARM_CATEGORY_DANGEROUS_CONTENT', threshold='BLOCK_LOW_AND_ABOVE'),
            ],
            response_modalities=["TEXT", "IMAGE"],
            image_config=types.ImageConfig(aspect_ratio="16:9")
        )

        response = client.models.generate_content(
            model=model_id,
            contents=f"A high-resolution, photorealistic HD cinematic photo of: {effective_query}.Sharp focus, natural lighting, highly detailed textures.",
            config=config
        )

        if not response.candidates or response.candidates[0].finish_reason == "SAFETY":
            logger.warning("Gemini API Safety Block triggered.")
            return get_puppy_fallback(is_restricted=True)

        ai_title = ""
        base64_data = ""

        for part in response.candidates[0].content.parts:
            # Skip Gemini 3 internal reasoning/thought tokens
            if hasattr(part, 'thought') and part.thought:
                continue
            if part.text:
                ai_title = part.text.strip()
            if part.inline_data:
                base64_data = base64.b64encode(part.inline_data.data).decode('utf-8')

        if base64_data:
            return {
                # Use uuid4 to guarantee unique keys in React lists
                "id": str(uuid.uuid4()),
                "title": "A Friendly Friend!" if is_restricted else (ai_title or f"Mochi's {query}"),
                "imageUrl": f"data:image/png;base64,{base64_data}",
                "type": "image",
                "description": "Mochi painted this for you!"
            }
        
        return get_puppy_fallback()

    except Exception as e:
        logger.error(f"Gemini Native Error: {e}")
        return get_puppy_fallback()

def get_puppy_fallback(is_restricted=False):
    """Uses unique UUIDs to prevent React key collision warnings."""
    title = "Friendly Puppy Friend!" if is_restricted else "Mochi's Happy Puppy"
    return {
        "id": f"static-{uuid.uuid4()}",
        "title": title,
        "imageUrl": "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1024&q=80",
        "type": "image",
        "description": "Mochi is taking a quick nap. Here is a puppy friend!"
    }