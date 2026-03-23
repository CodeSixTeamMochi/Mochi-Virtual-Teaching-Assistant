import requests
import logging
from flask import current_app

# Set up logging to see what Mochi is doing in the console
logger = logging.getLogger(__name__)

def search_unsplash(raw_query):

    from .gemini_service import summarize_query_for_unsplash
    
    try:
        # Step 1: Gemini 3 Flash extracts the 'essence' of the prompt
        smart_query = summarize_query_for_unsplash(raw_query)
        logger.info(f"Mochi thinking: '{raw_query}' -> keywords: '{smart_query}'")

        # Step 2: Fetch the results using the cleaned-up query
        return get_unsplash_results(smart_query)
    except Exception as e:
        logger.error(f"Smart Search Error: {e}")
        return []

def get_unsplash_results(query):
    api_key = current_app.config.get('UNSPLASH_ACCESS_KEY')
    
    if not api_key:
        logger.error("UNSPLASH_ACCESS_KEY is missing from config!")
        return []

    url = "https://api.unsplash.com/search/photos"
    params = {
        'query': query,
        'client_id': api_key,
        'per_page': 6,       
        'orientation': 'landscape',
        'content_filter': 'high' 
    }

    try:
        response = requests.get(url, params=params, timeout=5)
        
        # Check if we hit the Unsplash rate limit 
        if response.status_code == 403:
            logger.warning("Unsplash Rate Limit Hit!")
            return []

        response.raise_for_status()
        data = response.json()

        # Map Unsplash data to the specific format your Frontend expects
        return [{
            "id": item.get('id'),
            "title": item.get('alt_description') or f"Photo of {query}",
            "imageUrl": item['urls']['regular'], 
            "photographer": item['user']['name'],
            "attributionUrl": f"{item['user']['links']['html']}?utm_source=Mochi_AI&utm_medium=referral",
            "download_location": item['links'].get('download_location')
        } for item in data.get('results', [])]
        
    except Exception as e:
        logger.error(f"Unsplash API Error: {e}")
        return []

def track_unsplash_download(download_url):
    api_key = current_app.config.get('UNSPLASH_ACCESS_KEY')
    if download_url and api_key:
        try:
            requests.get(download_url, params={'client_id': api_key}, timeout=5)
            logger.info("Unsplash download tracked successfully.")
        except Exception as e:
            logger.error(f"Tracking Error: {e}")