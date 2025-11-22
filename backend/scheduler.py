"""
Scheduler script to run data collection scripts at specified intervals
- angel_one_api.py: Every 5 minutes from 9 AM to 3:30 PM, Monday-Friday
- scape_market_news.py: Every hour from 9 AM to 3:30 PM, Monday-Friday
"""

import schedule
import time
import subprocess
import os
import logging
from datetime import datetime, time as dt_time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scheduler.log'),
        logging.StreamHandler()
    ]
)

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

def get_python_command():
    """Detect the correct Python command (python3 or python)"""
    import shutil
    for cmd in ['python3', 'python']:
        if shutil.which(cmd):
            return cmd
    # Fallback: try sys.executable
    import sys
    return sys.executable

def is_market_hours():
    """Check if current time is within market hours (9 AM to 3:30 PM IST) and weekday (Mon-Fri)"""
    # Use IST timezone for accurate market hours
    try:
        import pytz
        ist = pytz.timezone('Asia/Kolkata')
        now = datetime.now(ist)
    except ImportError:
        # Fallback to system time if pytz not available
        now = datetime.now()
        logging.warning("pytz not installed, using system timezone. Install with: pip install pytz")
    
    # Check if weekday (Monday=0, Friday=4)
    if now.weekday() >= 5:  # Saturday or Sunday
        return False
    
    current_time = now.time()
    market_open = dt_time(9, 0)  # 9:00 AM IST
    market_close = dt_time(15, 30)  # 3:30 PM IST
    
    return market_open <= current_time <= market_close

def run_angel_one_api():
    """Run angel_one_api.py script"""
    if not is_market_hours():
        logging.info("Outside market hours, skipping angel_one_api.py")
        return
    
    try:
        logging.info("Starting angel_one_api.py...")
        script_path = os.path.join(SCRIPT_DIR, "angel_one_api.py")
        python_cmd = get_python_command()
        
        # Run with --all flag to fetch all data
        result = subprocess.run(
            [python_cmd, script_path, "--all"],
            cwd=SCRIPT_DIR,
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )
        
        if result.returncode == 0:
            logging.info(f"✅ angel_one_api.py completed successfully")
            if result.stdout:
                logging.debug(f"Output: {result.stdout}")
        else:
            logging.error(f"❌ angel_one_api.py failed with return code {result.returncode}")
            if result.stderr:
                logging.error(f"Error: {result.stderr}")
    except subprocess.TimeoutExpired:
        logging.error("❌ angel_one_api.py timed out after 5 minutes")
    except Exception as e:
        logging.error(f"❌ Error running angel_one_api.py: {str(e)}")

def run_market_news_scraper():
    """Run scape_market_news.py script"""
    if not is_market_hours():
        logging.info("Outside market hours, skipping scape_market_news.py")
        return
    
    try:
        logging.info("Starting scape_market_news.py...")
        script_path = os.path.join(SCRIPT_DIR, "scape_market_news.py")
        python_cmd = get_python_command()
        
        result = subprocess.run(
            [python_cmd, script_path],
            cwd=SCRIPT_DIR,
            capture_output=True,
            text=True,
            timeout=600  # 10 minute timeout
        )
        
        if result.returncode == 0:
            logging.info(f"✅ scape_market_news.py completed successfully")
            if result.stdout:
                logging.debug(f"Output: {result.stdout}")
        else:
            logging.error(f"❌ scape_market_news.py failed with return code {result.returncode}")
            if result.stderr:
                logging.error(f"Error: {result.stderr}")
    except subprocess.TimeoutExpired:
        logging.error("❌ scape_market_news.py timed out after 10 minutes")
    except Exception as e:
        logging.error(f"❌ Error running scape_market_news.py: {str(e)}")

def run_nse_data_fetcher():
    """Run fetch_nse_data.py script"""
    if not is_market_hours():
        logging.info("Outside market hours, skipping fetch_nse_data.py")
        return
    
    try:
        logging.info("Starting fetch_nse_data.py...")
        script_path = os.path.join(SCRIPT_DIR, "fetch_nse_data.py")
        python_cmd = get_python_command()
        
        result = subprocess.run(
            [python_cmd, script_path],
            cwd=SCRIPT_DIR,
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )
        
        if result.returncode == 0:
            logging.info(f"✅ fetch_nse_data.py completed successfully")
            if result.stdout:
                logging.debug(f"Output: {result.stdout}")
        else:
            logging.error(f"❌ fetch_nse_data.py failed with return code {result.returncode}")
            if result.stderr:
                logging.error(f"Error: {result.stderr}")
    except subprocess.TimeoutExpired:
        logging.error("❌ fetch_nse_data.py timed out after 5 minutes")
    except Exception as e:
        logging.error(f"❌ Error running fetch_nse_data.py: {str(e)}")

def main():
    """Main scheduler loop"""
    logging.info("🚀 Starting scheduler service...")
    logging.info("Schedule:")
    logging.info("  - angel_one_api.py: Every 5 minutes (9 AM - 3:30 PM, Mon-Fri)")
    logging.info("  - scape_market_news.py: Every hour (9 AM - 3:30 PM, Mon-Fri)")
    logging.info("  - fetch_nse_data.py: Every 30 minutes (9 AM - 3:30 PM, Mon-Fri)")
    
    # Schedule angel_one_api.py every 5 minutes
    schedule.every(5).minutes.do(run_angel_one_api)
    
    # Schedule scape_market_news.py every hour at :00 minutes
    schedule.every().hour.at(":00").do(run_market_news_scraper)
    
    # Schedule fetch_nse_data.py every 30 minutes
    schedule.every(30).minutes.do(run_nse_data_fetcher)
    
    # Also run on startup if within market hours
    if is_market_hours():
        logging.info("Market hours detected, running initial tasks...")
        run_angel_one_api()
        run_nse_data_fetcher()
        # Only run news scraper if it's at the top of the hour
        if datetime.now().minute == 0:
            run_market_news_scraper()
    else:
        logging.info("Outside market hours, waiting for next market session...")
    
    # Keep the scheduler running
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        logging.info("🛑 Scheduler stopped by user")
    except Exception as e:
        logging.error(f"❌ Scheduler crashed: {str(e)}")
        raise
