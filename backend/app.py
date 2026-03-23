"""
Main Flask Application for Mochi
Unified entry point for all team blueprints.
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Database
from db import get_db_connection, release_db_connection

# Import Team Blueprints 

# Reinforced Learning Feature
from reinforcedLearningBackend import rl_bp

# Dashboard & Core Student Management
from routes.routes import dashboard_bp, auth_bp
from routes.emergency_contacts import emergency_contacts_bp
from routes.medications import medications_bp
from routes.students import students_bp
from routes.classrooms import classrooms_bp  # <-- Added this import to fix a missing variable in the original file

# Visual Search Feature
from visualSearchBackend.services.config import get_config
from visualSearchBackend.services.gemini_service import init_gemini
from visualSearchBackend.routes import api_bp as visual_search_bp

# Lesson Plans Feature
from lessonPlanBackend import lessons_bp

# Load environment variables
load_dotenv()

def create_app():
    
    app = Flask(__name__)

    try:
        # Visual Search Config
        config_obj = get_config()
        app.config.from_object(config_obj)
    except Exception as e:
        print(f"Warning: Could not load Visual Search config: {e}")

    # Permissive CORS to handle React/Vite from any localhost port
    CORS(app, resources={r"/*": {"origins": "*"}},
         supports_credentials=True,
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization"])

    # Initialize AI (Visual Search)
    with app.app_context():
        try:
            init_gemini()
        except Exception as e:
            print(f"Error initializing Visual Search Gemini: {e}")

    # Register All Blueprints 
    
    # Register Reinforced Learning Feature
    app.register_blueprint(rl_bp, url_prefix='/api')
    
    # Register Visual Search
    app.register_blueprint(visual_search_bp, url_prefix='/api')
    
    # Register Core Routes
    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(emergency_contacts_bp)
    app.register_blueprint(medications_bp)
    app.register_blueprint(students_bp)
    app.register_blueprint(classrooms_bp)
    
    # Register Lesson Plans
    app.register_blueprint(lessons_bp)

    # Base Health Check Routes 
    @app.route('/')
    def home():
        return jsonify({"message": "Mochi Backend is Running with ALL team features!"})

    @app.route('/api/test-db')
    def test_db():
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT count(*) FROM students;")
            count = cursor.fetchone()[0]
            cursor.close()
            
            return jsonify({
                "status": "success", 
                "message": f"Connected! Found {count} students in the cloud database."
            })
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
        finally:
            if conn:
                release_db_connection(conn)

    return app


if __name__ == '__main__':
    app = create_app()
    print("Starting main Flask server on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)