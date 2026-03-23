"""
Revision Games Routes
======================
All API endpoints for the Revision Games feature.
Updated to integrate Gemini 2.0 Flash and Gemini 3 Pro Image Preview.
"""

from flask import Blueprint, request, jsonify
import psycopg2.extras 
import json

# Import your new thread-safe connection pool functions
from db import get_db_connection, release_db_connection

from .gemini_services import generate_questions, generate_feedback

revision_games_bp = Blueprint("revision_games", __name__) # Ensure prefix logic is in app.py

# --- Categories ---

@revision_games_bp.route("/categories", methods=["GET"])
def get_categories():
    # TODO: Implement DB fetch
    return jsonify([])

@revision_games_bp.route("/categories", methods=["POST"])
def create_category():
    # Mock response
    return jsonify({"id": 1, "name": "Mock Category", "description": "Temp mock"}), 201

# --- Questions ---

@revision_games_bp.route("/categories/<int:category_id>/questions", methods=["GET"])
def get_questions(category_id):
    # TODO: Implement DB fetch
    return jsonify([])

@revision_games_bp.route("/categories/<int:category_id>/questions", methods=["POST"])
def create_question(category_id):
    # Mock response
    return jsonify({"id": 1, "options": []}), 201

# --- AI Generation ---

@revision_games_bp.route("/generate", methods=["POST"])
def ai_generate_questions():
    """
    Triggers the Gemini text generation and AI image generation.
    """
    data = request.json
    game_topic = data.get("gameTopic", "General Knowledge")
    subject = data.get("subject", "General")
    description = data.get("description", "")
    
    print(f"Mochi AI Request: {game_topic} | {subject}")

    try:
        generated_data = generate_questions(
            game_topic=game_topic,
            subject=subject,
            description=description
        )
        
        if not generated_data:
            return jsonify({"error": "Failed to generate content."}), 500

        return jsonify(generated_data)

    except Exception as e:
        print(f"Route Error: {e}")
        return jsonify({"error": str(e)}), 500

# --- AI Feedback ---

@revision_games_bp.route("/feedback", methods=["POST"])
def get_feedback():
    data = request.json
    result = generate_feedback(
        user_answer=data["user_answer"],
        correct_answer=data["correct_answer"],
        target_item=data["target_item"],
    )
    return jsonify(result)

# --- Save Generated Game ---

@revision_games_bp.route("/activities", methods=["POST"])
def save_activity():
    data = request.json
    
    # Extract data provided by React
    # Hardcoding teacher_id to 1 if not provided, for testing purposes
    teacher_id = data.get("teacher_id", 1) 
    title = data.get("title", "Untitled Mochi Game")
    instructions = data.get("instructions", "")
    image_urls = data.get("image_urls", [])

    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            # Insert into the new revision_games table
            cur.execute(
                """
                INSERT INTO revision_games (teacher_id, title, instructions, image_urls)
                VALUES (%s, %s, %s, %s)
                RETURNING game_id, title, created_at
                """,
                (teacher_id, title, instructions, json.dumps(image_urls))
            )
            new_game = cur.fetchone()
            
            # Commit the transaction to save it to Neon
            conn.commit()
            
            # We convert the datetime object to an ISO format string so JSON can parse it
            if new_game and new_game.get('created_at'):
                new_game['created_at'] = new_game['created_at'].isoformat()
                
            return jsonify({"message": "Game saved to Neon!", "game": new_game}), 201
            
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Database Error: {e}")
        return jsonify({"error": str(e)}), 500
        
    finally:
        if conn:
            release_db_connection(conn)

# --- Progress Logs ---

@revision_games_bp.route("/progress", methods=["POST"])
def save_progress():
    # TODO: Implement progress tracking in DB
    return jsonify({"id": 1, "completed_at": "2026-02-22T23:37:29"}), 201

@revision_games_bp.route("/activities/recent", methods=["GET"])
def get_recent_activities():
    # TODO: Fetch from DB
    return jsonify([])