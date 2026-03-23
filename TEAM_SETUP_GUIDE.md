# 🚀 Mochi: Developer Setup & Database Guide

Welcome to Phase 3 of Mochi backend development! We have migrated off local databases. We are now using a live **Neon Cloud PostgreSQL** database. This means we all share the exact same 40-student dataset. 

Follow these steps exactly to connect your local feature branch to the live cloud database.

---

## 🛠️ Step 1: Initial Local Setup
1. **Pull the latest code** from the central repository (ensure you have the `app.py`, `db.py`, and `requirements.txt` files).
2. **Open your terminal** in the root `Mochi` folder.
3. **Create your virtual environment:**
   `python -m venv venv`
4. **Activate it:**
   * *Windows:* `venv\Scripts\activate`
   * *Mac/Linux:* `source venv/bin/activate`
5. **Install backend dependencies:**
   `pip install -r requirements.txt`

## 🔐 Step 2: The Security Key (.env)
**CRITICAL:** NEVER push database passwords to GitHub. 
1. Create a file named exactly `.env` in the root folder.
2. Ask the Lead Developer (Sandes) for the Neon Connection URL.
3. Paste it inside the `.env` file exactly like this:
   `DATABASE_URL="postgresql://neondb_owner:PASSWORD_HERE@ep-cool-cloud-12345.../mochi_db?sslmode=require"`
   
*(Note: If you get an SSL handshake error, ensure `&channel_binding=require` is removed from the end of the URL).*

## 🧪 Step 3: Test the Connection
Run the Flask server to verify your connection to the cloud:
`python app.py`

Open your browser to `http://127.0.0.1:5000/test-db`. If you see JSON data saying `{"students_found": 40}`, you are successfully connected!



---

## 🧑‍💻 Step 4: How to Use the Database in Your Features

If you are building a new route (e.g., adding a new AI speech assessment feature), you must use the Connection Pool located in `db.py`. Do not create your own database connections.

### ✅ Example: Fetching Data Securely
Here is the template for writing a database query in your specific feature files:

```python
from db import get_db_connection, release_db_connection
from flask import jsonify

@app.route('/api/your-feature')
def your_feature():
    conn = get_db_connection() # 1. Get connection from pool
    try:
        cursor = conn.cursor()
        
        # 2. WRITE SECURE PARAMETERIZED QUERIES to prevent SQL Injection
        # NEVER do this: f"SELECT * FROM students WHERE name = '{user_input}'"
        user_input = 1
        cursor.execute("SELECT name FROM students WHERE classroom_id = %s", (user_input,))
        
        # 3. Fetch your data
        students = cursor.fetchall()
        cursor.close()
        
        return jsonify({"data": students})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
    finally:
        # 4. CRITICAL: Always return the connection to the pool!
        release_db_connection(conn)