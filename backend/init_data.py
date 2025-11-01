"""
Initialize data files with default/empty structure if they don't exist
This ensures the API doesn't crash when data files are missing
"""

import os
import json
from pathlib import Path

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

# Default/empty data structures
DEFAULT_DATA = {
    "top_gainers.json": {"count": 0, "gainers": [], "exchange": "NSE", "timestamp": None},
    "top_losers.json": {"count": 0, "losers": [], "exchange": "NSE", "timestamp": None},
    "put_call_ratio.json": {"status": "unavailable", "reason": "Data not yet fetched", "exchange": "NSE"},
    "index_quotes.json": {
        "NIFTY": {"status": "unavailable", "reason": "Data not yet fetched"},
        "BANKNIFTY": {"status": "unavailable", "reason": "Data not yet fetched"},
        "SENSEX": {"status": "unavailable", "reason": "Data not yet fetched"},
        "GOLDCOM": {"status": "unavailable", "reason": "Data not yet fetched"}
    }
}

def init_data_files():
    """Create data directory and initialize default data files if they don't exist"""
    # Ensure data directory exists
    Path(DATA_DIR).mkdir(parents=True, exist_ok=True)
    
    # Initialize each data file if it doesn't exist
    for filename, default_data in DEFAULT_DATA.items():
        filepath = os.path.join(DATA_DIR, filename)
        if not os.path.exists(filepath):
            print(f"Initializing {filename} with default data...")
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(default_data, f, ensure_ascii=False, indent=2)
            print(f"✅ Created {filename}")
        else:
            print(f"✓ {filename} already exists")

if __name__ == "__main__":
    print("Initializing data files...")
    init_data_files()
    print("✅ Data initialization complete")

