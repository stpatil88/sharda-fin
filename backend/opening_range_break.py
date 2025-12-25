"""
Opening Range Breakout (ORB) Detection Script

This script detects opening range breakouts at 9:20 AM IST.
The opening range is defined as the high and low of the first 5 minutes (9:15-9:20 AM).
A breakout is detected when the current price breaks above the opening range high (BUY)
or below the opening range low (SELL).

Scheduled to run at 9:20 AM IST, Monday-Friday.
"""

import datetime
import json
import os
import logging
import warnings
from typing import Dict, List, Optional, Any

import pandas as pd
import pytz

warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('opening_breakout.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, "data")

# IST timezone
IST = pytz.timezone('Asia/Kolkata')

# Default stock list - Nifty 50 stocks (can be extended)
NIFTY_50_STOCKS = [
    "RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK",
    "HINDUNILVR", "SBIN", "BHARTIARTL", "ITC", "KOTAKBANK",
    "LT", "AXISBANK", "ASIANPAINT", "MARUTI", "TITAN",
    "BAJFINANCE", "SUNPHARMA", "WIPRO", "ULTRACEMCO", "NESTLEIND",
    "HCLTECH", "M&M", "POWERGRID", "NTPC", "TECHM",
    "TATAMOTORS", "INDUSINDBK", "BAJAJFINSV", "ONGC", "ADANIPORTS",
    "JSWSTEEL", "HINDALCO", "TATASTEEL", "GRASIM", "CIPLA",
    "DRREDDY", "BRITANNIA", "APOLLOHOSP", "COALINDIA", "DIVISLAB",
    "EICHERMOT", "BPCL", "HEROMOTOCO", "TATACONSUM", "BAJAJ-AUTO",
    "SHRIRAMFIN", "SBILIFE", "HDFCLIFE", "LTIM", "ADANIENT"
]
import requests

def telegram_bot_sendtext(bot_message, bot_id='',
                          bot_token=''
    ):
    send_text = 'https://api.telegram.org/bot' + bot_token + '/sendMessage?chat_id=' + bot_id + '&parse_mode=Markdown&text=' + bot_message
    response = requests.get(send_text)
    print(response.text)


def get_authenticated_client():
    """
    Get an authenticated SmartConnect client from angel_one_api module.
    
    Returns:
        SmartConnect object or None if authentication fails
    """
    try:
        from angel_one_api import order
        client = order()
        if client:
            logger.info("✅ Successfully authenticated with Angel One API")
            return client
        else:
            logger.error("❌ Failed to authenticate with Angel One API")
            return None
    except Exception as e:
        logger.error(f"❌ Error during authentication: {str(e)}")
        return None


def get_stock_tokens(stocks: List[str]) -> Dict[str, Dict]:
    """
    Get symbol tokens for the given stock list from the scrip master.
    
    Args:
        stocks: List of stock names to look up
        
    Returns:
        Dictionary mapping stock names to their token info
    """
    try:
        import requests
        
        logger.info(f"📋 Fetching symbol tokens for {len(stocks)} stocks...")
        
        BASE_URL = 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json'
        data = requests.get(BASE_URL).json()
        df = pd.DataFrame(data)
        
        # Filter for equity stocks in NSE
        df_nse = df[df['exch_seg'] == 'NSE']
        df_equity = df_nse[df_nse['symbol'].str.endswith('-EQ')]
        
        stock_tokens = {}
        for stock in stocks:
            symbol = f"{stock}-EQ"
            match = df_equity[df_equity['symbol'] == symbol]
            if not match.empty:
                row = match.iloc[0]
                stock_tokens[stock] = {
                    'token': row['token'],
                    'symbol': row['symbol'],
                    'name': row['name'],
                    'exch_seg': row['exch_seg']
                }
            else:
                logger.warning(f"⚠️ Could not find token for {stock}")
        
        logger.info(f"✅ Found tokens for {len(stock_tokens)}/{len(stocks)} stocks")
        return stock_tokens
        
    except Exception as e:
        logger.error(f"❌ Error fetching stock tokens: {str(e)}")
        return {}


def get_opening_range(client, token: str, exchange: str = "NSE") -> Optional[Dict]:
    """
    Get the opening range (high and low) for the first 5-minute candle.
    
    Args:
        client: SmartConnect client object
        token: Symbol token
        exchange: Exchange segment (default: NSE)
        
    Returns:
        Dictionary with 'high', 'low', 'open', 'close' or None if error
    """
    try:
        now = datetime.datetime.now(IST)
        today = now.strftime('%Y-%m-%d')
        
        # Fetch candle data for today's opening
        candle_data = client.getCandleData(historicDataParams={
            "exchange": exchange,
            "symboltoken": str(token),
            "interval": "FIVE_MINUTE",
            "fromdate": f"{today} 09:15",
            "todate": f"{today} 09:20"
        })
        
        if candle_data and candle_data.get('data') and len(candle_data['data']) > 0:
            # The first candle is the opening range
            candle = candle_data['data'][0]
            # Format: [Datetime, Open, High, Low, Close, Volume]
            return {
                'datetime': candle[0],
                'open': candle[1],
                'high': candle[2],
                'low': candle[3],
                'close': candle[4],
                'volume': candle[5]
            }
        else:
            logger.warning(f"⚠️ No candle data returned for token {token}")
            return None
            
    except Exception as e:
        logger.error(f"❌ Error getting opening range for token {token}: {str(e)}")
        return None


def get_current_price(client, token: str, symbol: str, exchange: str = "NSE") -> Optional[float]:
    """
    Get the current LTP (Last Traded Price) for a stock.
    
    Args:
        client: SmartConnect client object
        token: Symbol token
        symbol: Trading symbol
        exchange: Exchange segment (default: NSE)
        
    Returns:
        Current price or None if error
    """
    try:
        ltp_data = client.ltpData(
            tradingsymbol=symbol,
            symboltoken=str(token),
            exchange=exchange
        )
        
        if ltp_data and ltp_data.get('data'):
            return ltp_data['data'].get('ltp')
        return None
        
    except Exception as e:
        logger.error(f"❌ Error getting LTP for {symbol}: {str(e)}")
        return None


def detect_breakout(or_high: float, or_low: float, current_price: float) -> Optional[str]:
    """
    Detect if there's a breakout based on opening range and current price.
    
    Args:
        or_high: Opening range high
        or_low: Opening range low
        current_price: Current price
        
    Returns:
        'BUY' if breakout above high, 'SELL' if breakout below low, None otherwise
    """
    if current_price > or_high:
        return 'BUY'
    elif current_price < or_low:
        return 'SELL'
    return None


def calculate_breakout_percentage(or_high: float, or_low: float, current_price: float, side: str) -> float:
    """
    Calculate the breakout percentage from the opening range boundary.
    
    Args:
        or_high: Opening range high
        or_low: Opening range low
        current_price: Current price
        side: 'BUY' or 'SELL'
        
    Returns:
        Percentage breakout from boundary
    """
    if side == 'BUY':
        return round(((current_price - or_high) / or_high) * 100, 3)
    elif side == 'SELL':
        return round(((or_low - current_price) / or_low) * 100, 3)
    return 0.0


def run_opening_range_breakout(stock_list: Optional[List[str]] = None) -> Dict[str, Any]:
    """
    Main function to detect opening range breakouts.
    
    Args:
        stock_list: Optional list of stocks to monitor (defaults to NIFTY_50_STOCKS)
        
    Returns:
        Dictionary containing timestamp and detected signals
    """
    logger.info("=" * 60)
    logger.info("🚀 Starting Opening Range Breakout Detection")
    logger.info("=" * 60)
    
    if stock_list is None:
        stock_list = NIFTY_50_STOCKS
    
    result = {
        "timestamp": datetime.datetime.now(IST).isoformat(),
        "date": datetime.datetime.now(IST).strftime('%Y-%m-%d'),
        "detection_time": datetime.datetime.now(IST).strftime('%H:%M:%S'),
        "stocks_analyzed": len(stock_list),
        "signals": []
    }
    
    # Get authenticated client
    client = get_authenticated_client()
    if not client:
        result["error"] = "Failed to authenticate with Angel One API"
        logger.error("❌ Cannot proceed without authentication")
        return result
    
    # Get stock tokens
    stock_tokens = get_stock_tokens(stock_list)
    if not stock_tokens:
        result["error"] = "Failed to fetch stock tokens"
        logger.error("❌ Cannot proceed without stock tokens")
        return result
    
    # Process each stock
    import time
    signals = []
    
    for stock_name, token_info in stock_tokens.items():
        try:
            logger.info(f"📊 Analyzing {stock_name}...")
            
            # Get opening range
            opening_range = get_opening_range(
                client,
                token_info['token'],
                token_info['exch_seg']
            )
            
            if not opening_range:
                logger.warning(f"⚠️ Skipping {stock_name} - no opening range data")
                continue
            
            # Get current price
            current_price = get_current_price(
                client,
                token_info['token'],
                token_info['symbol'],
                token_info['exch_seg']
            )
            
            if not current_price:
                logger.warning(f"⚠️ Skipping {stock_name} - no current price")
                continue
            
            # Detect breakout
            or_high = opening_range['high']
            or_low = opening_range['low']
            breakout_side = detect_breakout(or_high, or_low, current_price)
            
            if breakout_side:
                breakout_pct = calculate_breakout_percentage(or_high, or_low, current_price, breakout_side)
                
                signal = {
                    "stock": stock_name,
                    "symbol": token_info['symbol'],
                    "or_high": or_high,
                    "or_low": or_low,
                    "or_open": opening_range['open'],
                    "or_close": opening_range['close'],
                    "current_price": current_price,
                    "side": breakout_side,
                    "breakout_time": datetime.datetime.now(IST).isoformat(),
                    "breakout_percentage": breakout_pct
                }
                signals.append(signal)
                
                emoji = "🟢" if breakout_side == "BUY" else "🔴"
                logger.info(f"{emoji} BREAKOUT! {stock_name}: {breakout_side} @ ₹{current_price} (OR: {or_low}-{or_high})")
                telegram_bot_sendtext(f"{emoji} BREAKOUT! {stock_name}: {breakout_side} @ ₹{current_price} (OR: {or_low}-{or_high})")
            else:
                logger.debug(f"⏸️ {stock_name}: No breakout (Price: {current_price}, Range: {or_low}-{or_high})")
            
            # Rate limiting - avoid API throttling
            time.sleep(0.5)
            
        except Exception as e:
            logger.error(f"❌ Error processing {stock_name}: {str(e)}")
            continue
    
    result["signals"] = signals
    result["signals_count"] = len(signals)
    result["buy_signals"] = len([s for s in signals if s['side'] == 'BUY'])
    result["sell_signals"] = len([s for s in signals if s['side'] == 'SELL'])
    
    logger.info("=" * 60)
    logger.info(f"✅ Detection Complete!")
    logger.info(f"   📊 Stocks Analyzed: {len(stock_tokens)}")
    logger.info(f"   🎯 Total Signals: {len(signals)}")
    logger.info(f"   🟢 BUY Signals: {result['buy_signals']}")
    logger.info(f"   🔴 SELL Signals: {result['sell_signals']}")
    logger.info("=" * 60)
    
    return result


def save_breakout_signals(result: Dict[str, Any]) -> str:
    """
    Save breakout signals to a JSON file.
    
    Args:
        result: Dictionary containing detection results
        
    Returns:
        Path to the saved file
    """
    # Ensure data directory exists
    os.makedirs(DATA_DIR, exist_ok=True)
    
    output_file = os.path.join(DATA_DIR, "opening_range_breakouts.json")
    
    # Load existing data if file exists
    existing_data = []
    if os.path.exists(output_file):
        try:
            with open(output_file, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
                if not isinstance(existing_data, list):
                    existing_data = [existing_data]
        except (json.JSONDecodeError, Exception):
            existing_data = []
    
    # Append new result
    existing_data.append(result)
    
    # Keep only last 30 days of data
    cutoff_date = (datetime.datetime.now(IST) - datetime.timedelta(days=1)).strftime('%Y-%m-%d')
    existing_data = [d for d in existing_data if d.get('date', '9999-12-31') >= cutoff_date]
    
    # Save to file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, indent=2, ensure_ascii=False)
    
    logger.info(f"💾 Saved results to {output_file}")
    return output_file


def main():
    """Main entry point for the script."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Opening Range Breakout Detection")
    parser.add_argument("--stocks", nargs="*", help="List of stock symbols to analyze")
    parser.add_argument("--test", action="store_true", help="Run in test mode with limited stocks")
    parser.add_argument("--no-save", action="store_true", help="Don't save results to file")
    args = parser.parse_args()
    
    # Determine stock list
    if args.test:
        stock_list = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK"]
        logger.info("🧪 Running in TEST mode with 5 stocks")
    elif args.stocks:
        stock_list = args.stocks
        logger.info(f"📋 Running with custom stock list: {stock_list}")
    else:
        stock_list = NIFTY_50_STOCKS
        logger.info(f"📋 Running with NIFTY 50 stocks ({len(stock_list)} stocks)")
    
    # Run detection
    result = run_opening_range_breakout(stock_list)
    
    # Save results
    if not args.no_save:
        save_breakout_signals(result)
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 OPENING RANGE BREAKOUT SIGNALS")
    print("=" * 60)
    
    if result.get('signals'):
        for signal in result['signals']:
            emoji = "🟢 BUY" if signal['side'] == 'BUY' else "🔴 SELL"
            print(f"{emoji} | {signal['stock']:15} | ₹{signal['current_price']:>10.2f} | Range: {signal['or_low']:.2f}-{signal['or_high']:.2f} | {signal['breakout_percentage']:+.2f}%")
    else:
        print("No breakout signals detected.")
    
    print("=" * 60 + "\n")
    
    return result


if __name__ == "__main__":
    main()
