from flask import Flask
from flask_cors import CORS
from emergency_contacts_routes import emergency_contacts_bp

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Register blueprints
app.register_blueprint(emergency_contacts_bp)

# Your existing routes...

if __name__ == '__main__':
    app.run(debug=True, port=5000)