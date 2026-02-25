# """
# Lesson Generator Blueprint
# Register this in your main Flask app.
# """

# import os
# import json
# import re
# import requests
# from flask import Blueprint, request, jsonify
# import google.generativeai as genai

# lessons_bp = Blueprint('lessons', __name__, url_prefix='/api')

# GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
# if GEMINI_API_KEY:
#     genai.configure(api_key=GEMINI_API_KEY)


# def generate_image_with_rest_api(prompt: str) -> str:
#     if not GEMINI_API_KEY:
#         return ''
#     url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key={GEMINI_API_KEY}"
#     payload = {
#         "contents": [{"parts": [{"text": prompt}]}],
#         "generationConfig": {"responseModalities": ["IMAGE", "TEXT"]}
#     }
#     try:
#         response = requests.post(url, json=payload, timeout=60)
#         response.raise_for_status()
#         data = response.json()
#         candidates = data.get('candidates', [])
#         if candidates:
#             for part in candidates[0].get('content', {}).get('parts', []):
#                 if 'inlineData' in part:
#                     mime = part['inlineData'].get('mimeType', 'image/png')
#                     img = part['inlineData'].get('data', '')
#                     if img:
#                         return f"data:{mime};base64,{img}"
#         return ''
#     except Exception as e:
#         print(f"Image generation error: {e}")
#         return ''


# @lessons_bp.route('/generate-lesson', methods=['POST'])
# def generate_lesson():
#     try:
#         data = request.get_json()
#         topic = data.get('topic', '')
#         item_count = data.get('item_count', 5)
#         if not topic:
#             return jsonify({'success': False, 'error': 'Topic is required'}), 400
#         if not GEMINI_API_KEY:
#             return jsonify({'success': False, 'error': 'GEMINI_API_KEY not configured'}), 500

#         model = genai.GenerativeModel('gemini-2.0-flash')
#         content_prompt = f"""Generate an educational lesson about "{topic}" for children aged 4-8.
# Return a valid JSON object with this exact structure:
# {{"title": "Learn About {topic}", "description": "A fun lesson about {topic}.", "items": [{{"name": "item name", "spokenText": "Simple text (1-2 sentences)"}}]}}
# Generate exactly {item_count} items. Only return JSON."""

#         content_response = model.generate_content(content_prompt)
#         json_match = re.search(r'\{[\s\S]*\}', content_response.text)
#         if not json_match:
#             raise ValueError('Could not parse JSON')
#         lesson_content = json.loads(json_match.group())

#         items_with_images = []
#         for item in lesson_content.get('items', []):
#             image_prompt = f'Create a simple, colorful, child-friendly cartoon illustration of "{item["name"]}" for a children\'s app about "{topic}". Bright colors, simple shapes, no text, white background.'
#             image_data = generate_image_with_rest_api(image_prompt)
#             items_with_images.append({
#                 'name': item['name'],
#                 'spokenText': item['spokenText'],
#                 'image': image_data
#             })

#         return jsonify({
#             'success': True,
#             'title': lesson_content.get('title', f'Learn About {topic}'),
#             'description': lesson_content.get('description', ''),
#             'items': items_with_images
#         })
#     except Exception as e:
#         return jsonify({'success': False, 'error': str(e)}), 500


# @lessons_bp.route('/generate-lesson-content', methods=['POST'])
# def generate_lesson_content():
#     try:
#         data = request.get_json()
#         topic = data.get('topic', '')
#         item_count = data.get('item_count', 5)
#         if not topic:
#             return jsonify({'success': False, 'error': 'Topic is required'}), 400
#         if not GEMINI_API_KEY:
#             return jsonify({'success': False, 'error': 'GEMINI_API_KEY not configured'}), 500

#         model = genai.GenerativeModel('gemini-2.0-flash')
#         prompt = f"""Generate an educational lesson about "{topic}" for children aged 4-8.
# Return JSON: {{"title": "...", "description": "...", "items": [{{"name": "...", "spokenText": "..."}}]}}
# Generate exactly {item_count} items. Only return JSON."""

#         response = model.generate_content(prompt)
#         json_match = re.search(r'\{[\s\S]*\}', response.text)
#         if not json_match:
#             raise ValueError('Could not parse JSON')
#         lesson_data = json.loads(json_match.group())

#         return jsonify({
#             'success': True,
#             'title': lesson_data.get('title', f'Learn About {topic}'),
#             'description': lesson_data.get('description', ''),
#             'items': lesson_data.get('items', [])
#         })
#     except Exception as e:
#         return jsonify({'success': False, 'error': str(e)}), 500


# @lessons_bp.route('/health', methods=['GET'])
# def health_check():
#     return jsonify({'status': 'ok', 'gemini_configured': GEMINI_API_KEY is not None})


import os
import json
import re
import requests
from flask import Blueprint, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
import random

load_dotenv()

lessons_bp = Blueprint('lessons', __name__, url_prefix='/api')

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
UNSPLASH_ACCESS_KEY = os.environ.get('UNSPLASH_ACCESS_KEY')

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


def fetch_unsplash_image(query: str) -> str:
    """Fetch an image URL from Unsplash for a given search query."""
    if not UNSPLASH_ACCESS_KEY:
        return ''
    try:
        response = requests.get(
            'https://api.unsplash.com/search/photos',
            params={
                'query': f'{query}',
                'per_page': 1,
                'orientation': 'landscape',
            },
            headers={'Authorization': f'Client-ID {UNSPLASH_ACCESS_KEY}'},
            timeout=10,
        )
        response.raise_for_status()
        results = response.json().get('results', [])
        if results:
            return results[0]['urls'].get('regular', '')
        return ''
    except Exception as e:
        print(f"Unsplash error for '{query}': {e}")
        return ''


@lessons_bp.route('/generate-lesson', methods=['POST'])
def generate_lesson():
    try:
        data = request.get_json()
        topic = data.get('topic', '')
        item_count = data.get('item_count', 6)

        if not topic:
            return jsonify({'success': False, 'error': 'Topic is required'}), 400
        if not GEMINI_API_KEY:
            return jsonify({'success': False, 'error': 'GEMINI_API_KEY not configured'}), 500

        # Step 1: Generate text content with Gemini
        model = genai.GenerativeModel('gemini-2.0-flash')
        

        prompt = f"""Generate an educational lesson about "{topic}" for children aged 4-8.

        Return a valid JSON object with this exact structure:
        {{
            "title": "Learn About {topic}",
            "description": "A fun lesson about {topic} for young learners.",
            "items": [
                {{
                    "coverImageQuery": "2-4 broad visual keywords for the lesson cover (e.g., 'colorful fruits healthy food')",
                    "name": "item name",
                    "spokenText": "Simple, engaging text about this item (1-2 sentences)",
                    "imageQuery": "2-4 highly specific words that would return an accurate photo on Unsplash. Focus on the EXACT visual subject, not abstract concepts. For example: instead of 'solar system planet' use 'planet Jupiter closeup', instead of 'animal habitat' use 'lion savanna grassland'"
                }}
            ]
        }}

        Generate exactly {item_count} items. Keep language simple and child-friendly.
        Only return the JSON, no other text."""        

        response = model.generate_content(prompt)
        json_match = re.search(r'\{[\s\S]*\}', response.text)
        if not json_match:
            raise ValueError('Could not parse JSON from response')

        lesson_content = json.loads(json_match.group())

        # Step 2: Fetch images from Unsplash (free!)

        cover_image = fetch_unsplash_image(lesson_content.get('coverImageQuery', topic))
        cover_image = cover_image or 'https://placehold.co/800x600?text=Cover'

        items_with_images = []
        for idx, item in enumerate(lesson_content.get('items', [])):
            print(f"Fetching Unsplash image {idx + 1}: {item['name']}")
            # image_url = fetch_unsplash_image(f"{item['name']} {topic}")
            image_url = fetch_unsplash_image(item.get('imageQuery', item['name']))

            if image_url:
                print(f"  ✓ Image found for {item['name']}")
            else:
                print(f"  ⚠ No image found for {item['name']}")

            items_with_images.append({
                'name': item['name'],
                'spokenText': item['spokenText'],
                'image': image_url,
            })

        return jsonify({
            'success': True,
            'title': lesson_content.get('title', f'Learn About {topic}'),
            'description': lesson_content.get('description', f'A fun lesson about {topic}'),
            'coverImage': cover_image,
            'items': items_with_images,
        })

    except Exception as e:
        print(f"Error generating lesson: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500


@lessons_bp.route('/generate-lesson-content', methods=['POST'])
def generate_lesson_content():
    try:
        data = request.get_json()
        topic = data.get('topic', '')
        item_count = data.get('item_count', 6)

        if not topic:
            return jsonify({'success': False, 'error': 'Topic is required'}), 400
        if not GEMINI_API_KEY:
            return jsonify({'success': False, 'error': 'GEMINI_API_KEY not configured'}), 500

        model = genai.GenerativeModel('gemini-2.0-flash')
        prompt = f"""Generate an educational lesson about "{topic}" for children aged 4-8.

Return a valid JSON object with this exact structure:
{{
    "title": "Learn About {topic}",
    "description": "A fun lesson about {topic} for young learners.",
    "items": [
        {{"name": "item name", "spokenText": "Simple, engaging text about this item (1-2 sentences)"}}
    ]
}}

Generate exactly {item_count} items. Keep language simple and child-friendly.
Only return the JSON, no other text."""

        response = model.generate_content(prompt)
        json_match = re.search(r'\{[\s\S]*\}', response.text)
        if not json_match:
            raise ValueError('Could not parse JSON from response')

        lesson_data = json.loads(json_match.group())
        return jsonify({
            'success': True,
            'title': lesson_data.get('title', f'Learn About {topic}'),
            'description': lesson_data.get('description', f'A fun lesson about {topic}'),
            'items': lesson_data.get('items', []),
        })

    except Exception as e:
        print(f"Error generating content: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@lessons_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'gemini_configured': GEMINI_API_KEY is not None,
        'unsplash_configured': UNSPLASH_ACCESS_KEY is not None,
    })
