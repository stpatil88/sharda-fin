# market_data.py
"""
Enhanced market data module with Nifty, Sensex, Gold, and Futures
"""

import os
import requests
import json
from datetime import datetime, timedelta
from typing import List, Dict, Optional
# from angel_one_api import angel_api

def get_nifty_news(limit: int = 10) -> List[Dict]:
    """
    Get news related to Nifty 50
    
    Args:
        limit: Maximum number of articles
        
    Returns:
        List of Nifty-related news articles
    """
    try:
        # Search for Nifty-related news
        search_terms = ["Nifty 50", "NIFTY", "NSE", "Indian stock market"]
        articles = []
        
        for term in search_terms:
            # Use Finnhub API for news search
            api_key = os.getenv("FINNHUB_API_KEY")
            if api_key:
                url = "https://finnhub.io/api/v1/news"
                params = {
                    "category": "general",
                    "token": api_key
                }
                
                response = requests.get(url, params=params, timeout=30)
                if response.status_code == 200:
                    news_data = response.json()
                    
                    # Filter for Nifty-related news
                    for article in news_data:
                        if any(term.lower() in article.get("headline", "").lower() 
                               or term.lower() in article.get("summary", "").lower() 
                               for term in search_terms):
                            articles.append({
                                "id": article.get("id"),
                                "headline": article.get("headline"),
                                "summary": article.get("summary"),
                                "source": article.get("source"),
                                "url": article.get("url"),
                                "datetime": article.get("datetime"),
                                "category": "Nifty",
                                "related_symbols": ["NIFTY"]
                            })
        
        return articles[:limit]
        
    except Exception as e:
        print(f"Error fetching Nifty news: {e}")
        return []

def get_sensex_news(limit: int = 10) -> List[Dict]:
    """
    Get news related to Sensex
    
    Args:
        limit: Maximum number of articles
        
    Returns:
        List of Sensex-related news articles
    """
    try:
        search_terms = ["Sensex", "SENSEX", "BSE", "Bombay Stock Exchange"]
        articles = []
        
        for term in search_terms:
            api_key = os.getenv("FINNHUB_API_KEY")
            if api_key:
                url = "https://finnhub.io/api/v1/news"
                params = {
                    "category": "general",
                    "token": api_key
                }
                
                response = requests.get(url, params=params, timeout=30)
                if response.status_code == 200:
                    news_data = response.json()
                    
                    for article in news_data:
                        if any(term.lower() in article.get("headline", "").lower() 
                               or term.lower() in article.get("summary", "").lower() 
                               for term in search_terms):
                            articles.append({
                                "id": article.get("id"),
                                "headline": article.get("headline"),
                                "summary": article.get("summary"),
                                "source": article.get("source"),
                                "url": article.get("url"),
                                "datetime": article.get("datetime"),
                                "category": "Sensex",
                                "related_symbols": ["SENSEX"]
                            })
        
        return articles[:limit]
        
    except Exception as e:
        print(f"Error fetching Sensex news: {e}")
        return []

def get_gold_news(limit: int = 10) -> List[Dict]:
    """
    Get news related to Gold market
    
    Args:
        limit: Maximum number of articles
        
    Returns:
        List of Gold-related news articles
    """
    try:
        search_terms = ["Gold", "GOLD", "MCX Gold", "Gold futures", "precious metals"]
        articles = []
        
        for term in search_terms:
            api_key = os.getenv("FINNHUB_API_KEY")
            if api_key:
                url = "https://finnhub.io/api/v1/news"
                params = {
                    "category": "general",
                    "token": api_key
                }
                
                response = requests.get(url, params=params, timeout=30)
                if response.status_code == 200:
                    news_data = response.json()
                    
                    for article in news_data:
                        if any(term.lower() in article.get("headline", "").lower() 
                               or term.lower() in article.get("summary", "").lower() 
                               for term in search_terms):
                            articles.append({
                                "id": article.get("id"),
                                "headline": article.get("headline"),
                                "summary": article.get("summary"),
                                "source": article.get("source"),
                                "url": article.get("url"),
                                "datetime": article.get("datetime"),
                                "category": "Gold",
                                "related_symbols": ["GOLD"]
                            })
        
        return articles[:limit]
        
    except Exception as e:
        print(f"Error fetching Gold news: {e}")
        return []

def get_futures_news(limit: int = 10) -> List[Dict]:
    """
    Get news related to Futures market
    
    Args:
        limit: Maximum number of articles
        
    Returns:
        List of Futures-related news articles
    """
    try:
        search_terms = ["Futures", "Derivatives", "Options", "MCX", "NSE Futures"]
        articles = []
        
        for term in search_terms:
            api_key = os.getenv("FINNHUB_API_KEY")
            if api_key:
                url = "https://finnhub.io/api/v1/news"
                params = {
                    "category": "general",
                    "token": api_key
                }
                
                response = requests.get(url, params=params, timeout=30)
                if response.status_code == 200:
                    news_data = response.json()
                    
                    for article in news_data:
                        if any(term.lower() in article.get("headline", "").lower() 
                               or term.lower() in article.get("summary", "").lower() 
                               for term in search_terms):
                            articles.append({
                                "id": article.get("id"),
                                "headline": article.get("headline"),
                                "summary": article.get("summary"),
                                "source": article.get("source"),
                                "url": article.get("url"),
                                "datetime": article.get("datetime"),
                                "category": "Futures",
                                "related_symbols": ["FUTURES"]
                            })
        
        return articles[:limit]
        
    except Exception as e:
        print(f"Error fetching Futures news: {e}")
        return []

def get_market_overview() -> Dict:
    """
    Get comprehensive market overview
    
    Returns:
        Dictionary with market data for all major indices and commodities
    """
    try:
        overview = {
            "timestamp": datetime.now().isoformat(),
            "indices": {
                "nifty": angel_api.get_nifty_data(),
                "sensex": angel_api.get_sensex_data()
            },
            "commodities": {
                "gold": angel_api.get_gold_data()
            },
            "futures": {
                "nifty_futures": angel_api.get_futures_data("NIFTY")
            },
            "top_gainers": angel_api.get_top_gainers(),
            "top_losers": angel_api.get_top_losers()
        }
        
        return overview
        
    except Exception as e:
        print(f"Error fetching market overview: {e}")
        return {
            "timestamp": datetime.now().isoformat(),
            "error": str(e)
        }

def get_company_news(symbol: str, limit: int = 20) -> List[Dict]:
    """
    Get news for a specific company
    
    Args:
        symbol: Company symbol (e.g., 'RELIANCE', 'TCS')
        limit: Maximum number of articles
        
    Returns:
        List of company news articles
    """
    try:
        api_key = os.getenv("FINNHUB_API_KEY")
        if not api_key:
            return []
        
        url = "https://finnhub.io/api/v1/company-news"
        params = {
            "symbol": symbol,
            "from": (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d"),
            "to": datetime.now().strftime("%Y-%m-%d"),
            "token": api_key
        }
        
        response = requests.get(url, params=params, timeout=30)
        if response.status_code == 200:
            articles = response.json()
            
            formatted_articles = []
            for article in articles[:limit]:
                formatted_articles.append({
                    "id": article.get("id"),
                    "headline": article.get("headline"),
                    "summary": article.get("summary"),
                    "source": article.get("source"),
                    "url": article.get("url"),
                    "datetime": article.get("datetime"),
                    "category": "Company News",
                    "related_symbols": [symbol]
                })
            
            return formatted_articles
        
        return []
        
    except Exception as e:
        print(f"Error fetching company news for {symbol}: {e}")
        return []

if __name__ == "__main__":
    # Test the functions
    print("Testing market data functions...")
    
    print("\nNifty News:")
    nifty_news = get_nifty_news(3)
    for article in nifty_news:
        print(f"- {article.get('headline', 'No headline')}")
    
    print("\nMarket Overview:")
    overview = get_market_overview()
    print(f"Nifty: {overview.get('indices', {}).get('nifty', {}).get('price', 'N/A')}")
    print(f"Sensex: {overview.get('indices', {}).get('sensex', {}).get('price', 'N/A')}")
    print(f"Gold: {overview.get('commodities', {}).get('gold', {}).get('price', 'N/A')}")
