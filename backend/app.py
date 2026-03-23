"""
Mochi Flask Backend
====================
Run:  python app.py
Seed: python seed.py
"""

from flask import Flask, jsonify
from flask_cors import CORS
from config import Config

from db import get_db_connection, release_db_connection
from revisionGamesBackend.routes import revision_games_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Allow larger payloads (e.g. 16MB) in case Base64 images get large
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 
    
    # CORS securely allows frontend communication
    CORS(app, origins=[Config.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000", "http://localhost:8080"])

    # Register the Revision Games Blueprint
    app.register_blueprint(revision_games_bp, url_prefix="/api/revision")

    @app.route('/')
    def home():
        return jsonify({"message": "Mochi Backend is Running!"})

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok", "service": "mochi-backend"})

    @app.route('/api/test-db')
    def test_db():
        conn = None
        try:
            conn = get_db_connection()
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

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)