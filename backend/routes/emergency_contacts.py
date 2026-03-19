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
            SELECT id, name, phone, type, icon 
            FROM emergency_contacts 
            ORDER BY created_at
        """)
        contacts = cursor.fetchall()
        cursor.close()
        
        contacts_list = []
        for contact in contacts:
            contacts_list.append({
                "id": str(contact[0]),
                "name": contact[1],
                "phone": contact[2],
                "type": contact[3],
                "icon": contact[4],
            })
        
        return jsonify(contacts_list), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)


# POST - Add new contact
@emergency_contacts_bp.route('/api/emergency-contacts', methods=['POST'])
def add_emergency_contact():
    conn = get_db_connection()
    try:
        data = request.get_json()
        name = data.get('name')
        phone = data.get('phone')
        contact_type = data.get('type')
        icon = data.get('icon', 'phone')  # Default icon
        
        if not name or not phone or not contact_type:
            return jsonify({"error": "Name, phone, and type required"}), 400
        
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO emergency_contacts (name, phone, type, icon)
            VALUES (%s, %s, %s, %s)
            RETURNING id, name, phone, type, icon
        """, (name, phone, contact_type, icon))
        
        result = cursor.fetchone()
        conn.commit()
        cursor.close()
        
        return jsonify({
            "id": str(result[0]),
            "name": result[1],
            "phone": result[2],
            "type": result[3],
            "icon": result[4],
        }), 201
        
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)


# PUT - Update contact
@emergency_contacts_bp.route('/api/emergency-contacts/<contact_id>', methods=['PUT'])
def update_emergency_contact(contact_id):
    conn = get_db_connection()
    try:
        data = request.get_json()

        #Validation
        name = data.get('name')
        phone = data.get('phone')
        contact_type = data.get('type')
        icon = data.get('icon')
        
        if not name or not phone or not contact_type or not icon:
            return jsonify({"error": "All fields are required"}), 400
        
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE emergency_contacts 
            SET name = %s, phone = %s, type = %s, icon = %s, 
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING id, name, phone, type, icon
        """, (name, phone, contact_type, icon, contact_id))
        
        result = cursor.fetchone()
        conn.commit()
        cursor.close()
        
        if not result:
            return jsonify({"error": "Contact not found"}), 404
        
        return jsonify({
            "id": str(result[0]),
            "name": result[1],
            "phone": result[2],
            "type": result[3],
            "icon": result[4],
        }), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)


# DELETE contact
@emergency_contacts_bp.route('/api/emergency-contacts/<contact_id>', methods=['DELETE'])
def delete_emergency_contact(contact_id):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM emergency_contacts WHERE id = %s RETURNING id", (contact_id,))
        result = cursor.fetchone()
        conn.commit()
        cursor.close()
        
        if not result:
            return jsonify({"error": "Contact not found"}), 404
        
        return jsonify({"message": "Deleted successfully"}), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        release_db_connection(conn)