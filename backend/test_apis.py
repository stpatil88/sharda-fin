#!/usr/bin/env python3
"""
Test script for Sharada Financial Services Backend API
Run this script to test all API endpoints
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_header(text):
    print(f"\n{Colors.BLUE}{'='*70}{Colors.END}")
    print(f"{Colors.BLUE}{text}{Colors.END}")
    print(f"{Colors.BLUE}{'='*70}{Colors.END}")

def print_success(msg):
    print(f"{Colors.GREEN}✓ {msg}{Colors.END}")

def print_error(msg):
    print(f"{Colors.RED}✗ {msg}{Colors.END}")

def print_info(msg):
    print(f"{Colors.YELLOW}→ {msg}{Colors.END}")

def test_endpoint(endpoint, method="GET", params=None, data=None, description=None):
    """Test a single API endpoint"""
    url = f"{BASE_URL}{endpoint}"
    
    if description:
        print(f"\n{Colors.YELLOW}Testing: {description}{Colors.END}")
    else:
        print(f"\n{Colors.YELLOW}Testing: {method} {endpoint}{Colors.END}")
    
    try:
        if method == "GET":
            response = requests.get(url, params=params, timeout=10)
        elif method == "POST":
            response = requests.post(url, json=data, headers={'Content-Type': 'application/json'}, timeout=10)
        else:
            print_error(f"Unsupported method: {method}")
            return False
        
        # Print status
        if response.status_code == 200:
            print_success(f"Status: {response.status_code}")
            
            # Parse and display response
            result = response.json()
            
            # Format output based on endpoint type
            if 'count' in result:
                print_info(f"Count: {result['count']}")
            
            if 'status' in result:
                print_info(f"Status: {result['status']}")
            
            if 'articles' in result:
                if len(result['articles']) > 0:
                    print_info(f"Sample article: {result['articles'][0].get('headline', 'N/A')[:60]}...")
            
            if 'gainers' in result:
                if len(result['gainers']) > 0:
                    print_info(f"Sample gainer: {result['gainers'][0].get('symbol', 'N/A')}")
            
            if 'price' in result:
                print_info(f"Price: {result['price']}")
            
            # Show full response for debugging (first 200 chars)
            response_str = json.dumps(result, indent=2)
            if len(response_str) > 200:
                print(f"\nResponse preview:\n{response_str[:200]}...")
            else:
                print(f"\nResponse:\n{response_str}")
            
            return True
        else:
            print_error(f"Status: {response.status_code}")
            print_error(f"Error: {response.text[:200]}")
            return False
            
    except requests.exceptions.ConnectionError:
        print_error("Cannot connect to server. Is the backend running?")
        print_info("Start the backend with: python app.py")
        return False
    except requests.exceptions.Timeout:
        print_error("Request timed out")
        return False
    except Exception as e:
        print_error(f"Unexpected error: {str(e)}")
        return False

def main():
    """Main test function"""
    print_header("Sharada Financial Services - Backend API Test Suite")
    print(f"\nTarget Server: {BASE_URL}")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    test_results = []
    
    # Test 1: Health Check
    print_header("1. Health & Status Endpoints")
    result = test_endpoint("/health", description="Health Check")
    test_results.append(("Health Check", result))
    
    # Test 2: Root endpoint
    result = test_endpoint("/", description="Root Endpoint")
    test_results.append(("Root Endpoint", result))
    
    # Test 3: Market News
    print_header("2. Market News Endpoints")
    result = test_endpoint("/market-news", params={"limit": 5}, description="General Market News")
    test_results.append(("General Market News", result))
    
    result = test_endpoint("/latest-summaries", params={"limit": 3}, description="AI Summarized News")
    test_results.append(("Summarized News", result))
    
    # Test 4: Market-Specific News
    print_header("3. Market-Specific News")
    result = test_endpoint("/nifty-news", params={"limit": 5}, description="Nifty 50 News")
    test_results.append(("Nifty News", result))
    
    result = test_endpoint("/sensex-news", params={"limit": 5}, description="Sensex News")
    test_results.append(("Sensex News", result))
    
    result = test_endpoint("/gold-news", params={"limit": 5}, description="Gold Market News")
    test_results.append(("Gold News", result))
    
    result = test_endpoint("/futures-news", params={"limit": 5}, description="Futures News")
    test_results.append(("Futures News", result))
    
    # Test 5: Company News
    print_header("4. Company News")
    result = test_endpoint("/company-news/RELIANCE", params={"limit": 5}, description="Reliance News")
    test_results.append(("Company News", result))
    
    # Test 6: Market Data
    print_header("5. Angel One Market Data")
    result = test_endpoint("/nifty-data", description="Nifty 50 Data")
    test_results.append(("Nifty Data", result))
    
    result = test_endpoint("/sensex-data", description="Sensex Data")
    test_results.append(("Sensex Data", result))
    
    result = test_endpoint("/gold-data", description="Gold Data")
    test_results.append(("Gold Data", result))
    
    result = test_endpoint("/top-gainers", params={"exchange": "NSE"}, description="Top Gainers")
    test_results.append(("Top Gainers", result))
    
    result = test_endpoint("/top-losers", params={"exchange": "NSE"}, description="Top Losers")
    test_results.append(("Top Losers", result))
    
    # Test 7: Market Overview
    print_header("6. Market Overview")
    result = test_endpoint("/market-overview", description="Comprehensive Market Overview")
    test_results.append(("Market Overview", result))
    
    result = test_endpoint("/market-sentiment", description="Market Sentiment")
    test_results.append(("Market Sentiment", result))
    
    # Test 8: Cache Management
    print_header("7. Cache Management")
    result = test_endpoint("/cache/stats", description="Cache Statistics")
    test_results.append(("Cache Stats", result))
    
    # Test 9: Batch Summarization
    print_header("8. AI Processing")
    batch_data = {
        "texts": [
            "The stock market showed strong gains today as technology stocks rallied.",
            "Economic indicators suggest continued growth in the manufacturing sector."
        ],
        "max_length": 100
    }
    result = test_endpoint("/batch-summarize", method="POST", data=batch_data, description="Batch Summarization")
    test_results.append(("Batch Summarization", result))
    
    # Print Summary
    print_header("Test Summary")
    total = len(test_results)
    passed = sum(1 for _, result in test_results if result)
    failed = total - passed
    
    print(f"\nTotal Tests: {total}")
    print_success(f"Passed: {passed}")
    if failed > 0:
        print_error(f"Failed: {failed}")
    
    print(f"\n{'='*70}\n")
    
    # Show failed tests
    if failed > 0:
        print(f"{Colors.RED}Failed Tests:{Colors.END}")
        for name, result in test_results:
            if not result:
                print_error(f"  - {name}")
    
    print(f"\nCompleted: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"\nIf tests fail, ensure the backend is running:")
    print(f"  1. cd backend")
    print(f"  2. python app.py")
    print(f"  3. Server should be available at http://localhost:8000")

if __name__ == "__main__":
    main()

