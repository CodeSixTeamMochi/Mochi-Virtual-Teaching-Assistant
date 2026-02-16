import logging
import uuid  
from google import genai
from google.genai import types
from flask import current_app

logger = logging.getLogger(__name__)

client = None

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

def get_puppy_fallback(is_restricted=False):
    title = "Friendly Puppy Friend!" if is_restricted else "Mochi's Happy Puppy"
    return {
        "id": f"static-{uuid.uuid4()}",
        "title": title,
        "imageUrl": "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1024&q=80",
        "type": "image",
        "description": "Mochi is taking a quick nap. Here is a puppy friend!"
    }