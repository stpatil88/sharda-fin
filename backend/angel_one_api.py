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
# Security: Don't print actual credentials, only check if they exist
print(f"Environment variables loaded: API_KEY={'SET' if API_KEY_MJ else 'MISSING'}, USERID={'SET' if USERID_MJ else 'MISSING'}, PASSWORD={'SET' if PASSWORD_MJ else 'MISSING'}, TOTP={'SET' if OTP else 'MISSING'}")

def order():
    print("\n" + "="*60)
    print("🔐 Starting login process...")
    print(f"API_KEY: {'SET' if API_KEY_MJ else 'MISSING'} (length: {len(API_KEY_MJ) if API_KEY_MJ else 0})")
    print(f"USERID: {'SET' if USERID_MJ else 'MISSING'} ({USERID_MJ if USERID_MJ else 'None'})")
    print(f"PASSWORD: {'SET' if PASSWORD_MJ else 'MISSING'} (length: {len(PASSWORD_MJ) if PASSWORD_MJ else 0})")
    print(f"TOTP: {'SET' if OTP else 'MISSING'} (length: {len(OTP) if OTP else 0})")
    print("="*60)
    
    api_key = API_KEY_MJ
    obj = SmartConnect(api_key=api_key)
    userid = USERID_MJ
    password = PASSWORD_MJ
    totp = pyotp.TOTP(OTP)
    totp = totp.now()  # => '492039'
    print(f"📱 Generated TOTP: {totp}")
    
    count = 0
    while count>4:
        count+=1
        if totp:
            break
        totp = pyotp.TOTP(OTP)
        totp = totp.now()  # => '492039'
    
    print(f"🔄 Attempting to generate session...")
    data = obj.generateSession(userid, password, totp)
    print(f"📡 Session response: {data}")
    
    if data.get('data'):
        refreshToken = data['data'].get('refreshToken')
        print(f"✅ Login successful! RefreshToken: {refreshToken[:20]}..." if refreshToken else "⚠️ No refreshToken in response")
        feedToken = obj.getfeedToken()
        print(f"📡 FeedToken: {feedToken}")
        userProfile = obj.getProfile(refreshToken)
        print(f"👤 User Profile: {userProfile}")
        print("✅ Login completed successfully!")
        return obj
    else:
        print(f"❌ Login failed! Response: {data}")
        if data.get('message'):
            print(f"❌ Error message: {data.get('message')}")
        if data.get('errorCode'):
            print(f"❌ Error code: {data.get('errorCode')}")
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
    print("\n🔐 _get_client() called - attempting to authenticate...")
    try:
        client = order()
        if client:
            print("✅ _get_client() successful - client returned")
        else:
            print("❌ _get_client() failed - order() returned None")
        return client
    except Exception as e:
        print(f"❌ _get_client() exception: {str(e)}")
        import traceback
        print(f"❌ Traceback: {traceback.format_exc()}")
        return None


def get_top_gainers(exchange: str = "NSE",client=None):
    """Fetch top gainers from SmartAPI if supported; else return empty list."""
    print(f"\n📈 Fetching top gainers for exchange: {exchange}")
    
    if not client:
        print("❌ Client is None - login failed")
        return {"count": 0, "gainers": [], "exchange": exchange, "note": "SmartAPI login failed"}
    
    print(f"✅ Client available, type: {type(client)}")
    
    try:
        # Newer SmartAPI provides TopGainersLosers API per change-log
        if hasattr(client, 'gainersLosers'):
            print("✅ gainersLosers method found")
            params = {"datatype":"PercPriceGainers", # Type of Data you want(PercOILosers/PercOIGainers/PercPriceGainers/PercPriceLosers)
                "expirytype":"NEAR"} # Expiry Type (NEAR/NEXT/FAR)
            print(f"📤 Calling gainersLosers with params: {params}")
            res = client.gainersLosers(params)
            print(f"📥 Response received: {type(res)}")
            print(f"📥 Response keys: {res.keys() if isinstance(res, dict) else 'Not a dict'}")
            print(f"📥 Full response: {res}")
            
            data = res.get("data", []) if isinstance(res, dict) else res
            count = len(data or [])
            print(f"✅ Got {count} gainers")
            return {"count": count, "gainers": data or [], "exchange": exchange}
        else:
            print("❌ gainersLosers method not found on client")
            return {"count": 0, "gainers": [], "exchange": exchange, "note": "getTopGainersLosers not available"}
    except Exception as e:
        print(f"❌ Exception in get_top_gainers: {str(e)}")
        import traceback
        print(f"❌ Traceback: {traceback.format_exc()}")
        return {"count": 0, "gainers": [], "exchange": exchange, "error": str(e)}


def get_top_losers(exchange: str = "NSE",client=None):
    """Fetch top losers from SmartAPI if supported; else return empty list."""
    print(f"\n📉 Fetching top losers for exchange: {exchange}")
    
    if not client:
        print("❌ Client is None - login failed")
        return {"count": 0, "losers": [], "exchange": exchange, "note": "SmartAPI login failed"}
    
    print(f"✅ Client available, type: {type(client)}")
    
    try:
        if hasattr(client, 'gainersLosers'):
            print("✅ gainersLosers method found")
            params = {"datatype":"PercPriceLosers", # Type of Data you want(PercOILosers/PercOIGainers/PercPriceGainers/PercPriceLosers)
                "expirytype":"NEAR"} # Expiry Type (NEAR/NEXT/FAR)
            print(f"📤 Calling gainersLosers with params: {params}")
            res = client.gainersLosers(params)
            print(f"📥 Response received: {type(res)}")
            print(f"📥 Response keys: {res.keys() if isinstance(res, dict) else 'Not a dict'}")
            print(f"📥 Full response: {res}")
            
            data = res.get("data", []) if isinstance(res, dict) else res
            count = len(data or [])
            print(f"✅ Got {count} losers")
            return {"count": count, "losers": data or [], "exchange": exchange}
        else:
            print("❌ gainersLosers method not found on client")
            return {"count": 0, "losers": [], "exchange": exchange, "note": "getTopGainersLosers not available"}
    except Exception as e:
        print(f"❌ Exception in get_top_losers: {str(e)}")
        import traceback
        print(f"❌ Traceback: {traceback.format_exc()}")
        return {"count": 0, "losers": [], "exchange": exchange, "error": str(e)}


def get_put_call_ratio(exchange: str = "NSE",client=None):
    """Fetch Put/Call Ratio if SmartAPI supports it; else return 501-like payload."""
    print(f"\n📊 Fetching Put/Call Ratio for exchange: {exchange}")
    
    if not client:
        print("❌ Client is None - login failed")
        return {"status": "unavailable", "reason": "SmartAPI login failed"}
    
    print(f"✅ Client available, type: {type(client)}")
    
    try:
        # Per SmartAPI changelog, PutRatio API exists; method name may vary
        print("🔍 Checking for putCallRatio methods...")
        for method_name in ("putCallRatio", "getPutCallData"):
            if hasattr(client, method_name):
                print(f"✅ Found method: {method_name}")
                method = getattr(client, method_name)
                print(f"📤 Calling {method_name}()...")
                res = client.putCallRatio()
                print(f"📥 Response received: {type(res)}")
                print(f"📥 Response: {res}")
                return {"status": "ok", "exchange": exchange, "data": res.get("data", res)}
            else:
                print(f"❌ Method {method_name} not found")
        
        print("❌ Put/Call Ratio API not available in this SmartAPI version")
        return {"status": "not_supported", "reason": "Put/Call Ratio API not available in this SmartAPI version"}
    except Exception as e:
        print(f"❌ Exception in get_put_call_ratio: {str(e)}")
        import traceback
        print(f"❌ Traceback: {traceback.format_exc()}")
        return {"status": "error", "reason": str(e)}


def get_index_quote(index: str = "NIFTY",client=None):
    """Get a simple quote for key indices using candles as fallback."""
    print(f"\n📊 Fetching index quote for: {index}")
    
    if not client:
        print("❌ Client is None - login failed")
        return {"status": "unavailable", "reason": "SmartAPI login failed"}
    
    print(f"✅ Client available, type: {type(client)}")
    
    try:
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
            print(f"❌ Index {index} not found in index_map")
            return {"status": "not_supported", "reason": f"Index {index} not mapped"}
        
        print(f"✅ Index mapping found: {key} -> {info}")
        
        if hasattr(client, 'ltpData'):
            print("✅ ltpData method found")
            print(f"📤 Calling ltpData with tradingsymbol={key}, symboltoken={info['symboltoken']}, exchange={info['exchange']}")
            res = client.ltpData(tradingsymbol=key, symboltoken=info["symboltoken"], exchange=info["exchange"])
            print(f"📥 Response received: {type(res)}")
            print(f"📥 Full response: {res}")
            
            data = res.get("data") if isinstance(res, dict) else None
            if data:
                print(f"✅ Data extracted: {data}")
                last = data
                result = {
                    "status": "ok",
                    "symbol": key,
                    "exchange": info["exchange"],
                    "price": last.get('ltp', 'N/A'),
                    "open": last.get('open', 'N/A'),
                    "high": last.get('high', 'N/A'),
                    "low": last.get('low', 'N/A'),
                    "close": last.get('close', 'N/A')
                }
                print(f"✅ Returning quote data: {result}")
                return result
            else:
                print(f"❌ No data in response. Response structure: {res}")
        else:
            print("❌ ltpData method not found on client")
        return {"status": "not_supported", "reason": "getCandleData not available"}
    except Exception as e:
        print(f"❌ Exception in get_index_quote: {str(e)}")
        import traceback
        print(f"❌ Traceback: {traceback.format_exc()}")
        return {"status": "error", "reason": str(e)}


def _ensure_data_dir() -> str:
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(data_dir, exist_ok=True)
    return data_dir


def write_top_gainers_file(exchange: str = "NSE",client=None) -> str:
    print(f"\n💾 Writing top_gainers.json file...")
    data = get_top_gainers(exchange,client)
    print(f"📊 Data received: count={data.get('count', 0)}")
    path = os.path.join(_ensure_data_dir(), "top_gainers.json")
    print(f"📁 Writing to: {path}")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✅ File written successfully")
    return path


def write_top_losers_file(exchange: str = "NSE",client=None) -> str:
    print(f"\n💾 Writing top_losers.json file...")
    data = get_top_losers(exchange,client)
    print(f"📊 Data received: count={data.get('count', 0)}")
    path = os.path.join(_ensure_data_dir(), "top_losers.json")
    print(f"📁 Writing to: {path}")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✅ File written successfully")
    return path


def write_put_call_ratio_file(exchange: str = "NSE",client=None) -> str:
    print(f"\n💾 Writing put_call_ratio.json file...")
    data = get_put_call_ratio(exchange,client)
    print(f"📊 Data received: status={data.get('status', 'unknown')}")
    path = os.path.join(_ensure_data_dir(), "put_call_ratio.json")
    print(f"📁 Writing to: {path}")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✅ File written successfully")
    return path


def write_index_quotes_file(indexes=None,client=None) -> str:
    print(f"\n💾 Writing index_quotes.json file...")
    if indexes is None:
        indexes = ["NIFTY", "BANKNIFTY", "SENSEX", "GOLDCOM"]
    print(f"📊 Fetching quotes for indexes: {indexes}")
    result = {}
    for idx in indexes:
        print(f"\n🔄 Processing index: {idx}")
        result[idx] = get_index_quote(idx, client)
        print(f"✅ {idx}: {result[idx].get('status', 'unknown')}")
    path = os.path.join(_ensure_data_dir(), "index_quotes.json")
    print(f"📁 Writing to: {path}")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f"✅ File written successfully with {len(result)} indexes")
    return path


if __name__ == "__main__":
    print("\n" + "="*60)
    print("🚀 Starting angel_one_api.py script")
    print("="*60)
    
    # Simple CLI to refresh data files
    import argparse
    parser = argparse.ArgumentParser(description="Write SmartAPI data files")
    parser.add_argument("--exchange", default="NSE")
    parser.add_argument("--indexes", nargs="*", default=["NIFTY", "BANKNIFTY", "SENSEX", "GOLD"])
    parser.add_argument("--all", action="store_true", help="Write all files")
    parser.add_argument("--gainers", action="store_true")
    parser.add_argument("--losers", action="store_true")
    parser.add_argument("--pcr", action="store_true")
    parser.add_argument("--quotes", action="store_true")
    args = parser.parse_args()
    
    print(f"\n📋 Arguments parsed:")
    print(f"   --exchange: {args.exchange}")
    print(f"   --indexes: {args.indexes}")
    print(f"   --all: {args.all}")
    print(f"   --gainers: {args.gainers}")
    print(f"   --losers: {args.losers}")
    print(f"   --pcr: {args.pcr}")
    print(f"   --quotes: {args.quotes}")
    
    print(f"\n🔐 Attempting to get authenticated client...")
    client = _get_client()
    
    if not client:
        print("❌ CRITICAL: Failed to get authenticated client. Exiting.")
        exit(1)
    else:
        print("✅ Client obtained successfully!")
    
    # Write index quotes file (always called, even if not requested)
    print(f"\n📊 Processing index quotes (always executed)...")
    write_index_quotes_file(args.indexes, client)
    
    if args.all or args.gainers:
        print(f"\n📈 Writing top_gainers.json...")
        path = write_top_gainers_file(args.exchange, client)
        print(f"✅ Written to: {path}")
    
    if args.all or args.losers:
        print(f"\n📉 Writing top_losers.json...")
        path = write_top_losers_file(args.exchange, client)
        print(f"✅ Written to: {path}")
    
    if args.all or args.pcr:
        print(f"\n📊 Writing put_call_ratio.json...")
        path = write_put_call_ratio_file(args.exchange, client)
        print(f"✅ Written to: {path}")
    
    if args.all or args.quotes:
        print(f"\n📊 Writing index_quotes.json (explicit request)...")
        path = write_index_quotes_file(args.indexes, client)
        print(f"✅ Written to: {path}")
    
    print("\n" + "="*60)
    print("✅ Script completed!")
    print("="*60 + "\n")