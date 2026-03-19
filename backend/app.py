from flask import Flask, jsonify
from flask_cors import CORS
from db import get_db_connection, release_db_connection
from routes.emergency_contacts import emergency_contacts_bp
from routes.medications import medications_bp
from routes.students import students_bp

app = Flask(__name__)
CORS(app)

# Register emergency contacts blueprint
app.register_blueprint(emergency_contacts_bp)  
# Register medications blueprint
app.register_blueprint(medications_bp)  
# Register students blueprint
app.register_blueprint(students_bp)  
# Register classrooms blueprint
app.register_blueprint(classrooms_bp)  



@app.route('/')
def home():
    return jsonify({"message": "Mochi Backend is Running!"})

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
        release_db_connection(conn)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
from flask import Flask
from flask_cors import CORS
from visualSearchBackend.services.config import get_config
from visualSearchBackend.services.gemini_service import init_gemini
from visualSearchBackend.routes import api_bp
from flask import Flask, jsonify
from db import get_db_connection, release_db_connection

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

    # 5. Database & Health Check Routes (Added without changing existing lines)
    @app.route('/')
    def home():
        return jsonify({"message": "Mochi Backend is Running!"})

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
            release_db_connection(conn)
            
    return app
if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
"""
Main Flask Application
Each team member registers their Blueprint here.
"""

from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # === Register each team member's blueprint ===
    from lessonPlanBackend import lessons_bp
 
    app.register_blueprint(lessons_bp)

    return app


if __name__ == '__main__':
    app = create_app()
    print("Starting main Flask server on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
