import yfinance as yf
import pandas as pd

# -------------------------------------------------
# CONFIG
# -------------------------------------------------
INTERVAL = "5m"
CANDLE_TIME = "15:00"     # 3:00 PM IST
import warnings
warnings.filterwarnings('ignore')
import requests

def telegram_bot_sendtext(bot_message, bot_id='',
                          bot_token=''
    ):
    send_text = 'https://api.telegram.org/bot' + bot_token + '/sendMessage?chat_id=' + bot_id + '&parse_mode=Markdown&text=' + bot_message
    response = requests.get(send_text)
    print(response.text)
    
# -------------------------------------------------
# NIFTY 200 SYMBOLS (PARTIAL — EXTEND FULL LIST)
# -------------------------------------------------
nifty_200_symbols = ['360ONE.NS', 'ABB.NS', 'ACC.NS', 'APLAPOLLO.NS', 'AUBANK.NS', 'ADANIENSOL.NS', 'ADANIENT.NS', 'ADANIGREEN.NS', 'ADANIPORTS.NS', 'ADANIPOWER.NS', 'ATGL.NS', 'ABCAPITAL.NS', 'ALKEM.NS', 'AMBUJACEM.NS', 'APOLLOHOSP.NS', 'ASHOKLEY.NS', 'ASIANPAINT.NS', 'ASTRAL.NS', 'AUROPHARMA.NS', 'DMART.NS', 'AXISBANK.NS', 'BSE.NS', 'BAJAJ-AUTO.NS', 'BAJFINANCE.NS', 'BAJAJFINSV.NS', 'BAJAJHLDNG.NS', 'BAJAJHFL.NS', 'BANKBARODA.NS', 'BANKINDIA.NS', 'BDL.NS', 'BEL.NS', 'BHARATFORG.NS', 'BHEL.NS', 'BPCL.NS', 'BHARTIARTL.NS', 'BHARTIHEXA.NS', 'BIOCON.NS', 'BLUESTARCO.NS', 'BOSCHLTD.NS', 'BRITANNIA.NS', 'CGPOWER.NS', 'CANBK.NS', 'CHOLAFIN.NS', 'CIPLA.NS', 'COALINDIA.NS', 'COCHINSHIP.NS', 'COFORGE.NS', 'COLPAL.NS', 'CONCOR.NS', 'COROMANDEL.NS', 'CUMMINSIND.NS', 'DLF.NS', 'DABUR.NS', 'DIVISLAB.NS', 'DIXON.NS', 'DRREDDY.NS', 'EICHERMOT.NS', 'ETERNAL.NS', 'EXIDEIND.NS', 'NYKAA.NS', 'FEDERALBNK.NS', 'FORTIS.NS', 'GAIL.NS', 'GMRAIRPORT.NS', 'GLENMARK.NS', 'GODFRYPHLP.NS', 'GODREJCP.NS', 'GODREJPROP.NS', 'GRASIM.NS', 'HCLTECH.NS', 'HDFCAMC.NS', 'HDFCBANK.NS', 'HDFCLIFE.NS', 'HAVELLS.NS', 'HEROMOTOCO.NS', 'HINDALCO.NS', 'HAL.NS', 'HINDPETRO.NS', 'HINDUNILVR.NS', 'HINDZINC.NS', 'POWERINDIA.NS', 'HUDCO.NS', 'HYUNDAI.NS', 'ICICIBANK.NS', 'ICICIGI.NS', 'IDFCFIRSTB.NS', 'IRB.NS', 'ITCHOTELS.NS', 'ITC.NS', 'INDIANB.NS', 'INDHOTEL.NS', 'IOC.NS', 'IRCTC.NS', 'IRFC.NS', 'IREDA.NS', 'IGL.NS', 'INDUSTOWER.NS', 'INDUSINDBK.NS', 'NAUKRI.NS', 'INFY.NS', 'INDIGO.NS', 'JSWENERGY.NS', 'JSWSTEEL.NS', 'JINDALSTEL.NS', 'JIOFIN.NS', 'JUBLFOOD.NS', 'KEI.NS', 'KPITTECH.NS', 'KALYANKJIL.NS', 'KOTAKBANK.NS', 'LTF.NS', 'LICHSGFIN.NS', 'LTIM.NS', 'LT.NS', 'LICI.NS', 'LODHA.NS', 'LUPIN.NS', 'MRF.NS', 'M&MFIN.NS', 'M&M.NS', 'MANKIND.NS', 'MARICO.NS', 'MARUTI.NS', 'MFSL.NS', 'MAXHEALTH.NS', 'MAZDOCK.NS', 'MOTILALOFS.NS', 'MPHASIS.NS', 'MUTHOOTFIN.NS', 'NHPC.NS', 'NMDC.NS', 'NTPCGREEN.NS', 'NTPC.NS', 'NATIONALUM.NS', 'NESTLEIND.NS', 'OBEROIRLTY.NS', 'ONGC.NS', 'OIL.NS', 'PAYTM.NS', 'OFSS.NS', 'POLICYBZR.NS', 'PIIND.NS', 'PAGEIND.NS', 'PATANJALI.NS', 'PERSISTENT.NS', 'PHOENIXLTD.NS', 'PIDILITIND.NS', 'POLYCAB.NS', 'PFC.NS', 'POWERGRID.NS', 'PREMIERENE.NS', 'PRESTIGE.NS', 'PNB.NS', 'RECLTD.NS', 'RVNL.NS', 'RELIANCE.NS', 'SBICARD.NS', 'SBILIFE.NS', 'SRF.NS', 'MOTHERSON.NS', 'SHREECEM.NS', 'SHRIRAMFIN.NS', 'ENRIN.NS', 'SIEMENS.NS', 'SOLARINDS.NS', 'SONACOMS.NS', 'SBIN.NS', 'SAIL.NS', 'SUNPHARMA.NS', 'SUPREMEIND.NS', 'SUZLON.NS', 'SWIGGY.NS', 'TVSMOTOR.NS', 'TATACOMM.NS', 'TCS.NS', 'TATACONSUM.NS', 'TATAELXSI.NS', 'TMPV.NS', 'TATAPOWER.NS', 'TATASTEEL.NS', 'TATATECH.NS', 'TECHM.NS', 'TITAN.NS', 'TORNTPHARM.NS', 'TORNTPOWER.NS', 'TRENT.NS', 'TIINDIA.NS', 'UPL.NS', 'ULTRACEMCO.NS', 'UNIONBANK.NS', 'UNITDSPR.NS', 'VBL.NS', 'VEDL.NS', 'VMM.NS', 'IDEA.NS', 'VOLTAS.NS', 'WAAREEENER.NS', 'WIPRO.NS', 'YESBANK.NS', 'ZYDUSLIFE.NS']
# -------------------------------------------------
# CHECK FUNCTION
# -------------------------------------------------
def check_stock(symbol):
    try:
        df = yf.download(
            symbol,
            period="1d",
            interval=INTERVAL,
            progress=False
        )
        # print(df.head())

        df.columns = df.columns.droplevel(1)
        if df.empty:
            return None



        # Convert to IST
        df.index = df.index.tz_convert("Asia/Kolkata")

        # Separate 3:00 PM candle
        candle_3pm = df[df.index.strftime("%H:%M") == CANDLE_TIME]
        if candle_3pm.empty:
            return None

        candle_3pm = candle_3pm.iloc[0]
        # Data BEFORE 3:00 PM
        data_before_3pm = df[df.index.strftime("%H:%M") < CANDLE_TIME]
        if data_before_3pm.empty:
            return None

        same_day_prev_high = float(data_before_3pm["High"].max())
        # Conditions
        if (
            candle_3pm["Close"] > same_day_prev_high and
            candle_3pm["High"] > same_day_prev_high
        ):
            telegram_bot_sendtext(symbol)
            return {
                "Symbol": symbol,
                "3PM Close": round(candle_3pm["Close"], 2),
                "3PM High": round(candle_3pm["High"], 2),
                "High-Close": (round(candle_3pm["High"], 2) - round(candle_3pm["Close"], 2))/round(candle_3pm["Close"], 2) * 100,
                "Same Day Prev High": round(same_day_prev_high, 2)
            }

    except Exception as e:
        print(f"{symbol} error: {e}")

    return None

# -------------------------------------------------
# RUN SCAN
# -------------------------------------------------
results = []

for stock in nifty_200_symbols:
    result = check_stock(stock)
    if result:
        results.append(result)

# -------------------------------------------------
# OUTPUT
# -------------------------------------------------
df_results = pd.DataFrame(results)

if not df_results.empty:
    print("\nStocks breaking SAME-DAY HIGH at 3:00 PM\n")
    print(df_results.to_string(index=False))
else:
    print("\nNo stocks met the criteria today.")
