from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Allows your frontend to talk to this backend

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
        "message": "Mochi is awake and listening!",
        "version": "1.0.0"
    }), 200

if __name__ == "__main__":
    # Runs the server on port 5000
    app.run(debug=True, port=5000)