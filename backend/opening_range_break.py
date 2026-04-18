"""
Opening Range Breakout (ORB) Detection Script using yfinance

This script detects opening range breakouts between 9:20 AM and 3:15 PM IST.
The opening range is defined as the high and low of the first 5 minutes (9:15-9:20 AM).
A breakout is detected when the current price breaks above the opening range high (BUY)
or below the opening range low (SELL).

Features:
- Runs continuously in a loop every 60 seconds during market hours
- Filters out stocks that have already triggered a breakout to avoid duplicate alerts
- Uses yfinance for data
- Sends Telegram alerts
"""

import yfinance as yf
import pandas as pd
import numpy as np
import datetime
import json
import os
import logging
import warnings
import time
import requests
from typing import Dict, List, Optional, Any
import pytz

import sys

warnings.filterwarnings('ignore')

# Reconfigure stdout/stderr to use utf-8 on Windows to support emojis
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('opening_breakout.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, "data")

# IST timezone
IST = pytz.timezone('Asia/Kolkata')

# Default stock list - Nifty 200 stocks with .NS suffix for yfinance
NIFTY_200_SYMBOLS = [
    '360ONE.NS', 'ABB.NS', 'ACC.NS', 'APLAPOLLO.NS', 'AUBANK.NS', 'ADANIENSOL.NS', 
    'ADANIENT.NS', 'ADANIGREEN.NS', 'ADANIPORTS.NS', 'ADANIPOWER.NS', 'ATGL.NS', 
    'ABCAPITAL.NS', 'ALKEM.NS', 'AMBUJACEM.NS', 'APOLLOHOSP.NS', 'ASHOKLEY.NS', 
    'ASIANPAINT.NS', 'ASTRAL.NS', 'AUROPHARMA.NS', 'DMART.NS', 'AXISBANK.NS', 
    'BSE.NS', 'BAJAJ-AUTO.NS', 'BAJFINANCE.NS', 'BAJAJFINSV.NS', 'BAJAJHLDNG.NS', 
    'BAJAJHFL.NS', 'BANKBARODA.NS', 'BANKINDIA.NS', 'BDL.NS', 'BEL.NS', 
    'BHARATFORG.NS', 'BHEL.NS', 'BPCL.NS', 'BHARTIARTL.NS', 'BHARTIHEXA.NS', 
    'BIOCON.NS', 'BLUESTARCO.NS', 'BOSCHLTD.NS', 'BRITANNIA.NS', 'CGPOWER.NS', 
    'CANBK.NS', 'CHOLAFIN.NS', 'CIPLA.NS', 'COALINDIA.NS', 'COCHINSHIP.NS', 
    'COFORGE.NS', 'COLPAL.NS', 'CONCOR.NS', 'COROMANDEL.NS', 'CUMMINSIND.NS', 
    'DLF.NS', 'DABUR.NS', 'DIVISLAB.NS', 'DIXON.NS', 'DRREDDY.NS', 'EICHERMOT.NS', 
    'ETERNAL.NS', 'EXIDEIND.NS', 'NYKAA.NS', 'FEDERALBNK.NS', 'FORTIS.NS', 
    'GAIL.NS', 'GMRAIRPORT.NS', 'GLENMARK.NS', 'GODFRYPHLP.NS', 'GODREJCP.NS', 
    'GODREJPROP.NS', 'GRASIM.NS', 'HCLTECH.NS', 'HDFCAMC.NS', 'HDFCBANK.NS', 
    'HDFCLIFE.NS', 'HAVELLS.NS', 'HEROMOTOCO.NS', 'HINDALCO.NS', 'HAL.NS', 
    'HINDPETRO.NS', 'HINDUNILVR.NS', 'HINDZINC.NS', 'POWERINDIA.NS', 'HUDCO.NS', 
    'HYUNDAI.NS', 'ICICIBANK.NS', 'ICICIGI.NS', 'IDFCFIRSTB.NS', 'IRB.NS', 
    'ITCHOTELS.NS', 'ITC.NS', 'INDIANB.NS', 'INDHOTEL.NS', 'IOC.NS', 'IRCTC.NS', 
    'IRFC.NS', 'IREDA.NS', 'IGL.NS', 'INDUSTOWER.NS', 'INDUSINDBK.NS', 'NAUKRI.NS', 
    'INFY.NS', 'INDIGO.NS', 'JSWENERGY.NS', 'JSWSTEEL.NS', 'JINDALSTEL.NS', 
    'JIOFIN.NS', 'JUBLFOOD.NS', 'KEI.NS', 'KPITTECH.NS', 'KALYANKJIL.NS', 
    'KOTAKBANK.NS', 'LTF.NS', 'LICHSGFIN.NS', 'LTIM.NS', 'LT.NS', 'LICI.NS', 
    'LODHA.NS', 'LUPIN.NS', 'MRF.NS', 'M&MFIN.NS', 'M&M.NS', 'MANKIND.NS', 
    'MARICO.NS', 'MARUTI.NS', 'MFSL.NS', 'MAXHEALTH.NS', 'MAZDOCK.NS', 
    'MOTILALOFS.NS', 'MPHASIS.NS', 'MUTHOOTFIN.NS', 'NHPC.NS', 'NMDC.NS', 
    'NTPCGREEN.NS', 'NTPC.NS', 'NATIONALUM.NS', 'NESTLEIND.NS', 'OBEROIRLTY.NS', 
    'ONGC.NS', 'OIL.NS', 'PAYTM.NS', 'OFSS.NS', 'POLICYBZR.NS', 'PIIND.NS', 
    'PAGEIND.NS', 'PATANJALI.NS', 'PERSISTENT.NS', 'PHOENIXLTD.NS', 'PIDILITIND.NS', 
    'POLYCAB.NS', 'PFC.NS', 'POWERGRID.NS', 'PREMIERENE.NS', 'PRESTIGE.NS', 
    'PNB.NS', 'RECLTD.NS', 'RVNL.NS', 'RELIANCE.NS', 'SBICARD.NS', 'SBILIFE.NS', 
    'SRF.NS', 'MOTHERSON.NS', 'SHREECEM.NS', 'SHRIRAMFIN.NS', 'ENRIN.NS', 
    'SIEMENS.NS', 'SOLARINDS.NS', 'SONACOMS.NS', 'SBIN.NS', 'SAIL.NS', 
    'SUNPHARMA.NS', 'SUPREMEIND.NS', 'SUZLON.NS', 'SWIGGY.NS', 'TVSMOTOR.NS', 
    'TATACOMM.NS', 'TCS.NS', 'TATACONSUM.NS', 'TATAELXSI.NS', 'TMPV.NS', 
    'TATAPOWER.NS', 'TATASTEEL.NS', 'TATATECH.NS', 'TECHM.NS', 'TITAN.NS', 
    'TORNTPHARM.NS', 'TORNTPOWER.NS', 'TRENT.NS', 'TIINDIA.NS', 'UPL.NS', 
    'ULTRACEMCO.NS', 'UNIONBANK.NS', 'UNITDSPR.NS', 'VBL.NS', 'VEDL.NS', 
    'VMM.NS', 'IDEA.NS', 'VOLTAS.NS', 'WAAREEENER.NS', 'WIPRO.NS', 'YESBANK.NS', 
    'ZYDUSLIFE.NS'
]


def telegram_bot_sendtext(bot_message, bot_id='-100181622905',
                          bot_token='2042514901:AAGbpdvipIvT7siKZlqgJNz8PUXUajSMOTc'
    ):
    send_text = 'https://api.telegram.org/bot' + bot_token + '/sendMessage?chat_id=' + bot_id + '&parse_mode=Markdown&text=' + bot_message
    try:
        response = requests.get(send_text, timeout=10)
        print(response.text)
    except Exception as e:
        logger.error(f"Failed to send telegram message: {e}")


def get_opening_range_yf(symbol: str) -> Optional[Dict]:
    """
    Get the opening range (high and low) for the first 5-minute candle using yfinance.
    
    Args:
        symbol: Stock symbol with .NS suffix (e.g., 'RELIANCE.NS')
        
    Returns:
        Dictionary with 'high', 'low', 'open', 'close', 'current_price' or None if error
    """
    try:
        # Download 5-minute data for today
        df = yf.download(
            symbol,
            period="1d",
            interval="5m",
            progress=False
        )
        
        if df.empty:
            return None
        
        # Handle multi-level columns from yfinance
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.droplevel(1)
        
        # Convert to IST
        df.index = df.index.tz_convert("Asia/Kolkata")
        
        # Get the first 5-minute candle (9:15 AM)
        opening_candle = df[df.index.strftime("%H:%M") == "09:15"]
        
        if opening_candle.empty:
            # Try to get the first available candle as fallback
            if len(df) > 0:
                opening_candle = df.iloc[[0]]
            else:
                return None
        
        opening_candle = opening_candle.iloc[0]
        
        # Get current (latest) price
        current_price = float(df['Close'].iloc[-1])
        
        return {
            'open': float(opening_candle['Open']),
            'high': float(opening_candle['High']),
            'low': float(opening_candle['Low']),
            'close': float(opening_candle['Close']),
            'current_price': current_price,
            'datetime': str(df.index[-1])
        }
        
    except Exception as e:
        logger.error(f"❌ Error getting opening range for {symbol}: {str(e)}")
        return None


def detect_breakout(or_high: float, or_low: float, current_price: float) -> Optional[str]:
    """
    Detect if there's a breakout based on opening range and current price.
    Returns 'BUY', 'SELL', or None.
    """
    if current_price > or_high:
        return 'BUY'
    elif current_price < or_low:
        return 'SELL'
    return None


def calculate_breakout_percentage(or_high: float, or_low: float, current_price: float, side: str) -> float:
    """Calculate the breakout percentage from the opening range boundary."""
    if side == 'BUY':
        return round(((current_price - or_high) / or_high) * 100, 3)
    elif side == 'SELL':
        return round(((or_low - current_price) / or_low) * 100, 3)
    return 0.0


def save_breakout_signals(result: Dict[str, Any]) -> str:
    """Save breakout signals to a JSON file."""
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
    
    # Keep only last 1 day of data
    cutoff_date = (datetime.datetime.now(IST) - datetime.timedelta(days=1)).strftime('%Y-%m-%d')
    existing_data = [d for d in existing_data if d.get('date', '9999-12-31') >= cutoff_date]
    
    # Save to file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, indent=2, ensure_ascii=False)
    
    logger.info(f"💾 Saved results to {output_file}")
    return output_file


def run_opening_range_breakout(stock_list: List[str]) -> Dict[str, Any]:
    """
    Run detection on the provided list of stocks.
    Returns dictionary with signals.
    """
    result = {
        "timestamp": datetime.datetime.now(IST).isoformat(),
        "date": datetime.datetime.now(IST).strftime('%Y-%m-%d'),
        "detection_time": datetime.datetime.now(IST).strftime('%H:%M:%S'),
        "stocks_analyzed": len(stock_list),
        "signals": []
    }
    
    signals = []
    
    # Shuffle list to avoid hitting same stocks first if needed, 
    # but sequential is fine for now
    for symbol in stock_list:
        try:
            # logger.debug(f"📊 Analyzing {symbol}...")
            
            # Get opening range and current price
            data = get_opening_range_yf(symbol)
            
            if not data:
                continue
            
            or_high = data['high']
            or_low = data['low']
            current_price = data['current_price']
            
            # Calculate opening range as percentage of price
            range_value = or_high - or_low
            range_percentage = (range_value / or_low) * 100 if or_low > 0 else 0
            
            # Skip if opening range is less than 0.75% of value
            if range_percentage < 0.75:
                # logger.debug(f"⏸️ {symbol}: Range too small ({range_percentage:.2f}% < 0.75%)")
                continue
            
            # Detect breakout
            breakout_side = detect_breakout(or_high, or_low, current_price)
            
            if breakout_side:
                breakout_pct = calculate_breakout_percentage(or_high, or_low, current_price, breakout_side)
                
                # Extract stock name without .NS suffix
                stock_name = symbol.replace('.NS', '')
                
                signal = {
                    "stock": stock_name,
                    "symbol": symbol,
                    "or_high": round(or_high, 2),
                    "or_low": round(or_low, 2),
                    "or_open": round(data['open'], 2),
                    "or_close": round(data['close'], 2),
                    "current_price": round(current_price, 2),
                    "side": breakout_side,
                    "breakout_time": datetime.datetime.now(IST).isoformat(),
                    "breakout_percentage": breakout_pct
                }
                signals.append(signal)
                
                emoji = "🟢" if breakout_side == "BUY" else "🔴"
                msg = f"{emoji} BREAKOUT! {stock_name}: {breakout_side} @ ₹{current_price:.2f} (OR: {or_low:.2f}-{or_high:.2f})"
                logger.info(msg)
                telegram_bot_sendtext(msg)
            
        except Exception as e:
            logger.error(f"❌ Error processing {symbol}: {str(e)}")
            continue
    
    result["signals"] = signals
    result["signals_count"] = len(signals)
    result["buy_signals"] = len([s for s in signals if s['side'] == 'BUY'])
    result["sell_signals"] = len([s for s in signals if s['side'] == 'SELL'])
    
    return result


def is_orb_hours():
    """Check if current time is within ORB hours (9:20 AM to 3:15 PM IST) and weekday"""
    now = datetime.datetime.now(IST)
    # Check if weekday (Monday=0, Friday=4)
    if now.weekday() >= 5:  # Saturday or Sunday
        return False
    current_time = now.time()
    orb_start = datetime.time(9, 20)   # 9:20 AM
    orb_end = datetime.time(15, 15)    # 3:15 PM
    return orb_start <= current_time <= orb_end


def main():
    """
    Main Loop:
    1. Checks if within market hours (9:20 AM - 3:15 PM).
    2. Runs the scan every 60 seconds (INTERVAL).
    3. Maintains a set of stocks that already triggered a breakout to avoid duplicates.
    """
    INTERVAL = 60
    triggered_stocks = set()
    
    logger.info(f"🚀 Starting Continuous ORB Detection Service")
    logger.info(f"⏰ ORB Hours: 9:20 AM - 3:15 PM IST")
    logger.info(f"⏱️ Interval: {INTERVAL} seconds")
    logger.info("🛑 Press Ctrl+C to stop")
    
    # Store the day to reset triggered_stocks on a new day
    current_day = datetime.datetime.now(IST).date()
    
    while True:
        try:
            now_ist = datetime.datetime.now(IST)
            
            # Reset triggered stocks if day changed
            if now_ist.date() > current_day:
                logger.info("� New day detected, resetting triggered stocks list.")
                triggered_stocks.clear()
                current_day = now_ist.date()
            
            if is_orb_hours():
                logger.info(f"⏰ Scanning at {now_ist.strftime('%H:%M:%S')}...")
                
                # Filter out already triggered stocks
                stocks_to_scan = [s for s in NIFTY_200_SYMBOLS if s not in triggered_stocks]
                
                if not stocks_to_scan:
                    logger.info("✅ All stocks have already triggered. Sleeping...")
                else:
                    logger.info(f"� Scanning {len(stocks_to_scan)} stocks (Remaining)")
                    
                    # Run the scan
                    result = run_opening_range_breakout(stocks_to_scan)
                    
                    # Add newly triggered stocks to the triggered_stocks set
                    new_triggers = 0
                    for signal in result.get('signals', []):
                        if signal['symbol'] not in triggered_stocks:
                            triggered_stocks.add(signal['symbol'])
                            new_triggers += 1
                    
                    # Log summary of this run
                    if result['signals_count'] > 0:
                        logger.info(f"Found {result['signals_count']} breakouts in this run.")
                        # Save only if we found something new
                        save_breakout_signals(result)
                    else:
                        logger.info("No new breakouts found.")
                        
                    logger.info(f"� Total unique triggered stocks today: {len(triggered_stocks)}")
                
                # Sleep for INTERVAL
                logger.info(f"💤 Sleeping for {INTERVAL} seconds...")
                time.sleep(INTERVAL)
                
            else:
                # Outside market hours
                logger.info(f"⏸️ Outside ORB hours (9:20 AM - 3:15 PM). Waiting... ({now_ist.strftime('%H:%M:%S')})")
                time.sleep(60)
                
        except KeyboardInterrupt:
            logger.info("🛑 Stopped by user")
            break
        except Exception as e:
            logger.error(f"❌ Error in main loop: {str(e)}")
            time.sleep(60)

if __name__ == "__main__":
    main()
