import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import schedule
import time

# Nifty 200 stock symbols (add .NS for NSE)
NIFTY_200_SYMBOLS  = ['360ONE.NS', 'ABB.NS', 'ACC.NS', 'APLAPOLLO.NS', 'AUBANK.NS', 'ADANIENSOL.NS', 'ADANIENT.NS', 'ADANIGREEN.NS', 'ADANIPORTS.NS', 'ADANIPOWER.NS', 'ATGL.NS', 'ABCAPITAL.NS', 'ALKEM.NS', 'AMBUJACEM.NS', 'APOLLOHOSP.NS', 'ASHOKLEY.NS', 'ASIANPAINT.NS', 'ASTRAL.NS', 'AUROPHARMA.NS', 'DMART.NS', 'AXISBANK.NS', 'BSE.NS', 'BAJAJ-AUTO.NS', 'BAJFINANCE.NS', 'BAJAJFINSV.NS', 'BAJAJHLDNG.NS', 'BAJAJHFL.NS', 'BANKBARODA.NS', 'BANKINDIA.NS', 'BDL.NS', 'BEL.NS', 'BHARATFORG.NS', 'BHEL.NS', 'BPCL.NS', 'BHARTIARTL.NS', 'BHARTIHEXA.NS', 'BIOCON.NS', 'BLUESTARCO.NS', 'BOSCHLTD.NS', 'BRITANNIA.NS', 'CGPOWER.NS', 'CANBK.NS', 'CHOLAFIN.NS', 'CIPLA.NS', 'COALINDIA.NS', 'COCHINSHIP.NS', 'COFORGE.NS', 'COLPAL.NS', 'CONCOR.NS', 'COROMANDEL.NS', 'CUMMINSIND.NS', 'DLF.NS', 'DABUR.NS', 'DIVISLAB.NS', 'DIXON.NS', 'DRREDDY.NS', 'EICHERMOT.NS', 'ETERNAL.NS', 'EXIDEIND.NS', 'NYKAA.NS', 'FEDERALBNK.NS', 'FORTIS.NS', 'GAIL.NS', 'GMRAIRPORT.NS', 'GLENMARK.NS', 'GODFRYPHLP.NS', 'GODREJCP.NS', 'GODREJPROP.NS', 'GRASIM.NS', 'HCLTECH.NS', 'HDFCAMC.NS', 'HDFCBANK.NS', 'HDFCLIFE.NS', 'HAVELLS.NS', 'HEROMOTOCO.NS', 'HINDALCO.NS', 'HAL.NS', 'HINDPETRO.NS', 'HINDUNILVR.NS', 'HINDZINC.NS', 'POWERINDIA.NS', 'HUDCO.NS', 'HYUNDAI.NS', 'ICICIBANK.NS', 'ICICIGI.NS', 'IDFCFIRSTB.NS', 'IRB.NS', 'ITCHOTELS.NS', 'ITC.NS', 'INDIANB.NS', 'INDHOTEL.NS', 'IOC.NS', 'IRCTC.NS', 'IRFC.NS', 'IREDA.NS', 'IGL.NS', 'INDUSTOWER.NS', 'INDUSINDBK.NS', 'NAUKRI.NS', 'INFY.NS', 'INDIGO.NS', 'JSWENERGY.NS', 'JSWSTEEL.NS', 'JINDALSTEL.NS', 'JIOFIN.NS', 'JUBLFOOD.NS', 'KEI.NS', 'KPITTECH.NS', 'KALYANKJIL.NS', 'KOTAKBANK.NS', 'LTF.NS', 'LICHSGFIN.NS', 'LTIM.NS', 'LT.NS', 'LICI.NS', 'LODHA.NS', 'LUPIN.NS', 'MRF.NS', 'M&MFIN.NS', 'M&M.NS', 'MANKIND.NS', 'MARICO.NS', 'MARUTI.NS', 'MFSL.NS', 'MAXHEALTH.NS', 'MAZDOCK.NS', 'MOTILALOFS.NS', 'MPHASIS.NS', 'MUTHOOTFIN.NS', 'NHPC.NS', 'NMDC.NS', 'NTPCGREEN.NS', 'NTPC.NS', 'NATIONALUM.NS', 'NESTLEIND.NS', 'OBEROIRLTY.NS', 'ONGC.NS', 'OIL.NS', 'PAYTM.NS', 'OFSS.NS', 'POLICYBZR.NS', 'PIIND.NS', 'PAGEIND.NS', 'PATANJALI.NS', 'PERSISTENT.NS', 'PHOENIXLTD.NS', 'PIDILITIND.NS', 'POLYCAB.NS', 'PFC.NS', 'POWERGRID.NS', 'PREMIERENE.NS', 'PRESTIGE.NS', 'PNB.NS', 'RECLTD.NS', 'RVNL.NS', 'RELIANCE.NS', 'SBICARD.NS', 'SBILIFE.NS', 'SRF.NS', 'MOTHERSON.NS', 'SHREECEM.NS', 'SHRIRAMFIN.NS', 'ENRIN.NS', 'SIEMENS.NS', 'SOLARINDS.NS', 'SONACOMS.NS', 'SBIN.NS', 'SAIL.NS', 'SUNPHARMA.NS', 'SUPREMEIND.NS', 'SUZLON.NS', 'SWIGGY.NS', 'TVSMOTOR.NS', 'TATACOMM.NS', 'TCS.NS', 'TATACONSUM.NS', 'TATAELXSI.NS', 'TMPV.NS', 'TATAPOWER.NS', 'TATASTEEL.NS', 'TATATECH.NS', 'TECHM.NS', 'TITAN.NS', 'TORNTPHARM.NS', 'TORNTPOWER.NS', 'TRENT.NS', 'TIINDIA.NS', 'UPL.NS', 'ULTRACEMCO.NS', 'UNIONBANK.NS', 'UNITDSPR.NS', 'VBL.NS', 'VEDL.NS', 'VMM.NS', 'IDEA.NS', 'VOLTAS.NS', 'WAAREEENER.NS', 'WIPRO.NS', 'YESBANK.NS', 'ZYDUSLIFE.NS']

import requests

def telegram_bot_sendtext(bot_message, bot_id='',
                          bot_token=''
    ):
    send_text = 'https://api.telegram.org/bot' + bot_token + '/sendMessage?chat_id=' + bot_id + '&parse_mode=Markdown&text=' + bot_message
    response = requests.get(send_text)
    print(response.text)

def check_intraday_condition(symbol):
    """
    Check if 5-minute close is greater than 1 day ago high
    Strategy: [-1] 5 minute Close > 1 day ago High
    """
    try:
        stock = yf.Ticker(symbol)

        # Get 5-minute data for today (from market open)
        # Need to get last few days to ensure we have data
        intraday_data = stock.history(period='5d', interval='5m')
        intraday_data.columns = intraday_data.columns.droplevel(1)

        if len(intraday_data) < 2:
            return False, "Insufficient intraday data"

        # Get the latest 5-minute close (most recent completed candle)
        current_5min_close = intraday_data['Close'].iloc[-1]

        # Get daily data for previous day's high
        daily_data = stock.history(period='5d', interval='1d')

        if len(daily_data) < 2:
            return False, "Insufficient daily data"

        # Get previous day's high (1 day ago)
        prev_day_high = daily_data['High'].iloc[-2]

        # Check condition: Current 5-min close > Previous day high
        condition_met = current_5min_close > prev_day_high

        return condition_met, {
            'symbol': symbol,
            'current_5min_close': round(current_5min_close, 2),
            'prev_day_high': round(prev_day_high, 2),
            'difference': round(current_5min_close - prev_day_high, 2),
            'percentage_above': round(((current_5min_close / prev_day_high) - 1) * 100, 2),
            'timestamp': intraday_data.index[-1].strftime('%Y-%m-%d %H:%M:%S')
        }

    except Exception as e:
        return False, f"Error: {str(e)}"


def run_intraday_screener():
    """Run the intraday stock screener"""
    current_time = datetime.now()

    # Check if it's a weekday (Monday=0, Sunday=6)
    if current_time.weekday() >= 5:
        print(f"\nToday is {current_time.strftime('%A')} - Market is closed. Skipping scan.")
        return

    print(f"\n{'=' * 100}")
    print(f"Running Intraday 5-Minute Stock Screener at {current_time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Strategy: 5-minute Close > Previous Day High")
    print(f"{'=' * 100}\n")

    passed_stocks = []
    failed_count = 0
    error_count = 0

    for symbol in NIFTY_200_SYMBOLS:
        print(f"Checking {symbol:20s}...", end=" ")
        passed, result = check_intraday_condition(symbol)

        if passed:
            telegram_bot_sendtext(f"✓ PASSED - Close: ₹{result['current_5min_close']}, Prev High: ₹{result['prev_day_high']}")
            print(
                f"✓ PASSED - Close: ₹{result['current_5min_close']}, Prev High: ₹{result['prev_day_high']}")

            passed_stocks.append(result)
        else:
            if isinstance(result, str) and "Error" in result:
                print(f"⚠ {result}")
                error_count += 1
            else:
                print("✗ Failed")
                failed_count += 1

    print(f"\n{'=' * 100}")
    print(f"Screening Complete!")
    print(f"{'=' * 100}")
    print(f"Stocks Passed:  {len(passed_stocks)}")
    print(f"Stocks Failed:  {failed_count}")
    print(f"Errors:         {error_count}")
    print(f"Total Scanned:  {len(NIFTY_200_SYMBOLS)}")
    print(f"{'=' * 100}\n")

    if passed_stocks:
        print("\n📈 Stocks that passed the condition (Breakout above previous day high):")
        print("-" * 100)
        df_results = pd.DataFrame(passed_stocks)

        # Sort by percentage above previous high (strongest breakouts first)
        df_results = df_results.sort_values('percentage_above', ascending=False)

        print(df_results.to_string(index=False))

        # Save to CSV with timestamp
        filename = f"intraday_screener_{current_time.strftime('%Y%m%d_%H%M%S')}.csv"
        df_results.to_csv(filename, index=False)
        print(f"\n💾 Results saved to: {filename}")
    else:
        print("\n❌ No stocks passed the condition.")

    print("\n" + "=" * 100 + "\n")


def schedule_intraday_screener():
    """Schedule the screener to run at 9:20 AM Monday-Friday"""

    # Run immediately on start (for testing)
    print("Running initial scan...")
    run_intraday_screener()

    # Schedule Monday to Friday at 9:20 AM
    schedule.every().monday.at("09:20").do(run_intraday_screener)
    schedule.every().tuesday.at("09:20").do(run_intraday_screener)
    schedule.every().wednesday.at("09:20").do(run_intraday_screener)
    schedule.every().thursday.at("09:20").do(run_intraday_screener)
    schedule.every().friday.at("09:20").do(run_intraday_screener)

    print("\n" + "=" * 100)
    print("🔔 Intraday Screener Scheduled")
    print("=" * 100)
    print("⏰ Runs Monday-Friday at 9:20 AM IST")
    print("📊 Strategy: 5-minute Close > Previous Day High")
    print("🛑 Press Ctrl+C to stop")
    print("=" * 100 + "\n")

    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every 30 seconds


if __name__ == "__main__":
    # Run immediately for testing
    run_intraday_screener()

    # Uncomment below to enable daily scheduling at 9:20 AM Monday-Friday
    # schedule_intraday_screener()