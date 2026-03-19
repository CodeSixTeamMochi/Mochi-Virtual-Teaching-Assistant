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