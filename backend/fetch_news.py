# fetch_news.py
import os
import requests
import json
from datetime import datetime, timedelta
from typing import List, Dict, Optional

API_KEY = os.getenv("FINNHUB_API_KEY")

def fetch_market_news(category: str = "general", limit: int = 50) -> List[Dict]:
    """
    Fetch market news from Finnhub API
    
    Args:
        category: News category (general, forex, crypto, merger)
        limit: Maximum number of articles to fetch
    
    Returns:
        List of news articles
    """
    if not API_KEY:
        raise ValueError("FINNHUB_API_KEY environment variable is not set")
    
    url = "https://finnhub.io/api/v1/news"
    params = {
        "category": category,
        "token": API_KEY
    }
    
    try:
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        articles = response.json()
        
        # Filter and format articles
        formatted_articles = []
        for article in articles[:limit]:
            formatted_article = {
                "id": article.get("id"),
                "headline": article.get("headline"),
                "summary": article.get("summary"),
                "source": article.get("source"),
                "url": article.get("url"),
                "image": article.get("image"),
                "datetime": article.get("datetime"),
                "category": article.get("category"),
                "related": article.get("related")
            }
            formatted_articles.append(formatted_article)
        
        return formatted_articles
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching news: {e}")
        return []
    except Exception as e:
        print(f"Unexpected error: {e}")
        return []

def fetch_company_news(symbol: str, limit: int = 20) -> List[Dict]:
    """
    Fetch news for a specific company
    
    Args:
        symbol: Company symbol (e.g., 'AAPL', 'MSFT')
        limit: Maximum number of articles
    
    Returns:
        List of company news articles
    """
    if not API_KEY:
        raise ValueError("FINNHUB_API_KEY environment variable is not set")
    
    url = f"https://finnhub.io/api/v1/company-news"
    params = {
        "symbol": symbol,
        "from": (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d"),
        "to": datetime.now().strftime("%Y-%m-%d"),
        "token": API_KEY
    }
    
    try:
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        articles = response.json()
        
        return articles[:limit] if isinstance(articles, list) else []
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching company news: {e}")
        return []

def fetch_market_sentiment() -> Dict:
    """
    Fetch market sentiment data
    
    Returns:
        Market sentiment information
    """
    if not API_KEY:
        raise ValueError("FINNHUB_API_KEY environment variable is not set")
    
    url = "https://finnhub.io/api/v1/news-sentiment"
    params = {
        "symbol": "AAPL",  # Default to Apple, can be made configurable
        "token": API_KEY
    }
    
    try:
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        return response.json()
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching market sentiment: {e}")
        return {}

if __name__ == "__main__":
    # Test the functions
    print("Testing news fetch...")
    articles = fetch_market_news()
    print(f"Fetched {len(articles)} articles")
    if articles:
        print("Sample article:")
        print(json.dumps(articles[0], indent=2))
