from flask import Flask
from flask_cors import CORS
from routes.dashboard import dashboard_bp

app = Flask(__name__)

# Allow specifically your React port
CORS(app, resources={r"/api/*": {"origins": "http://localhost:8080"}},
     supports_credentials=True,
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])   

app.register_blueprint(dashboard_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5000)