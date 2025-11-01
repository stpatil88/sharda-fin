import datetime
import warnings
from SmartApi import SmartConnect
import pyotp
import pandas as pd
import time
warnings.filterwarnings('ignore')
import logging
import requests
import os
import json
# Configure the logging settings
logging.basicConfig(
    level=logging.INFO,  # Set the logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    format='%(asctime)s : %(message)s',  # Define the log message format
    filename='example_fetch.log',  # Specify the log file name
    filemode='a'  # Specify the file mode ('a' for append)
)
from dotenv import load_dotenv
load_dotenv()
API_KEY_MJ = os.getenv("API_KEY")
USERID_MJ = os.getenv("USERID")
PASSWORD_MJ = os.getenv("PASSWORD")
OTP = os.getenv("TOTP")
print(API_KEY_MJ, USERID_MJ, PASSWORD_MJ, OTP)

def order():
    print(API_KEY_MJ, USERID_MJ, PASSWORD_MJ, OTP)
    api_key = API_KEY_MJ
    obj = SmartConnect(api_key=api_key )
    userid = USERID_MJ
    password = PASSWORD_MJ
    totp = pyotp.TOTP(OTP)
    totp = totp.now()  # => '492039'
    count = 0
    while count>4:
        count+=1
        if totp:
            break
        totp = pyotp.TOTP(OTP)
        totp = totp.now()  # => '492039'
    data = obj.generateSession(userid, password,totp)
    if data['data']:
        refreshToken = data['data']['refreshToken']
        feedToken = obj.getfeedToken()
        userProfile = obj.getProfile(refreshToken)
        return obj
    return None

def get_scrips():
    BASE_URL = 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json'
    data = requests.get(BASE_URL).json()
    df = pd.DataFrame(data)
    df=df[df['instrumenttype'].isin(['FUTSTK','OPTSTK'])]
    df= df[df['exch_seg'] == 'NFO']
    val = df['expiry'].unique().tolist()
    val.sort(key=lambda x:datetime.datetime.strptime(x,r'%d%b%Y'))
    df=df[df['expiry']==val[0]]
    df1=df[df['instrumenttype']=='FUTSTK']
    df2 = df[df['instrumenttype'] == 'OPTSTK']
    return df1,df2


def get_candle_df(token, obj ,exchange):
    now = datetime.datetime.now()
    dates= now - datetime.timedelta(days=30)
    dates= dates.strftime('%Y-%m-%d')
    todate = now.strftime('%Y-%m-%d %H:%M')
    candle_data = obj.getCandleData(historicDataParams={
        "exchange": exchange,
        "symboltoken": f"{token}",
        "interval": "FIVE_MINUTE",
        "fromdate": f"{dates} 09:00",
        "todate":todate
    })
    if candle_data['data']:
        candle = pd.DataFrame(candle_data['data'], columns =['Datetime',"Open", "High", "Low", "Close", "Volume"])
        candle['Datetime'] = pd.to_datetime(candle.Datetime)
        candle = candle.set_index('Datetime')
        return candle

def get_candle_data(row,obj,name):
    time.sleep(1)
    data_df=get_candle_df(row['token'],obj,row['exch_seg'])
    print(data_df.head())
    time.sleep(1)
    data_df.to_csv(f'data/{row[name]}.csv')
    close = data_df['Close'].iloc[-1]
    return close

def get_data():
    df1,df2 = get_scrips()
    obj = order()
    if obj:
        for _,row in df1.iterrows():
            try:
                close = get_candle_data(row,obj,'name')
                print(close)
                df3 = df2[df2['name']==row['name']]
                df3['diff'] = df3['strike'].apply(lambda x : abs(float(x)/100 - close))
                df3 = df3.sort_values('diff')
                df3=df3.head(2)
                for _,opt_row in df3.iterrows():
                    print(opt_row['symbol'])
                    close = get_candle_data(opt_row,obj,'symbol')
                    print(close)
                time.sleep(1)
            except BaseException as e:
                print(e.args)
                time.sleep(10)      
            
def get_stock_names():
    df1,df2 = get_scrips()
    return df1['name'].unique().tolist()


def get_option_oi_data(obj, row):
    """
    Fetch Open Interest (OI) data - fallback when Greeks data is not available
    
    Args:
        obj: SmartConnect object
        row: Row from options dataframe containing token, symbol, exchange info
    
    Returns:
        DataFrame containing OI data in OHLCV format or None
    """
    try:
        now = datetime.datetime.now()
        dates = now - datetime.timedelta(days=30)
        dates = dates.strftime('%Y-%m-%d')
        todate = now.strftime('%Y-%m-%d %H:%M')
        
        # Prepare historical parameters for OI data
        historicParam = {
            "exchange": row['exch_seg'],
            "symboltoken": str(row['token']),
            "interval": "FIVE_MINUTE",
            "fromdate": f"{dates} 09:00",
            "todate": todate
        }
        
        print(f"📊 Fetching OI data for {row['symbol']}...")
        
        # Fetch OI data
        oi_response = obj.getOIData(historicOIDataParams=historicParam)
        
        if oi_response and oi_response.get('status') and oi_response.get('data'):
            oi_data = oi_response['data']
            print(f"✅ Got {len(oi_data)} OI data points")
            
            # Convert OI data to OHLCV format for charting
            data_points = []
            for point in oi_data:
                oi_value = point.get('oi', 0)
                timestamp = point.get('time', '')
                
                # Use OI as the primary value (map to Close/Volume)
                # Create variations for OHLC representation
                oi_variation = oi_value * 0.01  # Small variation for visual representation
                
                data_points.append({
                    'Datetime': timestamp,
                    'Open': oi_value - oi_variation,
                    'High': oi_value + oi_variation,
                    'Low': oi_value - oi_variation,
                    'Close': oi_value,
                    'Volume': oi_value  # Store OI in volume column
                })
            
            # Convert to DataFrame
            df = pd.DataFrame(data_points)
            df['Datetime'] = pd.to_datetime(df['Datetime'])
            df = df.set_index('Datetime')
            
            print(f"✅ Successfully converted {len(df)} OI data points to OHLCV format")
            return df
        else:
            print(f"❌ No OI data returned for {row['symbol']}")
            return None
            
    except Exception as e:
        print(f"❌ Error fetching OI data for {row['symbol']}: {str(e)}")
        return None




# ------------------- Convenience helpers for API endpoints -------------------
def _get_client():
    """Create and return an authenticated SmartConnect client or None."""
    try:
        return order()
    except Exception:
        return None


def get_top_gainers(exchange: str = "NSE",client=None):
    """Fetch top gainers from SmartAPI if supported; else return empty list."""


    if not client:
        return {"count": 0, "gainers": [], "exchange": exchange, "note": "SmartAPI login failed"}
    try:
        # Newer SmartAPI provides TopGainersLosers API per change-log
        if hasattr(client, 'gainersLosers'):
            params = {"datatype":"PercPriceGainers", # Type of Data you want(PercOILosers/PercOIGainers/PercPriceGainers/PercPriceLosers)
                "expirytype":"NEAR"} # Expiry Type (NEAR/NEXT/FAR)
            res = client.gainersLosers(params)
            print(res)
            data = res.get("data", []) if isinstance(res, dict) else res
            return {"count": len(data or []), "gainers": data or [], "exchange": exchange}
        return {"count": 0, "gainers": [], "exchange": exchange, "note": "getTopGainersLosers not available"}
    except Exception as e:
        return {"count": 0, "gainers": [], "exchange": exchange, "error": str(e)}


def get_top_losers(exchange: str = "NSE",client=None):
    """Fetch top losers from SmartAPI if supported; else return empty list."""
    if not client:
        return {"count": 0, "losers": [], "exchange": exchange, "note": "SmartAPI login failed"}
    try:
        if hasattr(client, 'gainersLosers'):
            params = {"datatype":"PercPriceLosers", # Type of Data you want(PercOILosers/PercOIGainers/PercPriceGainers/PercPriceLosers)
                "expirytype":"NEAR"} # Expiry Type (NEAR/NEXT/FAR)
            res = client.gainersLosers(params)
            print(res)
            data = res.get("data", []) if isinstance(res, dict) else res
            return {"count": len(data or []), "losers": data or [], "exchange": exchange}
        return {"count": 0, "losers": [], "exchange": exchange, "note": "getTopGainersLosers not available"}
    except Exception as e:
        return {"count": 0, "losers": [], "exchange": exchange, "error": str(e)}


def get_put_call_ratio(exchange: str = "NSE",client=None):
    """Fetch Put/Call Ratio if SmartAPI supports it; else return 501-like payload."""
    if not client:
        return {"status": "unavailable", "reason": "SmartAPI login failed"}
    try:
        # Per SmartAPI changelog, PutRatio API exists; method name may vary
        for method_name in ("putCallRatio", "getPutCallData"):
            if hasattr(client, method_name):
                method = getattr(client, method_name)
                res = client.putCallRatio()
                # res = method({"exchange": exchange})
                return {"status": "ok", "exchange": exchange, "data": res.get("data", res)}
        return {"status": "not_supported", "reason": "Put/Call Ratio API not available in this SmartAPI version"}
    except Exception as e:
        return {"status": "error", "reason": str(e)}


def get_index_quote(index: str = "NIFTY",client=None):
    """Get a simple quote for key indices using candles as fallback."""
    if not client:
        return {"status": "unavailable", "reason": "SmartAPI login failed"}
    try:
        print(1)
        # Fallback approach: use token mapping for indices if available; else return not supported
        index_map = {
            "NIFTY": {"exchange": "NSE", "symboltoken": "26000"},
            "BANKNIFTY": {"exchange": "NSE", "symboltoken": "26009"},
            "SENSEX": {"exchange": "BSE", "symboltoken": "99919000"},
            "GOLDCOM": {"exchange": "MCX", "symboltoken": "114"},
        }
        key = index.upper()
        info = index_map.get(key)
        if not info:
            return {"status": "not_supported", "reason": f"Index {index} not mapped"}
        if hasattr(client, 'ltpData'):
            res = client.ltpData(tradingsymbol=key,symboltoken=info["symboltoken"],exchange=info["exchange"])
            print(res)
            data = res.get("data") if isinstance(res, dict) else None
            if data:
                last = data
                return {
                    "status": "ok",
                    "symbol": key,
                    "exchange": info["exchange"],
                    "price": last['ltp'],
                    "open": last['open'],
                    "high": last['high'],
                    "low": last['low'],
                    "close": last['close']
                }
        return {"status": "not_supported", "reason": "getCandleData not available"}
    except Exception as e:
        print({"status": "error", "reason": str(e)})
        return {"status": "error", "reason": str(e)}


def _ensure_data_dir() -> str:
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(data_dir, exist_ok=True)
    return data_dir


def write_top_gainers_file(exchange: str = "NSE",client=None) -> str:
    data = get_top_gainers(exchange,client)
    path = os.path.join(_ensure_data_dir(), "top_gainers.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return path


def write_top_losers_file(exchange: str = "NSE",client=None) -> str:
    data = get_top_losers(exchange,client)
    path = os.path.join(_ensure_data_dir(), "top_losers.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return path


def write_put_call_ratio_file(exchange: str = "NSE",client=None) -> str:
    data = get_put_call_ratio(exchange,client)
    path = os.path.join(_ensure_data_dir(), "put_call_ratio.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return path


def write_index_quotes_file(indexes=None,client=None) -> str:
    if indexes is None:
        indexes = ["NIFTY", "BANKNIFTY", "SENSEX", "GOLDCOM"]
    result = {}
    for idx in indexes:
        result[idx] = get_index_quote(idx,client)
    path = os.path.join(_ensure_data_dir(), "index_quotes.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    return path


if __name__ == "__main__":
    # Simple CLI to refresh data files
    import argparse
    client = _get_client()

    parser = argparse.ArgumentParser(description="Write SmartAPI data files")
    parser.add_argument("--exchange", default="NSE")
    parser.add_argument("--indexes", nargs="*", default=["NIFTY", "BANKNIFTY", "SENSEX", "GOLD"])
    parser.add_argument("--all", action="store_true", help="Write all files")
    parser.add_argument("--gainers", action="store_true")
    parser.add_argument("--losers", action="store_true")
    parser.add_argument("--pcr", action="store_true")
    parser.add_argument("--quotes", action="store_true")
    args = parser.parse_args()
    client = _get_client()
    write_index_quotes_file(args.indexes, client)
    if args.all or args.gainers:
        print("Writing top_gainers.json ->", write_top_gainers_file(args.exchange,client))
    if args.all or args.losers:
        print("Writing top_losers.json ->", write_top_losers_file(args.exchange,client))
    if args.all or args.pcr:
        print("Writing put_call_ratio.json ->", write_put_call_ratio_file(args.exchange,client))
    if args.all or args.quotes:
        print("Writing index_quotes.json ->", write_index_quotes_file(args.indexes,client))