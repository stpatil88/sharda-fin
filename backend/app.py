# app.py (FastAPI)
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import csv
from typing import List, Dict
import os
from datetime import datetime
# News is served from local CSV; external APIs temporarily disabled
from cache_manager import cached, CACHE_TTL

# Load environment variables
load_dotenv()

# Initialize data files on startup
try:
    from init_data import init_data_files
    init_data_files()
except Exception as e:
    print(f"Warning: Could not initialize data files: {e}")

app = FastAPI(
    title="Sharada Financial Services API",
    description="Backend API for Sharada Financial Services - Market data, news, and AI summarization",
    version="1.0.0"
)

# CORS middleware - Enhanced configuration
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:3000")
# Support wildcard for development (use with caution in production)
if cors_origins_str == "*":
    cors_origins = ["*"]
else:
    # Split and clean up origins (remove whitespace)
    cors_origins = [origin.strip() for origin in cors_origins_str.split(",") if origin.strip()]

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

@app.get("/market-news")
@cached(ttl=CACHE_TTL["NEWS"])
def market_news(limit: int = 20):
    # Alias to CSV-backed news
    return marathi_news(limit)

# Marathi/English combined news from CSV (local scrape)
@app.get("/marathi-news")
@cached(ttl=CACHE_TTL["NEWS"])
def marathi_news(limit: int = 20):
    try:
        csv_path = os.path.join(os.path.dirname(__file__), "financial_news_marathi_api.csv")
        print(csv_path)
        articles: List[Dict] = []
        with open(csv_path, mode="r", encoding="utf-8", newline="") as f:
            reader = csv.DictReader(f)
            # Normalize header names to handle BOM and whitespace
            if reader.fieldnames:
                reader.fieldnames = [
                    (name or "").lstrip("\ufeff").strip() for name in reader.fieldnames
                ]
            for row in reader:
                # Normalize per-row keys in case of BOM
                if "\ufeffSource" in row and "Source" not in row:
                    row["Source"] = row.get("\ufeffSource")
                # Validate essential fields and skip malformed rows
                source = (row.get("Source") or "").strip()
                en_title = (row.get("English Title") or "").strip()
                mr_title = (row.get("Marathi Title") or "").strip()
                url = (row.get("URL") or "").strip()
                if not (source and (en_title or mr_title) and url):
                    continue
                articles.append({
                    "source": source,
                    "english_title": en_title,
                    "marathi_title": mr_title,
                    "url": url
                })
        articles = articles[:limit]
        return {"count": len(articles), "articles": articles}
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="financial_news_marathi_api.csv not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading Marathi news: {str(e)}")

    

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")


def _read_json_file(filename: str):
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        # Try to initialize data files if missing
        try:
            from init_data import init_data_files
            init_data_files()
            # Try to read again after initialization
            if os.path.exists(path):
                with open(path, "r", encoding="utf-8") as f:
                    return json.load(f)
        except Exception:
            pass
        # If still missing, return default empty structure
        from init_data import DEFAULT_DATA
        return DEFAULT_DATA.get(filename, {"status": "unavailable", "reason": "Data file not found"})
    try:
        import json
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading {filename}: {str(e)}")


# File-backed endpoints (Top gainers/losers, PCR, Index quotes)
def _extract_stock_name(trading_symbol: str) -> str:
    """Extract clean stock name from trading symbol like 'ADANIGREEN25NOV25FUT'"""
    if not trading_symbol:
        return "N/A"
    
    import re
    # Pattern examples: ADANIGREEN25NOV25FUT, VBL25NOV25FUT, SAIL25NOV25FUT
    # Strategy: Remove date pattern (digits + 3 letters + digits) + FUT
    
    # First remove the date pattern with FUT: 25NOV25FUT
    cleaned = re.sub(r'\d{2}[A-Z]{3}\d{2}FUT$', '', trading_symbol)
    
    # If that didn't work, try removing just FUT suffix
    if cleaned == trading_symbol:
        cleaned = re.sub(r'FUT$', '', trading_symbol)
    
    # Remove any trailing numbers that might remain
    cleaned = re.sub(r'\d+$', '', cleaned)
    
    # Clean up and return
    result = cleaned.strip()
    
    # Debug: print if extraction seems wrong
    if not result or len(result) < 2:
        print(f"Warning: Symbol extraction for '{trading_symbol}' resulted in '{result}', using original")
        return trading_symbol[:20]  # Return first 20 chars of original as fallback
    
    return result


@app.get("/top-gainers")
@cached(ttl=CACHE_TTL["MARKET_DATA"])
def api_top_gainers(exchange: str = "NSE"):
    try:
        data = _read_json_file("top_gainers.json")
        # Transform data for frontend compatibility
        if isinstance(data, dict):
            gainers = data.get("gainers", [])
            transformed = {
                "count": len(gainers),
                "gainers": [
                    {
                        "symbol": _extract_stock_name(item.get("tradingSymbol", "")),
                        "price": float(item.get("ltp", 0)),
                        "change": float(item.get("netChange", 0)),
                        "changePercent": float(item.get("percentChange", 0)),
                        "symbolToken": item.get("symbolToken")
                    }
                    for item in gainers[:10]  # Limit to top 10
                ],
                "exchange": data.get("exchange", exchange),
                "timestamp": datetime.now().isoformat()
            }
            return transformed
        return data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing top gainers: {str(e)}")


@app.get("/top-losers")
@cached(ttl=CACHE_TTL["MARKET_DATA"])
def api_top_losers(exchange: str = "NSE"):
    try:
        data = _read_json_file("top_losers.json")
        # Handle error case and empty data
        if isinstance(data, dict) and data.get("error"):
            return {
                "count": 0, 
                "losers": [], 
                "exchange": exchange, 
                "error": data.get("error"),
                "timestamp": datetime.now().isoformat()
            }
        
        losers = data.get("losers", [])
        if not losers or len(losers) == 0:
            return {
                "count": 0, 
                "losers": [], 
                "exchange": exchange,
                "timestamp": datetime.now().isoformat()
            }
        
        transformed = {
            "count": len(losers),
            "losers": [
                {
                    "symbol": _extract_stock_name(item.get("tradingSymbol", "")),
                    "price": float(item.get("ltp", 0)),
                    "change": float(item.get("netChange", 0)),
                    "changePercent": float(item.get("percentChange", 0)),
                    "symbolToken": item.get("symbolToken")
                }
                for item in losers[:10]  # Limit to top 10
            ],
            "exchange": data.get("exchange", exchange),
            "timestamp": datetime.now().isoformat()
        }
        return transformed
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing top losers: {str(e)}")


@app.get("/putcallratio")
@cached(ttl=CACHE_TTL["MARKET_DATA"])
def api_put_call_ratio(exchange: str = "NSE", limit: int = 100):
    try:
        data = _read_json_file("put_call_ratio.json")
        if isinstance(data, dict) and data.get("status") == "ok":
            pcr_data = data.get("data", [])
            # Transform data with extracted symbols and sort by PCR
            transformed = [
                {
                    "symbol": _extract_stock_name(item.get("tradingSymbol", "")),
                    "pcr": float(item.get("pcr", 0)),
                    "tradingSymbol": item.get("tradingSymbol", "")
                }
                for item in pcr_data
            ]
            # Sort by PCR descending (highest first)
            transformed.sort(key=lambda x: x["pcr"], reverse=True)
            
            return {
                "status": "ok",
                "exchange": data.get("exchange", exchange),
                "data": transformed[:limit],  # Return top N symbols
                "total_symbols": len(pcr_data),
                "avg_pcr": sum(item["pcr"] for item in transformed) / len(transformed) if transformed else 0,
                "max_pcr": transformed[0]["pcr"] if transformed else 0,
                "min_pcr": transformed[-1]["pcr"] if transformed else 0,
                "timestamp": datetime.now().isoformat()
            }
        return data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing put/call ratio: {str(e)}")


@app.get("/index-quotes")
@cached(ttl=CACHE_TTL["MARKET_DATA"])
def api_all_index_quotes():
    """Get all index quotes at once"""
    try:
        data = _read_json_file("index_quotes.json")
        quotes = {}
        for key, quote in data.items():
            if quote.get("status") == "ok":
                quotes[key] = {
                    "status": "ok",
                    "symbol": quote.get("symbol", key),
                    "exchange": quote.get("exchange", "NSE"),
                    "price": quote.get("price", 0),
                    "open": quote.get("open", 0),
                    "high": quote.get("high", 0),
                    "low": quote.get("low", 0),
                    "close": quote.get("close", 0),
                    "change": round(quote.get("price", 0) - quote.get("close", 0), 2),
                    "changePercent": round(((quote.get("price", 0) - quote.get("close", 0)) / quote.get("close", 1)) * 100, 2) if quote.get("close", 0) != 0 else 0
                }
            else:
                quotes[key] = quote
        return quotes
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing index quotes: {str(e)}")


@app.get("/index-quote/{index}")
@cached(ttl=CACHE_TTL["MARKET_DATA"])
def api_index_quote(index: str):
    try:
        data = _read_json_file("index_quotes.json")
        key = index.upper()
        if isinstance(data, dict) and key in data:
            quote = data[key]
            if quote.get("status") == "ok":
                return {
                    "status": "ok",
                    "symbol": quote.get("symbol", key),
                    "exchange": quote.get("exchange", "NSE"),
                    "price": quote.get("price", 0),
                    "open": quote.get("open", 0),
                    "high": quote.get("high", 0),
                    "low": quote.get("low", 0),
                    "close": quote.get("close", 0),
                    "change": round(quote.get("price", 0) - quote.get("close", 0), 2),
                    "changePercent": round(((quote.get("price", 0) - quote.get("close", 0)) / quote.get("close", 1)) * 100, 2) if quote.get("close", 0) != 0 else 0
                }
            return quote
        raise HTTPException(status_code=404, detail=f"Index quote not found: {key}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing index quote: {str(e)}")


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