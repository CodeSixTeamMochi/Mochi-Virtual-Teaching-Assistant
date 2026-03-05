from flask import Flask, jsonify
from flask_cors import CORS
from db import get_db_connection, release_db_connection

app = Flask(__name__)
# CORS allows your frontend to talk to this backend
CORS(app) 

@app.route('/')
def home():
    return jsonify({"message": "Mochi Backend is Running!"})

@app.route('/api/test-db')
def test_db():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        # Secure query to count your seeded students
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
        # ALWAYS release the connection back to the pool
        release_db_connection(conn)

if __name__ == '__main__':
    app.run(debug=True, port=5000)