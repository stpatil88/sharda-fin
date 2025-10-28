# app.py (FastAPI)
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from fetch_news import fetch_market_news, fetch_company_news, fetch_market_sentiment
from hf_summarise import summarize, batch_summarize
from market_data import (
    get_nifty_news, get_sensex_news, get_gold_news, get_futures_news,
    get_market_overview, get_company_news
)
from angel_one_api import angel_api
from cache_manager import cached, CACHE_TTL

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Sharada Financial Services API",
    description="Backend API for Sharada Financial Services - Market data, news, and AI summarization",
    version="1.0.0"
)

# CORS middleware - Enhanced configuration
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
# Clean up origins (remove whitespace)
cors_origins = [origin.strip() for origin in cors_origins]

print(f"🔧 CORS Origins configured: {cors_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],   # Allow all headers
    expose_headers=["*"],  # Expose all headers
)

@app.get("/")
def root():
    return {
        "message": "Sharada Financial Services API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Sharada Financial API"}

@app.get("/latest-summaries")
def latest_summaries(limit: int = 10):
    try:
        articles = fetch_market_news()[:limit]
        results = []
        for a in articles:
            text = a.get("summary") or a.get("content") or a.get("description", "")
            if text:
                s = summarize(text)
                results.append({
                    "headline": a.get("headline") or a.get("title"),
                    "summary": s,
                    "source": a.get("source"),
                    "url": a.get("url"),
                    "published_at": a.get("datetime")
                })
        return {"count": len(results), "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching news: {str(e)}")

@app.get("/market-news")
@cached(ttl=CACHE_TTL["NEWS"])
def market_news(limit: int = 20):
    try:
        articles = fetch_market_news()[:limit]
        return {"count": len(articles), "articles": articles}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching market news: {str(e)}")

# New endpoints for specific market segments
@app.get("/nifty-news")
@cached(ttl=CACHE_TTL["NEWS"])
def nifty_news(limit: int = 10):
    try:
        articles = get_nifty_news(limit)
        return {"count": len(articles), "articles": articles, "category": "Nifty"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching Nifty news: {str(e)}")

@app.get("/sensex-news")
@cached(ttl=CACHE_TTL["NEWS"])
def sensex_news(limit: int = 10):
    try:
        articles = get_sensex_news(limit)
        return {"count": len(articles), "articles": articles, "category": "Sensex"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching Sensex news: {str(e)}")

@app.get("/gold-news")
@cached(ttl=CACHE_TTL["NEWS"])
def gold_news(limit: int = 10):
    try:
        articles = get_gold_news(limit)
        return {"count": len(articles), "articles": articles, "category": "Gold"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching Gold news: {str(e)}")

@app.get("/futures-news")
@cached(ttl=CACHE_TTL["NEWS"])
def futures_news(limit: int = 10):
    try:
        articles = get_futures_news(limit)
        return {"count": len(articles), "articles": articles, "category": "Futures"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching Futures news: {str(e)}")

# Company-specific news endpoint
@app.get("/company-news/{symbol}")
@cached(ttl=CACHE_TTL["COMPANY_NEWS"])
def company_news(symbol: str, limit: int = 20):
    try:
        articles = get_company_news(symbol.upper(), limit)
        return {"count": len(articles), "articles": articles, "symbol": symbol.upper()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching company news: {str(e)}")

# Market sentiment endpoint
@app.get("/market-sentiment")
@cached(ttl=CACHE_TTL["MARKET_DATA"])
def market_sentiment():
    try:
        sentiment_data = fetch_market_sentiment()
        return {"sentiment": sentiment_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching market sentiment: {str(e)}")

# Market overview endpoint
@app.get("/market-overview")
@cached(ttl=CACHE_TTL["OVERVIEW"])
def market_overview():
    try:
        overview = get_market_overview()
        return overview
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching market overview: {str(e)}")

# Angel One API endpoints
@app.get("/top-gainers")
@cached(ttl=CACHE_TTL["MARKET_DATA"])
def top_gainers(exchange: str = "NSE"):
    try:
        gainers = angel_api.get_top_gainers(exchange)
        return {"count": len(gainers), "gainers": gainers, "exchange": exchange}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching top gainers: {str(e)}")

@app.get("/top-losers")
@cached(ttl=CACHE_TTL["MARKET_DATA"])
def top_losers(exchange: str = "NSE"):
    try:
        losers = angel_api.get_top_losers(exchange)
        return {"count": len(losers), "losers": losers, "exchange": exchange}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching top losers: {str(e)}")

@app.get("/nifty-data")
@cached(ttl=CACHE_TTL["MARKET_DATA"])
def nifty_data():
    try:
        nifty_data = angel_api.get_nifty_data()
        return nifty_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching Nifty data: {str(e)}")

@app.get("/sensex-data")
@cached(ttl=CACHE_TTL["MARKET_DATA"])
def sensex_data():
    try:
        sensex_data = angel_api.get_sensex_data()
        return sensex_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching Sensex data: {str(e)}")

@app.get("/gold-data")
@cached(ttl=CACHE_TTL["MARKET_DATA"])
def gold_data():
    try:
        gold_data = angel_api.get_gold_data()
        return gold_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching Gold data: {str(e)}")

@app.get("/futures-data/{symbol}")
@cached(ttl=CACHE_TTL["MARKET_DATA"])
def futures_data(symbol: str):
    try:
        futures_data = angel_api.get_futures_data(symbol.upper())
        return futures_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching futures data: {str(e)}")

# Batch summarization endpoint
@app.post("/batch-summarize")
def batch_summarize_endpoint(texts: list, max_length: int = 120):
    try:
        if len(texts) > 50:  # Limit batch size
            raise HTTPException(status_code=400, detail="Maximum 50 texts allowed per batch")
        
        summaries = batch_summarize(texts, max_length)
        return {"count": len(summaries), "summaries": summaries}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in batch summarization: {str(e)}")

# Cache management endpoints
@app.post("/cache/clear")
def clear_cache():
    try:
        from cache_manager import cache_invalidate
        cache_invalidate()
        return {"message": "Cache cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing cache: {str(e)}")

@app.get("/cache/stats")
def cache_stats():
    try:
        from cache_manager import cache
        return {
            "size": cache.size(),
            "default_ttl": cache.default_ttl
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting cache stats: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("DEBUG", "True").lower() == "true"
    )     