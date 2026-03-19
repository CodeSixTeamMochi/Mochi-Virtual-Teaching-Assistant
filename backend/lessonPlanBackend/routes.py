import os
import json
import re
import requests
import uuid
from flask import Blueprint, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
from db import get_db_connection, release_db_connection

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
    conn = None
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
                {{
                    "coverImageQuery": "visual keywords",
                    "name": "item name",
                    "spokenText": "Simple engages text",
                    "imageQuery": "specific keywords"
                }}
            ]
        }}
        Generate exactly {item_count} items. Keep language simple. Only return JSON."""        

        response = model.generate_content(prompt)
        json_match = re.search(r'\{[\s\S]*\}', response.text)
        if not json_match:
            raise ValueError('Could not parse JSON from response')

        lesson_content = json.loads(json_match.group())

        cover_image = fetch_unsplash_image(lesson_content.get('coverImageQuery', topic))
        cover_image = cover_image or 'https://placehold.co/800x600?text=Cover'

        items_with_images = []
        for item in lesson_content.get('items', []):
            image_url = fetch_unsplash_image(item.get('imageQuery', item['name']))
            items_with_images.append({
                'name': item['name'],
                'spokenText': item['spokenText'],
                'image': image_url or 'https://placehold.co/400x300?text=Item',
            })

        conn = get_db_connection()
        cursor = conn.cursor()
        
        lesson_uuid = str(uuid.uuid4())[:10]

        cursor.execute(
            "INSERT INTO lesson_plan (id, title, description, cover_image) VALUES (%s, %s, %s, %s)",
            (lesson_uuid, lesson_content.get('title'), lesson_content.get('description'), cover_image)
        )

        final_items = []
        for idx, item in enumerate(items_with_images):
            item_uuid = str(uuid.uuid4())[:10]
            cursor.execute(
                "INSERT INTO lesson_items (id, lesson_id, item_name, spoken_text, image_url, display_order) VALUES (%s, %s, %s, %s, %s, %s)",
                (item_uuid, lesson_uuid, item['name'], item['spokenText'], item['image'], idx)
            )
            final_items.append({
                'id': item_uuid,
                'name': item['name'],
                'spokenText': item['spokenText'],
                'image': item['image'],
                'order': idx
            })
        
        conn.commit()

        return jsonify({
            'success': True,
            'id': lesson_uuid,
            'title': lesson_content.get('title'),
            'description': lesson_content.get('description'),
            'coverImage': cover_image,
            'items': final_items,
        })

    except Exception as e:
        if conn: conn.rollback()
        print(f"Error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        if conn: release_db_connection(conn)

@lessons_bp.route('/lessons', methods=['GET'])
def get_all_lessons():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, title, description, cover_image, is_completed FROM lesson_plan ORDER BY created_at DESC")
        rows = cursor.fetchall()
        lessons = []
        for r in rows:
            cursor.execute("SELECT id, item_name, spoken_text, image_url, display_order FROM lesson_items WHERE lesson_id = %s ORDER BY display_order", (r[0],))
            item_rows = cursor.fetchall()
            items = []
            for ir in item_rows:
                items.append({
                    "id": ir[0], "name": ir[1], "spokenText": ir[2], "image": ir[3], "order": ir[4]
                })

            lessons.append({
                "id": r[0], "title": r[1], "description": r[2], 
                "coverImage": r[3], "isCompleted": r[4], "items": items
            })
        return jsonify(lessons)
    finally:
        release_db_connection(conn)

@lessons_bp.route('/lessons/<lesson_id>', methods=['GET'])
def get_lesson(lesson_id):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, title, description, cover_image, is_completed FROM lesson_plan WHERE id = %s", (lesson_id,))
        row = cursor.fetchone()
        if not row:
            return jsonify({'error': 'Lesson not found'}), 404
            
        cursor.execute("SELECT id, item_name, spoken_text, image_url, display_order FROM lesson_items WHERE lesson_id = %s ORDER BY display_order", (lesson_id,))
        item_rows = cursor.fetchall()
        items = []
        for ir in item_rows:
            items.append({
                "id": ir[0], "name": ir[1], "spokenText": ir[2], "image": ir[3], "order": ir[4]
            })

        return jsonify({
            "id": row[0], "title": row[1], "description": row[2], 
            "coverImage": row[3], "isCompleted": row[4], "items": items
        })
    finally:
        release_db_connection(conn)

@lessons_bp.route('/lessons', methods=['POST'])
def create_lesson():
    conn = get_db_connection()
    try:
        data = request.get_json()
        lesson_uuid = str(uuid.uuid4())[:10]
        
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO lesson_plan (id, title, description, cover_image) VALUES (%s, %s, %s, %s)",
            (lesson_uuid, data.get('title'), data.get('description'), data.get('coverImage'))
        )
        
        items = data.get('items', [])
        final_items = []
        for idx, item in enumerate(items):
            item_uuid = str(uuid.uuid4())[:10]
            cursor.execute(
                "INSERT INTO lesson_items (id, lesson_id, item_name, spoken_text, image_url, display_order) VALUES (%s, %s, %s, %s, %s, %s)",
                (item_uuid, lesson_uuid, item.get('name'), item.get('spokenText'), item.get('image'), idx)
            )
            final_items.append({
                'id': item_uuid, 'name': item.get('name'), 'spokenText': item.get('spokenText'), 'image': item.get('image'), 'order': idx
            })
        
        conn.commit()
        return jsonify({
            "id": lesson_uuid, "title": data.get('title'), "description": data.get('description'), 
            "coverImage": data.get('coverImage'), "isCompleted": False, "items": final_items
        }), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        release_db_connection(conn)

@lessons_bp.route('/lessons/<lesson_id>', methods=['PUT'])
def update_lesson(lesson_id):
    conn = get_db_connection()
    try:
        data = request.get_json()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE lesson_plan SET title = %s, description = %s, cover_image = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
            (data.get('title'), data.get('description'), data.get('coverImage'), lesson_id)
        )
        
        cursor.execute("DELETE FROM lesson_items WHERE lesson_id = %s", (lesson_id,))
        
        items = data.get('items', [])
        final_items = []
        for idx, item in enumerate(items):
            item_uuid = str(uuid.uuid4())[:10]
            cursor.execute(
                "INSERT INTO lesson_items (id, lesson_id, item_name, spoken_text, image_url, display_order) VALUES (%s, %s, %s, %s, %s, %s)",
                (item_uuid, lesson_id, item.get('name'), item.get('spokenText'), item.get('image'), idx)
            )
            final_items.append({
                'id': item_uuid, 'name': item.get('name'), 'spokenText': item.get('spokenText'), 'image': item.get('image'), 'order': idx
            })
            
        conn.commit()
        return jsonify({
            "id": lesson_id, "title": data.get('title'), "description": data.get('description'), 
            "coverImage": data.get('coverImage'), "isCompleted": False, "items": final_items
        })
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        release_db_connection(conn)

@lessons_bp.route('/lessons/<lesson_id>', methods=['DELETE'])
def delete_lesson(lesson_id):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM lesson_plan WHERE id = %s", (lesson_id,))
        conn.commit()
        return jsonify({"success": True})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        release_db_connection(conn)

@lessons_bp.route('/lessons/<lesson_id>/complete', methods=['PATCH'])
def mark_lesson_complete(lesson_id):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("UPDATE lesson_plan SET is_completed = TRUE WHERE id = %s", (lesson_id,))
        conn.commit()
        return jsonify({"success": True})
    finally:
        release_db_connection(conn)

@lessons_bp.route('/lessons/<lesson_id>/reset', methods=['PATCH'])
def reset_lesson(lesson_id):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("UPDATE lesson_plan SET is_completed = FALSE WHERE id = %s", (lesson_id,))
        conn.commit()
        return jsonify({"success": True})
    finally:
        release_db_connection(conn)

@lessons_bp.route('/lessons/completed/ids', methods=['GET'])
def get_completed_lesson_ids():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM lesson_plan WHERE is_completed = TRUE")
        rows = cursor.fetchall()
        return jsonify([r[0] for r in rows])
    finally:
        release_db_connection(conn)

@lessons_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'gemini_configured': GEMINI_API_KEY is not None,
        'unsplash_configured': UNSPLASH_ACCESS_KEY is not None,
    })