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
