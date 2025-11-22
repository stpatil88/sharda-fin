"""
Fetch NSE data (Block Deals, Bulk Deals, FII/DII, Past Results) and save to JSON files
This script can be run periodically via scheduler
"""

import os
import json
from datetime import datetime, timedelta
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

def ensure_data_dir():
    """Ensure data directory exists"""
    Path(DATA_DIR).mkdir(parents=True, exist_ok=True)

def fetch_block_deals(from_date=None, to_date=None):
    """Fetch block deals from NSE"""
    filepath = os.path.join(DATA_DIR, "block_deals.json")
    
    try:
        # Try to import - catch syntax errors in the library
        try:
            from nsepython import nse_largedeals_historical
        except (ImportError, SyntaxError) as e:
            logging.error(f"❌ Error importing nsepython library: {str(e)}")
            logging.error("💡 This might be a library issue. Check if nsepython is properly installed.")
            # Preserve existing data if available
            if os.path.exists(filepath):
                logging.info("📦 Preserving existing block_deals.json data")
                with open(filepath, 'r', encoding='utf-8') as f:
                    existing = json.load(f)
                    existing["status"] = "error"
                    existing["error"] = f"Library import failed: {str(e)}"
                    existing["timestamp"] = datetime.now().isoformat()
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(existing, f, ensure_ascii=False, indent=2)
            return None
        
        if not to_date:
            to_date = datetime.now().strftime("%d-%m-%Y")
        if not from_date:
            from_date = (datetime.now() - timedelta(days=7)).strftime("%d-%m-%Y")
        
        logging.info(f"Fetching block deals from {from_date} to {to_date}")
        data = nse_largedeals_historical(from_date, to_date, "block_deals")
        
        result = {
            "status": "success",
            "from_date": from_date,
            "to_date": to_date,
            "count": len(data) if isinstance(data, list) else 0,
            "data": data if isinstance(data, list) else [],
            "timestamp": datetime.now().isoformat()
        }
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        logging.info(f"✅ Saved {result['count']} block deals to block_deals.json")
        return result
    except SyntaxError as e:
        logging.error(f"❌ Syntax error in nsepython library: {str(e)}")
        logging.error("💡 This is a bug in the nsepython library. Try updating it: pip install --upgrade nsepython")
        # Preserve existing data
        if os.path.exists(filepath):
            logging.info("📦 Preserving existing block_deals.json data")
            with open(filepath, 'r', encoding='utf-8') as f:
                existing = json.load(f)
                existing["status"] = "error"
                existing["error"] = f"Library syntax error: {str(e)}"
                existing["timestamp"] = datetime.now().isoformat()
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(existing, f, ensure_ascii=False, indent=2)
        return None
    except Exception as e:
        logging.error(f"❌ Error fetching block deals: {str(e)}")
        # Preserve existing data on other errors too
        if os.path.exists(filepath):
            logging.info("📦 Preserving existing block_deals.json data")
        return None

def fetch_bulk_deals(from_date=None, to_date=None):
    """Fetch bulk deals from NSE"""
    filepath = os.path.join(DATA_DIR, "bulk_deals.json")
    
    try:
        # Try to import - catch syntax errors in the library
        try:
            from nsepython import nse_largedeals_historical
        except (ImportError, SyntaxError) as e:
            logging.error(f"❌ Error importing nsepython library: {str(e)}")
            logging.error("💡 This might be a library issue. Check if nsepython is properly installed.")
            # Preserve existing data if available
            if os.path.exists(filepath):
                logging.info("📦 Preserving existing bulk_deals.json data")
                with open(filepath, 'r', encoding='utf-8') as f:
                    existing = json.load(f)
                    existing["status"] = "error"
                    existing["error"] = f"Library import failed: {str(e)}"
                    existing["timestamp"] = datetime.now().isoformat()
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(existing, f, ensure_ascii=False, indent=2)
            return None
        
        if not to_date:
            to_date = datetime.now().strftime("%d-%m-%Y")
        if not from_date:
            from_date = (datetime.now() - timedelta(days=7)).strftime("%d-%m-%Y")
        
        logging.info(f"Fetching bulk deals from {from_date} to {to_date}")
        data = nse_largedeals_historical(from_date, to_date, "bulk_deals")
        
        result = {
            "status": "success",
            "from_date": from_date,
            "to_date": to_date,
            "count": len(data) if isinstance(data, list) else 0,
            "data": data if isinstance(data, list) else [],
            "timestamp": datetime.now().isoformat()
        }
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        logging.info(f"✅ Saved {result['count']} bulk deals to bulk_deals.json")
        return result
    except SyntaxError as e:
        logging.error(f"❌ Syntax error in nsepython library: {str(e)}")
        logging.error("💡 This is a bug in the nsepython library. Try updating it: pip install --upgrade nsepython")
        # Preserve existing data
        if os.path.exists(filepath):
            logging.info("📦 Preserving existing bulk_deals.json data")
            with open(filepath, 'r', encoding='utf-8') as f:
                existing = json.load(f)
                existing["status"] = "error"
                existing["error"] = f"Library syntax error: {str(e)}"
                existing["timestamp"] = datetime.now().isoformat()
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(existing, f, ensure_ascii=False, indent=2)
        return None
    except Exception as e:
        logging.error(f"❌ Error fetching bulk deals: {str(e)}")
        # Preserve existing data on other errors too
        if os.path.exists(filepath):
            logging.info("📦 Preserving existing bulk_deals.json data")
        return None

def fetch_fii_dii():
    """Fetch FII/DII trading activity data"""
    filepath = os.path.join(DATA_DIR, "fii_dii.json")
    
    try:
        # Try to import - catch syntax errors in the library
        # Try multiple possible function names
        fii_dii_func = None
        possible_names = [
            'nse_fiidii'
        ]
        
        try:
            import nsepython
            # Try each possible function name
            for name in possible_names:
                if hasattr(nsepython, name):
                    fii_dii_func = getattr(nsepython, name)
                    logging.info(f"✅ Found FII/DII function: {name}")
                    break
            
            if fii_dii_func is None:
                # List available functions for debugging
                available = [x for x in dir(nsepython) if not x.startswith('_')]
                logging.warning(f"⚠️ FII/DII function not found. Available functions: {available[:20]}...")
                raise ImportError(f"FII/DII function not found. Tried: {possible_names}")
                
        except (ImportError, SyntaxError) as e:
            logging.error(f"❌ Error importing nsepython library: {str(e)}")
            logging.error("💡 This might be a library issue. Check if nsepython is properly installed.")
            # Preserve existing data if available
            if os.path.exists(filepath):
                logging.info("📦 Preserving existing fii_dii.json data")
                with open(filepath, 'r', encoding='utf-8') as f:
                    existing = json.load(f)
                    existing["status"] = "error"
                    existing["error"] = f"Library import failed: {str(e)}"
                    existing["timestamp"] = datetime.now().isoformat()
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(existing, f, ensure_ascii=False, indent=2)
            return None
        
        logging.info("Fetching FII/DII data")
        data = fii_dii_func()
        
        # Convert to dict if it's a DataFrame
        if hasattr(data, 'to_dict'):
            data = data.to_dict('records')
        
        # Transform data structure to match frontend expectations
        # Input format: [{"category": "FII/FPI *", "buyValue": "...", "sellValue": "...", ...}, ...]
        # Output format: {"fii": {"buy": ..., "sell": ..., "net": ...}, "dii": {...}}
        transformed_data = {"fii": {}, "dii": {}}
        
        if isinstance(data, list):
            for item in data:
                category = item.get("category", "").upper()
                buy_value = item.get("buyValue", item.get("buy", "0"))
                sell_value = item.get("sellValue", item.get("sell", "0"))
                net_value = item.get("netValue", item.get("net", "0"))
                
                # Convert string values to numbers
                try:
                    buy = float(str(buy_value).replace(",", "")) if buy_value else 0
                    sell = float(str(sell_value).replace(",", "")) if sell_value else 0
                    net = float(str(net_value).replace(",", "")) if net_value else 0
                except (ValueError, TypeError):
                    buy = sell = net = 0
                
                # Categorize as FII or DII
                if "FII" in category or "FPI" in category:
                    transformed_data["fii"] = {
                        "buy": buy,
                        "sell": sell,
                        "net": net,
                        "date": item.get("date", ""),
                        "category": item.get("category", "")
                    }
                elif "DII" in category:
                    transformed_data["dii"] = {
                        "buy": buy,
                        "sell": sell,
                        "net": net,
                        "date": item.get("date", ""),
                        "category": item.get("category", "")
                    }
        elif isinstance(data, dict):
            # If already in dict format, use it directly but ensure structure
            transformed_data = data
        
        result = {
            "status": "success",
            "data": transformed_data,
            "raw_data": data if isinstance(data, list) else [],  # Keep raw for debugging
            "timestamp": datetime.now().isoformat()
        }
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        logging.info("✅ Saved FII/DII data to fii_dii.json")
        return result
    except SyntaxError as e:
        logging.error(f"❌ Syntax error in nsepython library: {str(e)}")
        logging.error("💡 This is a bug in the nsepython library. Try updating it: pip install --upgrade nsepython")
        # Preserve existing data
        if os.path.exists(filepath):
            logging.info("📦 Preserving existing fii_dii.json data")
            with open(filepath, 'r', encoding='utf-8') as f:
                existing = json.load(f)
                existing["status"] = "error"
                existing["error"] = f"Library syntax error: {str(e)}"
                existing["timestamp"] = datetime.now().isoformat()
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(existing, f, ensure_ascii=False, indent=2)
        return None
    except Exception as e:
        logging.error(f"❌ Error fetching FII/DII data: {str(e)}")
        # Preserve existing data on other errors too
        if os.path.exists(filepath):
            logging.info("📦 Preserving existing fii_dii.json data")
        return None

def fetch_past_results(symbols=None):
    """Fetch past results for given symbols (or popular ones if not provided)"""
    if symbols is None:
        # Default to popular stocks
        symbols = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 
                   'HINDUNILVR', 'BHARTIARTL', 'SBIN', 'BAJFINANCE', 'KOTAKBANK']
    
    filepath = os.path.join(DATA_DIR, "past_results.json")
    
    try:
        # Try to import - catch syntax errors in the library
        try:
            from nsepython import nse_past_results
        except (ImportError, SyntaxError) as e:
            logging.error(f"❌ Error importing nsepython library: {str(e)}")
            logging.error("💡 This might be a library issue. Check if nsepython is properly installed.")
            # Preserve existing data if available
            if os.path.exists(filepath):
                logging.info("📦 Preserving existing past_results.json data")
                with open(filepath, 'r', encoding='utf-8') as f:
                    existing = json.load(f)
                    # Add error status to all symbols
                    for symbol in symbols:
                        if symbol.upper() not in existing:
                            existing[symbol.upper()] = {
                                "status": "error",
                                "symbol": symbol.upper(),
                                "error": f"Library import failed: {str(e)}",
                                "timestamp": datetime.now().isoformat()
                            }
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(existing, f, ensure_ascii=False, indent=2)
            return None
        
        results = {}
        for symbol in symbols:
            try:
                logging.info(f"Fetching past results for {symbol}")
                data = nse_past_results(symbol.upper())
                
                if data:
                    results[symbol.upper()] = {
                        "status": "success",
                        "symbol": symbol.upper(),
                        "data": data,
                        "timestamp": datetime.now().isoformat()
                    }
                    logging.info(f"✅ Fetched past results for {symbol}")
                else:
                    results[symbol.upper()] = {
                        "status": "no_data",
                        "symbol": symbol.upper(),
                        "data": {},
                        "timestamp": datetime.now().isoformat()
                    }
                    logging.warning(f"⚠️ No data found for {symbol}")
            except Exception as e:
                logging.error(f"❌ Error fetching past results for {symbol}: {str(e)}")
                results[symbol.upper()] = {
                    "status": "error",
                    "symbol": symbol.upper(),
                    "error": str(e),
                    "timestamp": datetime.now().isoformat()
                }
        
        # Save all results
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        
        logging.info(f"✅ Saved past results for {len(results)} symbols to past_results.json")
        return results
    except SyntaxError as e:
        logging.error(f"❌ Syntax error in nsepython library: {str(e)}")
        logging.error("💡 This is a bug in the nsepython library. Try updating it: pip install --upgrade nsepython")
        # Preserve existing data
        if os.path.exists(filepath):
            logging.info("📦 Preserving existing past_results.json data")
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    existing = json.load(f)
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(existing, f, ensure_ascii=False, indent=2)
            except:
                pass
        return None
    except Exception as e:
        logging.error(f"❌ Error fetching past results: {str(e)}")
        # Preserve existing data on other errors too
        if os.path.exists(filepath):
            logging.info("📦 Preserving existing past_results.json data")
        return None

def main():
    """Main function to fetch all NSE data"""
    ensure_data_dir()
    
    logging.info("🚀 Starting NSE data fetch...")
    
    # Fetch block deals (last 7 days)
    fetch_block_deals()
    
    # Fetch bulk deals (last 7 days)
    fetch_bulk_deals()
    
    # Fetch FII/DII data
    fetch_fii_dii()
    
    # Fetch past results for popular stocks
    fetch_past_results()
    
    logging.info("✅ NSE data fetch complete!")

if __name__ == "__main__":
    import sys
    
    # Allow command line arguments for date ranges
    from_date = None
    to_date = None
    symbols = None
    
    if len(sys.argv) > 1:
        if '--from-date' in sys.argv:
            idx = sys.argv.index('--from-date')
            if idx + 1 < len(sys.argv):
                from_date = sys.argv[idx + 1]
        
        if '--to-date' in sys.argv:
            idx = sys.argv.index('--to-date')
            if idx + 1 < len(sys.argv):
                to_date = sys.argv[idx + 1]
        
        if '--symbols' in sys.argv:
            idx = sys.argv.index('--symbols')
            if idx + 1 < len(sys.argv):
                symbols = sys.argv[idx + 1].split(',')
    
    # If specific dates provided, use them
    if from_date or to_date:
        fetch_block_deals(from_date, to_date)
        fetch_bulk_deals(from_date, to_date)
    else:
        main()
    
    if symbols:
        fetch_past_results(symbols)

