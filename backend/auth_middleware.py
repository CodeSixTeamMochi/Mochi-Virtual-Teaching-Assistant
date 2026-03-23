import os
import jwt
from functools import wraps
from flask import request, jsonify
from jwt import PyJWKClient

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({'error': 'Token is missing!'}), 401

        try:
            # 1. Load variables and check if they exist
            jwks_url = os.getenv("ASGARDEO_JWKS_URL")
            audience = os.getenv("ASGARDEO_AUDIENCE") # Your Client ID
            issuer = os.getenv("ASGARDEO_ISSUER")

            if not jwks_url:
                print("❌ ERROR: ASGARDEO_JWKS_URL is missing from .env")
                return jsonify({'error': 'Server configuration error'}), 500

            # 2. Fetch the Key
            jwks_client = PyJWKClient(jwks_url)
            signing_key = jwks_client.get_signing_key_from_jwt(token)

            # 3. Decode with flexible verification
            # We skip 'audience' verification temporarily if it's causing the 500
            data = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                audience=audience,
                issuer=issuer,
                options={"verify_aud": True if audience else False} 
            )
            
            return f(data, *args, **kwargs) # Pass data as the first arg
            
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except Exception as e:
            # THIS IS THE KEY: We print the real error to your terminal!
            print(f"🔐 Security Guard Alert: {str(e)}")
            return jsonify({'error': f'Security failed: {str(e)}'}), 401

    return decorated