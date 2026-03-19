import logging
from flask import Blueprint, request, jsonify
from visualSearchBackend.services.gemini_service import generate_ai_image
from visualSearchBackend.services.image_search import search_unsplash, track_unsplash_download

# Initialize a logger for this file
logger = logging.getLogger(__name__)

api_bp = Blueprint('api', __name__)

@api_bp.route('/health', methods=['GET'])
def health():
    """Confirms Mochi is online."""
    return jsonify({
        "status": "online",
        "message": "Mochi is awake and listening!",
        "version": "2.0.26"
    })

@api_bp.route('/visual-search', methods=['POST'])
def visual_search():
    """Handles real-world photo searches via Unsplash."""
    try:
        # silent=True prevents a 400 error if JSON is malformed or Content-Type is wrong
        data = request.get_json(silent=True) or {}
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({"results": [], "message": "Mochi needs to know what to look for!"}), 400
            
        results = search_unsplash(query)
        return jsonify({"results": results})
        
    except Exception as e:
        logger.error(f"Visual Search Error: {e}")
        return jsonify({"results": [], "error": "Internal search error"}), 500

@api_bp.route('/generate-content', methods=['POST'])
def generate_content():
    """Handles Mochi's AI image generation via Gemini."""
    try:
        # Use silent=True to handle cases where the frontend forgets the header
        data = request.get_json(silent=True) or {}
        query = data.get('query', '').strip()
        
        if not query:
            # Descriptive error helps debug the 400 status
            return jsonify({"error": "Query key missing or empty in request body"}), 400
            
        result = generate_ai_image(query)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"AI Generation Error: {e}")
        return jsonify({"error": "Mochi's drawing tool is resting. Try again!"}), 500

@api_bp.route('/track-download', methods=['POST'])
def track_download():
    """Analytics tracking for Unsplash (API requirement)."""
    data = request.get_json(silent=True) or {}
    url = data.get('download_location')
    
    if url:
        try:
            track_unsplash_download(url)
            return jsonify({"status": "success"})
        except Exception as e:
            logger.warning(f"Tracking failed: {e}")
            
    return jsonify({"status": "ignored"}), 200

@api_bp.route('/library/save', methods=['POST', 'OPTIONS'])
def save_to_library():
    # 1. Handle CORS preflight check
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
        
    from db import get_db_connection, release_db_connection
    data = request.get_json(silent=True) or {}
    conn = get_db_connection()
    
    try:
        cursor = conn.cursor()
        # Using 'generated_search' to match your DB CHECK constraint
        cursor.execute("""
            INSERT INTO media_assets (file_url, asset_type, search_query, student_id)
            VALUES (%s, %s, %s, %s);
        """, (data.get('url'), 'generated_search', data.get('query'), 1))
        
        conn.commit()
        cursor.close()
        return jsonify({"status": "success", "url": data.get('url')}), 201
        
    except Exception as e:
        logger.error(f"SAVE ERROR: {e}") 
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        release_db_connection(conn)

@api_bp.route('/library', methods=['GET'])
def get_library():
    from db import get_db_connection, release_db_connection
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        # Fetches saved treasures
        cursor.execute("SELECT file_url, search_query FROM media_assets")
        rows = cursor.fetchall()
        cursor.close()
        
        # Mapping for React: Using URL as the unique ID
        assets = [{"id": r[0], "url": r[0], "query": r[1]} for r in rows]
        return jsonify(assets)
    except Exception as e:
        logger.error(f"GET ERROR: {e}") 
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        release_db_connection(conn)

@api_bp.route('/library/delete', methods=['DELETE', 'OPTIONS'])
def delete_from_library():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
        
    from db import get_db_connection, release_db_connection
    data = request.get_json(silent=True) or {}
    url = data.get('url')
    
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            DELETE FROM media_assets 
            WHERE file_url = %s AND student_id = %s;
        """, (url, 1))
        
        conn.commit()
        cursor.close()
        return jsonify({"status": "success", "message": "Image deleted!"}), 200
        
    except Exception as e:
        logger.error(f"DELETE ERROR: {e}") 
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        release_db_connection(conn)