from flask import Blueprint, request, jsonify
from visualSearchBackend.services.gemini_service import generate_ai_image

# We create a Blueprint so our routes are organized
api_bp = Blueprint('api', __name__)

@api_bp.route('/health', methods=['GET'])
def health_check():
    """A quick check to see if Mochi's heart is beating."""
    return jsonify({"status": "healthy", "message": "Mochi is awake!"})

@api_bp.route('/generate-content', methods=['POST'])
def generate_content():
    """
    The main entrance for AI Drawing. 
    It receives a prompt and returns the AI-painted image.
    """
    data = request.get_json()
    
    # We look for 'query' because that's what we named it in our logic
    user_query = data.get('query', '')

    if not user_query:
        return jsonify({"error": "Mochi needs to know what to draw!"}), 400

    # Call the 'Engine'
    result = generate_ai_image(user_query)
    
    return jsonify(result)