from flask import Blueprint, jsonify, request
from db import get_db_connection, release_db_connection

emergency_contacts_bp = Blueprint('emergency_contacts', __name__)

# GET all emergency contacts
@emergency_contacts_bp.route('/api/emergency-contacts', methods=['GET'])
def get_emergency_contacts():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, name, phone, icon 
            FROM emergency_contacts 
            ORDER BY id
        """)
        contacts = cursor.fetchall()
        cursor.close()
        
        # Format response
        contacts_list = []
        for contact in contacts:
            contacts_list.append({
                "id": str(contact[0]),
                "name": contact[1],
                "phone": contact[2],
                "icon": contact[3]
            })
        
        return jsonify(contacts_list), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)


# ADD a new emergency contact
@emergency_contacts_bp.route('/api/emergency-contacts', methods=['POST'])
def add_emergency_contact():
    conn = get_db_connection()
    try:
        data = request.get_json()
        name = data.get('name')
        phone = data.get('phone')
        icon = data.get('icon', 'hospital')  # default icon
        
        # Validate input
        if not name or not phone:
            return jsonify({"error": "Name and phone are required"}), 400
        
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO emergency_contacts (name, phone, icon)
            VALUES (%s, %s, %s)
            RETURNING id
        """, (name, phone, icon))
        
        new_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        
        return jsonify({
            "id": str(new_id),
            "name": name,
            "phone": phone,
            "icon": icon
        }), 201
        
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)


# UPDATE an emergency contact
@emergency_contacts_bp.route('/api/emergency-contacts/<contact_id>', methods=['PUT'])
def update_emergency_contact(contact_id):
    conn = get_db_connection()
    try:
        data = request.get_json()
        name = data.get('name')
        phone = data.get('phone')
        icon = data.get('icon')
        
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE emergency_contacts 
            SET name = %s, phone = %s, icon = %s
            WHERE id = %s
        """, (name, phone, icon, contact_id))
        
        conn.commit()
        cursor.close()
        
        return jsonify({
            "id": contact_id,
            "name": name,
            "phone": phone,
            "icon": icon
        }), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)


# DELETE an emergency contact
@emergency_contacts_bp.route('/api/emergency-contacts/<contact_id>', methods=['DELETE'])
def delete_emergency_contact(contact_id):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM emergency_contacts WHERE id = %s", (contact_id,))
        conn.commit()
        cursor.close()
        
        return jsonify({"message": "Contact deleted successfully"}), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)