import os
from pathlib import Path
from dotenv import load_dotenv

# 1. Path Setup
basedir = Path(__file__).resolve().parent.parent.parent
env_path = os.path.join(basedir, '.env')
load_dotenv(env_path)

class Config:
    """Base development configuration for Mochi."""
    # Security
    SECRET_KEY = os.environ.get('SECRET_KEY', 'mochi-super-secret-key-2026')
    
    # API Keys (Mapping VITE_ names from .env to internal Config names)
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
    UNSPLASH_ACCESS_KEY = os.environ.get('UNSPLASH_ACCESS_KEY')
    
    
    # Flask settings
    DEBUG = os.environ.get('FLASK_DEBUG', 'True').lower() in ['true', '1', 't', 'yes']
    
    # Port handling with a fallback to 5000
    try:
        PORT = int(os.environ.get('PORT', 5000))
    except ValueError:
        PORT = 5000

    @staticmethod
    def check_env():
        """Optional helper to alert you if keys are missing on startup."""
        missing = []
        if not os.environ.get('GEMINI_API_KEY'): missing.append("GEMINI_API_KEY")
        if not os.environ.get('UNSPLASH_ACCESS_KEY'): missing.append("UNSPLASH_ACCESS_KEY")
        
        if missing:
            print(f"Mochi Warning: Missing environment variables: {', '.join(missing)}")
            print(f"Looking in: {env_path}")

class ProductionConfig(Config):
    """Production settings (Forces high security)."""
    DEBUG = False
    SECRET_KEY = os.environ.get('SECRET_KEY')

def get_config():
    """Returns the appropriate config object based on environment."""
    env = os.environ.get('FLASK_ENV', 'development').lower()
    
    # Run the env check to help with debugging
    Config.check_env()
    
    if env == 'production':
        return ProductionConfig()
    return Config()