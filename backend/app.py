from flask import Flask
from flask_cors import CORS
from visualSearchBackend.services.config import get_config
from visualSearchBackend.services.gemini_service import init_gemini
from visualSearchBackend.routes import api_bp

def create_app():
    app = Flask(__name__)
    
    # 1. Configuration
    config_obj = get_config()
    app.config.from_object(config_obj)
    
    # 2. Enable CORS (Vital for React/Vite communication)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # 3. Register the Blueprint
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # 4. Initialize AI
    with app.app_context():
        # This ensures init_gemini can use current_app.config['GEMINI_API_KEY']
        try:
            init_gemini()
        except Exception as e:
            print(f"Error initializing Gemini: {e}")
            
    return app
if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)