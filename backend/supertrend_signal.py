import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import schedule
import time
import sys

# Reconfigure stdout/stderr to use utf-8 on Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# Nifty 200 stock symbols (add .NS for NSE)
NIFTY_200_SYMBOLS = ['360ONE.NS', 'ABB.NS', 'ACC.NS', 'APLAPOLLO.NS', 'AUBANK.NS', 'ADANIENSOL.NS', 'ADANIENT.NS', 'ADANIGREEN.NS', 'ADANIPORTS.NS', 'ADANIPOWER.NS', 'ATGL.NS', 'ABCAPITAL.NS', 'ALKEM.NS', 'AMBUJACEM.NS', 'APOLLOHOSP.NS', 'ASHOKLEY.NS', 'ASIANPAINT.NS', 'ASTRAL.NS', 'AUROPHARMA.NS', 'DMART.NS', 'AXISBANK.NS', 'BSE.NS', 'BAJAJ-AUTO.NS', 'BAJFINANCE.NS', 'BAJAJFINSV.NS', 'BAJAJHLDNG.NS', 'BAJAJHFL.NS', 'BANKBARODA.NS', 'BANKINDIA.NS', 'BDL.NS', 'BEL.NS', 'BHARATFORG.NS', 'BHEL.NS', 'BPCL.NS', 'BHARTIARTL.NS', 'BHARTIHEXA.NS', 'BIOCON.NS', 'BLUESTARCO.NS', 'BOSCHLTD.NS', 'BRITANNIA.NS', 'CGPOWER.NS', 'CANBK.NS', 'CHOLAFIN.NS', 'CIPLA.NS', 'COALINDIA.NS', 'COCHINSHIP.NS', 'COFORGE.NS', 'COLPAL.NS', 'CONCOR.NS', 'COROMANDEL.NS', 'CUMMINSIND.NS', 'DLF.NS', 'DABUR.NS', 'DIVISLAB.NS', 'DIXON.NS', 'DRREDDY.NS', 'EICHERMOT.NS', 'ETERNAL.NS', 'EXIDEIND.NS', 'NYKAA.NS', 'FEDERALBNK.NS', 'FORTIS.NS', 'GAIL.NS', 'GMRAIRPORT.NS', 'GLENMARK.NS', 'GODFRYPHLP.NS', 'GODREJCP.NS', 'GODREJPROP.NS', 'GRASIM.NS', 'HCLTECH.NS', 'HDFCAMC.NS', 'HDFCBANK.NS', 'HDFCLIFE.NS', 'HAVELLS.NS', 'HEROMOTOCO.NS', 'HINDALCO.NS', 'HAL.NS', 'HINDPETRO.NS', 'HINDUNILVR.NS', 'HINDZINC.NS', 'POWERINDIA.NS', 'HUDCO.NS', 'HYUNDAI.NS', 'ICICIBANK.NS', 'ICICIGI.NS', 'IDFCFIRSTB.NS', 'IRB.NS', 'ITCHOTELS.NS', 'ITC.NS', 'INDIANB.NS', 'INDHOTEL.NS', 'IOC.NS', 'IRCTC.NS', 'IRFC.NS', 'IREDA.NS', 'IGL.NS', 'INDUSTOWER.NS', 'INDUSINDBK.NS', 'NAUKRI.NS', 'INFY.NS', 'INDIGO.NS', 'JSWENERGY.NS', 'JSWSTEEL.NS', 'JINDALSTEL.NS', 'JIOFIN.NS', 'JUBLFOOD.NS', 'KEI.NS', 'KPITTECH.NS', 'KALYANKJIL.NS', 'KOTAKBANK.NS', 'LTF.NS', 'LICHSGFIN.NS', 'LTIM.NS', 'LT.NS', 'LICI.NS', 'LODHA.NS', 'LUPIN.NS', 'MRF.NS', 'M&MFIN.NS', 'M&M.NS', 'MANKIND.NS', 'MARICO.NS', 'MARUTI.NS', 'MFSL.NS', 'MAXHEALTH.NS', 'MAZDOCK.NS', 'MOTILALOFS.NS', 'MPHASIS.NS', 'MUTHOOTFIN.NS', 'NHPC.NS', 'NMDC.NS', 'NTPCGREEN.NS', 'NTPC.NS', 'NATIONALUM.NS', 'NESTLEIND.NS', 'OBEROIRLTY.NS', 'ONGC.NS', 'OIL.NS', 'PAYTM.NS', 'OFSS.NS', 'POLICYBZR.NS', 'PIIND.NS', 'PAGEIND.NS', 'PATANJALI.NS', 'PERSISTENT.NS', 'PHOENIXLTD.NS', 'PIDILITIND.NS', 'POLYCAB.NS', 'PFC.NS', 'POWERGRID.NS', 'PREMIERENE.NS', 'PRESTIGE.NS', 'PNB.NS', 'RECLTD.NS', 'RVNL.NS', 'RELIANCE.NS', 'SBICARD.NS', 'SBILIFE.NS', 'SRF.NS', 'MOTHERSON.NS', 'SHREECEM.NS', 'SHRIRAMFIN.NS', 'ENRIN.NS', 'SIEMENS.NS', 'SOLARINDS.NS', 'SONACOMS.NS', 'SBIN.NS', 'SAIL.NS', 'SUNPHARMA.NS', 'SUPREMEIND.NS', 'SUZLON.NS', 'SWIGGY.NS', 'TVSMOTOR.NS', 'TATACOMM.NS', 'TCS.NS', 'TATACONSUM.NS', 'TATAELXSI.NS', 'TMPV.NS', 'TATAPOWER.NS', 'TATASTEEL.NS', 'TATATECH.NS', 'TECHM.NS', 'TITAN.NS', 'TORNTPHARM.NS', 'TORNTPOWER.NS', 'TRENT.NS', 'TIINDIA.NS', 'UPL.NS', 'ULTRACEMCO.NS', 'UNIONBANK.NS', 'UNITDSPR.NS', 'VBL.NS', 'VEDL.NS', 'VMM.NS', 'IDEA.NS', 'VOLTAS.NS', 'WAAREEENER.NS', 'WIPRO.NS', 'YESBANK.NS', 'ZYDUSLIFE.NS']

import requests

def telegram_bot_sendtext(bot_message, bot_id='-4145193957',
                          bot_token='2042514901:AAGbpdvipIvT7siKZlqgJNz8PUXUajSMOTc'
    ):
    send_text = 'https://api.telegram.org/bot' + bot_token + '/sendMessage?chat_id=' + bot_id + '&parse_mode=Markdown&text=' + bot_message
    try:
        response = requests.get(send_text, timeout=10)
        print(response.text)
    except Exception as e:
        print(f"Failed to send telegram message: {e}")

def calculate_supertrend(df, period=10, multiplier=3):
    """Calculate Supertrend indicator"""
    high = df['High']
    low = df['Low']
    close = df['Close']

    # Calculate ATR
    tr1 = high - low
    tr2 = abs(high - close.shift())
    tr3 = abs(low - close.shift())
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    atr = tr.rolling(window=period).mean()

    # Calculate basic upper and lower bands
    hl_avg = (high + low) / 2
    upper_band = hl_avg + (multiplier * atr)
    lower_band = hl_avg - (multiplier * atr)

    # Calculate Supertrend
    supertrend = pd.Series(index=df.index, dtype=float)
    direction = pd.Series(index=df.index, dtype=int)

    for i in range(period, len(df)):
        if i == period:
            supertrend.iloc[i] = lower_band.iloc[i]
            direction.iloc[i] = 1
        else:
            if close.iloc[i] > supertrend.iloc[i - 1]:
                supertrend.iloc[i] = lower_band.iloc[i]
                direction.iloc[i] = 1
            elif close.iloc[i] < supertrend.iloc[i - 1]:
                supertrend.iloc[i] = upper_band.iloc[i]
                direction.iloc[i] = -1
            else:
                supertrend.iloc[i] = supertrend.iloc[i - 1]
                direction.iloc[i] = direction.iloc[i - 1]

            if direction.iloc[i] == 1 and supertrend.iloc[i] < supertrend.iloc[i - 1]:
                supertrend.iloc[i] = supertrend.iloc[i - 1]
            elif direction.iloc[i] == -1 and supertrend.iloc[i] > supertrend.iloc[i - 1]:
                supertrend.iloc[i] = supertrend.iloc[i - 1]

    return supertrend, direction


def calculate_pivot_point(df):
    """Calculate Pivot Point R1"""
    prev_high = df['High'].iloc[-2]
    prev_low = df['Low'].iloc[-2]
    prev_close = df['Close'].iloc[-2]

    pivot = (prev_high + prev_low + prev_close) / 3
    r1 = 2 * pivot - prev_low

    return r1


def check_conditions(symbol):
    """Check if stock passes all three conditions"""
    try:
        stock = yf.Ticker(symbol)

        # Get daily data for recent analysis
        daily_data = stock.history(period='3mo', interval='1d')
        daily_data.columns = daily_data.columns.droplevel(1)

        if len(daily_data) < 30:
            return False, "Insufficient data"

        # Get monthly data for condition 1 and 2
        monthly_data = stock.history(period='1y', interval='1mo')
        monthly_data.columns = monthly_data.columns.droplevel(1)

        
        if len(monthly_data) < 3:
            return False, "Insufficient monthly data"

        # Resample daily to weekly for condition 3
        weekly_data = daily_data.resample('W').agg({
            'Open': 'first',
            'High': 'max',
            'Low': 'min',
            'Close': 'last',
            'Volume': 'sum'
        }).dropna()

        # Condition 1: Monthly Close crossed above Monthly Supertrend(10,3)
        monthly_st, monthly_dir = calculate_supertrend(monthly_data, 10, 3)
        current_monthly_close = monthly_data['Close'].iloc[-1]
        current_monthly_st = monthly_st.iloc[-1]
        condition_1 = current_monthly_close > current_monthly_st

        # Condition 2: 1 month ago Close less than 1 month ago Supertrend(10,3)
        if len(monthly_data) >= 2:
            prev_monthly_close = monthly_data['Close'].iloc[-2]
            prev_monthly_st = monthly_st.iloc[-2]
            condition_2 = prev_monthly_close < prev_monthly_st
        else:
            condition_2 = False

        # Condition 3: 1 week ago Close crossed above 1 week ago Pivot R1
        if len(weekly_data) >= 2:
            prev_week_close = weekly_data['Close'].iloc[-2]
            # Calculate R1 from the week before last
            if len(weekly_data) >= 3:
                r1 = calculate_pivot_point(weekly_data.iloc[-3:-1])
                condition_3 = prev_week_close > r1
            else:
                condition_3 = False
        else:
            condition_3 = False

        all_passed = condition_1 and condition_2 and condition_3

        return all_passed, {
            'symbol': symbol,
            'condition_1': condition_1,
            'condition_2': condition_2,
            'condition_3': condition_3,
            'current_price': current_monthly_close,
            'monthly_supertrend': current_monthly_st
        }

    except Exception as e:
        return False, f"Error: {str(e)}"


def run_screener():
    """Run the stock screener"""
    print(f"\n{'=' * 80}")
    print(f"Running Nifty 200 Stock Screener at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'=' * 80}\n")

    passed_stocks = []
    failed_count = 0

    for symbol in NIFTY_200_SYMBOLS:
        print(f"Checking {symbol}...", end=" ")
        passed, result = check_conditions(symbol)

        if passed:
            telegram_bot_sendtext(f'Investment Stock {symbol}')
            print("✓ PASSED")
            passed_stocks.append(result)
        else:
            print("✗ Failed")
            failed_count += 1

    print(f"\n{'=' * 80}")
    print(f"Screening Complete!")
    print(f"{'=' * 80}")
    print(f"Stocks Passed: {len(passed_stocks)}")
    print(f"Stocks Failed: {failed_count}")
    print(f"{'=' * 80}\n")

    if passed_stocks:
        print("\nStocks that passed all conditions:")
        print("-" * 80)
        df_results = pd.DataFrame(passed_stocks)
        print(df_results.to_string(index=False))

        # Save to CSV with timestamp
        filename = f"screener_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        df_results.to_csv(filename, index=False)
        print(f"\nResults saved to: {filename}")
    else:
        print("\nNo stocks passed all conditions.")

    print("\n" + "=" * 80 + "\n")


def schedule_screener():
    """Schedule the screener to run at 3:15 PM daily"""
    # Run immediately on start
    print("Running initial scan...")
    run_screener()

    # Schedule daily at 3:15 PM
    schedule.every().day.at("15:15").do(run_screener)

    print("\nScreener scheduled to run daily at 3:15 PM IST")
    print("Press Ctrl+C to stop\n")

    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute


if __name__ == "__main__":
    # Run immediately
    run_screener()

    # Uncomment below to enable daily scheduling
    # schedule_screener()