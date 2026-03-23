"""
Gemini AI Service + Native Gemini 3 Image Generation
========================================
Project MOCHI: A preschool educational assistant.
Handles text generation via Gemini 2.0 Flash and 
image generation via Gemini 3 Pro Image Preview.
"""

import os
import re
import json
import logging
import uuid
import base64
import random
from typing import List, Dict, Optional

# The new standard Google GenAI SDK
from google.genai import Client, types
from google.genai.errors import APIError

# Setup basic logging
logger = logging.getLogger(__name__)

# Initialize the Gemini Client safely
# It will automatically pick up the GEMINI_API_KEY from the environment we set in app.py
try:
    client = Client()
except Exception as e:
    logger.error(f"Failed to initialize Gemini Client. Did you set the API key? Error: {e}")
    client = None

# ──────────────────────────────────────
# SAFETY & CONTENT CONTROL
# ──────────────────────────────────────

SAFETY_BLOCKLIST = [
    'gun', 'weapon', 'knife', 'sword', 'blood', 'gore', 'violence', 
    'kill', 'death', 'war', 'bomb', 'scary', 'fight', 'monster', '18+'
]

def is_safe(query: str) -> bool:
    """Verifies that the prompt is appropriate for kids aged 2-6."""
    normalized = query.lower().strip()
    return not any(word in normalized for word in SAFETY_BLOCKLIST)

# ──────────────────────────────────────
# IMAGE GENERATION (GEMINI 3 PRO)
# ──────────────────────────────────────

def generate_ai_image(prompt_text: str) -> Optional[str]:
    """
    Generates a custom image using Nano Banana Pro (Gemini 3 Pro Image).
    Returns a Base64 data URI string, or None if it fails.
    """
    if not client:
        logger.error("Skipping image generation: Gemini Client is not initialized.")
        return None

    try:
        config = types.GenerateContentConfig(
            system_instruction="You are Mochi, a professional AI photography assistant for kids. Generate high-fidelity, clean, and joyful images on plain backgrounds.",
            safety_settings=[
                types.SafetySetting(category='HARM_CATEGORY_DANGEROUS_CONTENT', threshold='BLOCK_LOW_AND_ABOVE'),
            ],
            response_modalities=["TEXT", "IMAGE"],
            image_config=types.ImageConfig(aspect_ratio="1:1"),
            temperature=0.4 
        )

        final_prompt = f"A clean, simple, photorealistic photo for a kids educational game showing: {prompt_text}. Easy to see and count."

        logger.info(f"🎨 Generating image for prompt: '{prompt_text}'")
        response = client.models.generate_content(
            model='gemini-3-pro-image-preview',
            contents=final_prompt,
            config=config
        )

        # Check if the API blocked the request for safety reasons
        if not response.candidates or response.candidates[0].finish_reason == "SAFETY":
            logger.warning(f"🛡️ Safety Block triggered for image prompt: '{prompt_text}'")
            return None

        # Extract the image safely from the response parts
        for part in response.candidates[0].content.parts:
            # Skip the internal 'thought' process 
            if getattr(part, 'thought', False):
                continue
            
            # If we find the image data, encode it for the frontend
            if getattr(part, 'inline_data', None):
                base64_data = base64.b64encode(part.inline_data.data).decode('utf-8')
                return f"data:image/png;base64,{base64_data}"

        logger.warning("No image data found in the Gemini response.")
        return None

    # Specifically catch Google SDK errors (like 429 Rate Limits or 500 Server Errors)
    except APIError as api_err:
        logger.error(f"📸 Gemini API Error during image generation: {api_err}")
        return None
    except Exception as e:
        logger.error(f"📸 Unexpected Error during image generation: {e}")
        return None

# ──────────────────────────────────────
# QUESTION GENERATION
# ──────────────────────────────────────

def generate_questions(game_topic: str, subject: str, description: str) -> List[Dict]:
    """
    Generates text with Flash and custom photos with Pro Image.
    Returns a list of question dictionaries.
    """
    if not client:
        logger.error("Skipping question generation: Gemini Client is not initialized.")
        return []

    # 1. Preschool Safety Guard
    if not is_safe(game_topic) or not is_safe(description):
        logger.warning(f"🛡️ Safety trigger activated for topic '{game_topic}'. Defaulting to safe fallback.")
        game_topic = "Happy Puppies"
        description = "Learn about friendly puppies playing in a garden."

    prompt = f"""
    Act as Mochi, a preschool teacher. Create a fun, multiple-choice educational game.
    
    Here is your core data:
    - Game Theme: {game_topic}
    - Learning Skill: {subject}
    - Exact Scenario to Test: {description}
    
    CRITICAL RULES TO LINK THE QUESTION AND ANSWER:
    1. First, decide what the CORRECT answer is based on the Exact Scenario.
    2. You MUST write the `questionText` so it explicitly asks for that exact correct answer. 
        Format it EXACTLY like this: "Can you find the picture with [INSERT CORRECT ANSWER HERE]?"
    3. Create ONLY one question per game topic with exactly 3 options. The correct answer must be one of the options. If asked for multiple questions make more of the amount of questions asked according to the correct scenario.
    4. Create 3 options. ONE option must perfectly match the correct answer. The other TWO must be plausible wrong answers (e.g., wrong numbers or wrong colors).
    5. randomize the order of the options so the correct answer isn't always in the same position.in each generated questions it should be in a different position.
    6. The `correct_answer` field MUST exactly match the `label` of the correct option.And the correct answer must be randomly placed in the options list, not always the first one, second one, or third one.
    7. NEVER mention backgrounds like "tables" or "rooms" in the text.

    Respond ONLY with a JSON array in this exact format. Do not include markdown blocks.
    [
      {{
        "gameTitle": "{game_topic}",
        "questionText": "Can you find the picture with exactly 2 red apples?",
        "options": [
          {{ "label": "2 red apples", "imageGenerationPrompt": "Exactly 2 bright red apples isolated on a plain white background" }},
          {{ "label": "1 red apple", "imageGenerationPrompt": "Exactly 1 bright red apple isolated on a plain white background" }},
          {{ "label": "3 red apples", "imageGenerationPrompt": "Exactly 3 bright red apples isolated on a plain white background" }}
        ],
        "correct_answer": "2 red apples",
        "explanation": "Great job! That picture has exactly 2 red apples."
      }}
    ]
    """

    text = "" # Ensure text is defined in case the API call completely fails
    try:
        # 2. Generate the Lesson Plan (Text)
        response = client.models.generate_content(
            model="gemini-2.0-flash", 
            contents=prompt
        )
        text = response.text.strip()

        # 3. Clean and Parse JSON robustly using Regex
        # This will find the JSON array even if the AI adds "Here is your game:" before it
        match = re.search(r'\[.*\]', text, re.DOTALL)
        if match:
            text = match.group(0)
            
        questions = json.loads(text)

        # 4. Enrich with AI Generated Photos
        for q in questions:
            q["id"] = str(uuid.uuid4())
            if 'options' in q:
                random.shuffle(q['options'])
            for opt in q.get('options', []):
                # Safe dictionary access (.get) prevents crashes if the AI forgot a key
                search_term = opt.get('imageGenerationPrompt', opt.get('label', ''))
                if search_term:
                    opt['image'] = generate_ai_image(search_term)
                else:
                    opt['image'] = None

        return questions

    # Catch specific JSON breaking errors
    except json.JSONDecodeError as json_err:
        logger.error(f"🧠 Failed to parse Gemini output as JSON: {json_err}. Raw Text: {text}")
        return []
    except APIError as api_err:
        logger.error(f"🧠 Gemini API Error during question generation: {api_err}")
        return []
    except Exception as e:
        logger.error(f"🧠 Unexpected Error during question generation: {e}")
        return []

# ──────────────────────────────────────
# FEEDBACK GENERATION
# ──────────────────────────────────────

def generate_feedback(user_answer: str, correct_answer: str, target_item: str) -> Dict:
    """Generates encouraging, Mochi-themed feedback for the child."""
    if not client:
        return {"message": "Great try! 🌟", "encouragement": "Let's try one more!"}

    prompt = f"Mochi says: Child picked '{user_answer}', correct was '{correct_answer}'. Topic: '{target_item}'. Give happy feedback (max 12 words) and encouragement in JSON: {{'message': 'string', 'encouragement': 'string'}}"
    
    text = ""
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash", 
            contents=prompt
        )
        text = response.text.strip()
        
        # Safe JSON extraction for objects
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            text = match.group(0)
            
        return json.loads(text)
        
    except json.JSONDecodeError:
        logger.error(f"🧠 Failed to parse feedback JSON. Raw Text: {text}")
        return {"message": "Great try! 🌟", "encouragement": "Let's try one more!"}
    except Exception as e:
        logger.error(f"🧠 Feedback Generation Error: {e}")
        return {"message": "Great try! 🌟", "encouragement": "Let's try one more!"}