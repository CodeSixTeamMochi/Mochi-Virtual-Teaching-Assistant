"""
Revision Games Routes
======================
Finalized API endpoints for the Revision Games feature.
Connected to Neon PostgreSQL via the shared team db.py connection pool.
"""

from flask import Blueprint, request, jsonify
import json
import psycopg2.extras
from db import get_db_connection, release_db_connection  # Root team connection pool
from .gemini_services import generate_questions, generate_feedback

# Blueprint registration (Prefix /api/revision is handled in app.py)
revision_games_bp = Blueprint("revision_games", __name__)

# ---------------------------------------------------------
# 1. SAVE A NEW GAME (From CreateActivity.tsx)
# ---------------------------------------------------------
@revision_games_bp.route("/activities", methods=["POST"])
def save_activity():
    data = request.json
    conn = get_db_connection()
    try:
        # Using RealDictCursor allows us to access columns by name (e.g., row['game_id'])
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            # name -> title | description -> instructions | questions -> image_urls (JSONB)
            cur.execute(
                """
                INSERT INTO revision_games (teacher_id, title, instructions, image_urls)
                VALUES (%s, %s, %s, %s)
                RETURNING game_id, title, created_at
                """,
                (
                    1, # Default teacher_id for now
                    data.get("name", "Untitled Game"),
                    data.get("description", ""),
                    json.dumps(data.get("questions", [])) # Stores the entire question array as JSONB
                )
            )
            new_game = cur.fetchone()
            conn.commit()
            
            if new_game['created_at']:
                new_game['created_at'] = new_game['created_at'].isoformat()
                
            return jsonify({"message": "Saved to Neon successfully!", "game": new_game}), 201
    except Exception as e:
        if conn: conn.rollback()
        print(f"Database Save Error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)

# ---------------------------------------------------------
# 2. GET ALL GAMES (For Dashboard Display)
# ---------------------------------------------------------
@revision_games_bp.route("/activities/recent", methods=["GET"])
def get_recent_activities():
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM revision_games ORDER BY created_at DESC")
            rows = cur.fetchall()
            
            # Format rows for JSON serialization
            for row in rows:
                if row['created_at']:
                    row['created_at'] = row['created_at'].isoformat()
            
            return jsonify(rows), 200
    except Exception as e:
        print(f"Database Fetch Error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)

# ---------------------------------------------------------
# 3. AI GENERATION (Gemini 2.0 Flash)
# ---------------------------------------------------------
@revision_games_bp.route("/generate", methods=["POST"])
def ai_generate_questions():
    data = request.json
    game_topic = data.get("gameTopic", "General Knowledge")
    subject = data.get("subject", "General")
    description = data.get("description", "")
    
    try:
        generated_data = generate_questions(
            game_topic=game_topic,
            subject=subject,
            description=description
        )
        if not generated_data:
            return jsonify({"error": "Gemini failed to generate content."}), 500
            
        return jsonify(generated_data), 200
    except Exception as e:
        print(f"Gemini Route Error: {e}")
        return jsonify({"error": str(e)}), 500

# ---------------------------------------------------------
# 4. AI FEEDBACK (For the Game Loop)
# ---------------------------------------------------------
@revision_games_bp.route("/feedback", methods=["POST"])
def get_feedback():
    data = request.json
    try:
        result = generate_feedback(
            user_answer=data["user_answer"],
            correct_answer=data["correct_answer"],
            target_item=data["target_item"],
        )
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------------------------------------------------
# 5. SAVE STUDENT SCORE (Progress Tracking)
# ---------------------------------------------------------
@revision_games_bp.route("/progress", methods=["POST"])
def save_progress():
    data = request.json 
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                """
                INSERT INTO revision_scores (student_id, game_id, score)
                VALUES (%s, %s, %s)
                RETURNING score_id, completed_at
                """,
                (
                    data['student_id'],
                    data['game_id'],
                    data['score']
                )
            )
            res = cur.fetchone()
            conn.commit()
            
            if res['completed_at']:
                res['completed_at'] = res['completed_at'].isoformat()
                
            return jsonify(res), 201
    except Exception as e:
        if conn: conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)