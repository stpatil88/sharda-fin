#!/usr/bin/env python3
"""
Test script to verify index-quote endpoint
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_index_quote(index):
    """Test a single index quote endpoint"""
    url = f"{BASE_URL}/index-quote/{index}"
    print(f"\n{'='*60}")
    print(f"Testing: GET {url}")
    print(f"{'='*60}")
    
    try:
        response = requests.get(url, timeout=5)
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n[SUCCESS] Response:")
            print(json.dumps(data, indent=2))
            return data
        else:
            print(f"\n[ERROR] Status: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except requests.exceptions.ConnectionError:
        print(f"\n[ERROR] Cannot connect to backend at {BASE_URL}")
        print("Make sure backend is running: python app.py")
        return None
    except Exception as e:
        print(f"\n[ERROR] Unexpected error: {e}")
        return None

def test_all_indexes():
    """Test all index endpoints"""
    indexes = ["NIFTY", "BANKNIFTY", "SENSEX", "GOLD"]
    
    print("\n" + "="*60)
    print("TESTING ALL INDEX QUOTE ENDPOINTS")
    print("="*60)
    
    results = {}
    for index in indexes:
        result = test_index_quote(index)
        results[index] = result
    
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    for index, result in results.items():
        if result and result.get("status") == "ok":
            print(f"[OK] {index}: Price={result.get('price')}, Change={result.get('change')}%")
        elif result:
            print(f"[WARN] {index}: {result.get('status')} - {result.get('reason', 'N/A')}")
        else:
            print(f"[FAIL] {index}: Failed")

if __name__ == "__main__":
    # Test individual endpoints
    test_index_quote("NIFTY")
    
    # Test all
    test_all_indexes()

