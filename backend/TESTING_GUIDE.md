# Backend API Testing Guide

This guide will help you test all the backend APIs separately before integrating with the frontend.

## 🚀 Quick Start

### Step 1: Start the Backend Server

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment (if exists)
source env/bin/activate  # Linux/Mac
# OR
env\Scripts\activate    # Windows

# Install dependencies (if not already installed)
pip install -r requirements.txt

# Start the server
python app.py
```

The server should start at: `http://localhost:8000`

### Step 2: Verify Server is Running

Open your browser and visit:
- **API Info**: http://localhost:8000
- **Health Check**: http://localhost:8000/health
- **API Documentation**: http://localhost:8000/docs (Swagger UI)
- **Alternative Docs**: http://localhost:8000/redoc

## 🧪 Testing Methods

### Method 1: Using the Test Script (Recommended)

```bash
# From the backend directory
python test_apis.py
```

This will:
- Test all 20+ endpoints
- Show success/failure for each test
- Display sample responses
- Provide a summary at the end

### Method 2: Using Swagger UI

1. Visit http://localhost:8000/docs
2. Click on any endpoint
3. Click "Try it out"
4. Enter parameters (if needed)
5. Click "Execute"
6. View the response

### Method 3: Using curl (Command Line)

```bash
# Health check
curl http://localhost:8000/health

# Market news (limit to 5 articles)
curl "http://localhost:8000/market-news?limit=5"

# Nifty data
curl "http://localhost:8000/nifty-data"

# Top gainers
curl "http://localhost:8000/top-gainers"

# Market overview
curl "http://localhost:8000/market-overview"
```

### Method 4: Using Postman/Insomnia

1. Import the collection (see below)
2. Set base URL to `http://localhost:8000`
3. Run requests individually

## 📋 Complete Endpoint List

### **Core Endpoints**

#### 1. Health Check
- **URL**: `GET /health`
- **Description**: Check if server is running
- **Parameters**: None
- **Example**: `curl http://localhost:8000/health`

#### 2. API Info
- **URL**: `GET /`
- **Description**: Get API information
- **Parameters**: None

---

### **News Endpoints**

#### 3. General Market News
- **URL**: `GET /market-news`
- **Parameters**: `limit` (optional, default: 20)
- **Example**: `curl "http://localhost:8000/market-news?limit=10"`

#### 4. AI Summarized News
- **URL**: `GET /latest-summaries`
- **Parameters**: `limit` (optional, default: 10)
- **Example**: `curl "http://localhost:8000/latest-summaries?limit=5"`

#### 5. Nifty News
- **URL**: `GET /nifty-news`
- **Parameters**: `limit` (optional, default: 10)
- **Example**: `curl "http://localhost:8000/nifty-news?limit=10"`

#### 6. Sensex News
- **URL**: `GET /sensex-news`
- **Parameters**: `limit` (optional, default: 10)
- **Example**: `curl "http://localhost:8000/sensex-news?limit=10"`

#### 7. Gold Market News
- **URL**: `GET /gold-news`
- **Parameters**: `limit` (optional, default: 10)
- **Example**: `curl "http://localhost:8000/gold-news?limit=10"`

#### 8. Futures News
- **URL**: `GET /futures-news`
- **Parameters**: `limit` (optional, default: 10)
- **Example**: `curl "http://localhost:8000/futures-news?limit=10"`

#### 9. Company News
- **URL**: `GET /company-news/{symbol}`
- **Parameters**: `limit` (optional, default: 20)
- **Example**: 
  ```bash
  curl "http://localhost:8000/company-news/RELIANCE?limit=10"
  curl "http://localhost:8000/company-news/TCS?limit=10"
  ```

---

### **Market Data Endpoints**

#### 10. Nifty 50 Data
- **URL**: `GET /nifty-data`
- **Description**: Live Nifty 50 data
- **Example**: `curl http://localhost:8000/nifty-data`

#### 11. Sensex Data
- **URL**: `GET /sensex-data`
- **Description**: Live Sensex data
- **Example**: `curl http://localhost:8000/sensex-data`

#### 12. Gold Data
- **URL**: `GET /gold-data`
- **Description**: Live Gold futures data
- **Example**: `curl http://localhost:8000/gold-data`

#### 13. Futures Data
- **URL**: `GET /futures-data/{symbol}`
- **Description**: Live futures data for a symbol
- **Example**: 
  ```bash
  curl "http://localhost:8000/futures-data/NIFTY"
  ```

#### 14. Top Gainers
- **URL**: `GET /top-gainers`
- **Parameters**: `exchange` (optional, default: NSE)
- **Example**: `curl "http://localhost:8000/top-gainers?exchange=NSE"`

#### 15. Top Losers
- **URL**: `GET /top-losers`
- **Parameters**: `exchange` (optional, default: NSE)
- **Example**: `curl "http://localhost:8000/top-losers?exchange=NSE"`

#### 16. Market Overview
- **URL**: `GET /market-overview`
- **Description**: Comprehensive market data
- **Example**: `curl http://localhost:8000/market-overview`

#### 17. Market Sentiment
- **URL**: `GET /market-sentiment`
- **Description**: Market sentiment analysis
- **Example**: `curl http://localhost:8000/market-sentiment`

---

### **AI & Processing Endpoints**

#### 18. Batch Summarization
- **URL**: `POST /batch-summarize`
- **Body**: JSON with `texts` (array) and `max_length` (int)
- **Example**:
  ```bash
  curl -X POST "http://localhost:8000/batch-summarize" \
    -H "Content-Type: application/json" \
    -d '{
      "texts": [
        "Long text 1",
        "Long text 2"
      ],
      "max_length": 100
    }'
  ```

---

### **Cache Management Endpoints**

#### 19. Clear Cache
- **URL**: `POST /cache/clear`
- **Description**: Clear all cached data
- **Example**: 
  ```bash
  curl -X POST "http://localhost:8000/cache/clear"
  ```

#### 20. Cache Statistics
- **URL**: `GET /cache/stats`
- **Description**: Get cache statistics
- **Example**: `curl http://localhost:8000/cache/stats`

---

## 🎯 Sample Test Workflow

### Basic Functionality Test

```bash
# 1. Test health
curl http://localhost:8000/health

# 2. Test news
curl "http://localhost:8000/market-news?limit=3"

# 3. Test market data
curl http://localhost:8000/nifty-data

# 4. Test overview
curl http://localhost:8000/market-overview
```

### Advanced Testing with Python

```python
import requests

# Test single endpoint
response = requests.get('http://localhost:8000/nifty-data')
print(response.json())

# Test with error handling
try:
    response = requests.get('http://localhost:8000/top-gainers', timeout=5)
    if response.status_code == 200:
        data = response.json()
        print(f"Found {data['count']} gainers")
        for stock in data['gainers'][:3]:
            print(f"  - {stock['symbol']}: {stock['changePercent']}%")
except Exception as e:
    print(f"Error: {e}")
```

### JavaScript/Node.js Testing

```javascript
const fetch = require('node-fetch');

async function testAPI() {
    try {
        const response = await fetch('http://localhost:8000/market-news?limit=5');
        const data = await response.json();
        console.log(`Found ${data.count} articles`);
    } catch (error) {
        console.error('Error:', error);
    }
}

testAPI();
```

---

## 🔍 Common Issues & Solutions

### Issue 1: Connection Refused
**Error**: `Cannot connect to server`
**Solution**: 
1. Ensure backend is running: `python app.py`
2. Check if port 8000 is available
3. Verify firewall settings

### Issue 2: Empty Responses
**Problem**: Endpoints return empty data
**Solutions**:
1. Check environment variables in `.env` file
2. Verify API keys are correct
3. Check API rate limits (Finnhub, Angel One)
4. Review console for error messages

### Issue 3: Mock Data Returned
**Problem**: Always getting mock/sample data
**Solutions**:
1. Check Angel One API credentials
2. Verify API keys in `.env` file
3. Test API connectivity manually
4. Review `angel_one_api.py` implementation

### Issue 4: CORS Errors
**Problem**: Frontend can't access backend
**Solution**: 
1. Check CORS_ORIGINS in `.env`
2. Should include `http://localhost:3000`
3. Restart server after changes

---

## 📊 Expected Response Formats

### Market News Response
```json
{
  "count": 10,
  "articles": [
    {
      "id": "article_id",
      "headline": "News headline",
      "summary": "Article summary",
      "source": "Source name",
      "url": "article_url",
      "datetime": 1678886400
    }
  ]
}
```

### Market Data Response
```json
{
  "symbol": "NIFTY 50",
  "price": 19500.25,
  "change": 150.75,
  "changePercent": 0.78,
  "high": 19600.50,
  "low": 19400.75,
  "open": 19450.25,
  "volume": 125000000,
  "timestamp": "2024-01-25T12:00:00"
}
```

### Top Gainers Response
```json
{
  "count": 5,
  "gainers": [
    {
      "symbol": "RELIANCE",
      "price": 2450.50,
      "change": 45.25,
      "changePercent": 1.88
    }
  ],
  "exchange": "NSE"
}
```

---

## ✅ Testing Checklist

Before integrating with frontend, verify:

- [ ] Server starts without errors
- [ ] All health endpoints work
- [ ] News endpoints return articles
- [ ] Market data endpoints return data
- [ ] AI summarization works
- [ ] Caching functions correctly
- [ ] Error handling works properly
- [ ] Response times are acceptable (< 2 seconds)
- [ ] No console errors
- [ ] API documentation accessible at /docs

---

## 🚀 Next Steps

Once backend testing is complete:

1. **Update Frontend Environment**: Add `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`
2. **Update API Calls**: Modify `src/utils/api.js` to use backend
3. **Test Integration**: Verify frontend calls backend correctly
4. **Deploy**: Set up production environment

---

**Need Help?**
- Check console logs for errors
- Review `API_DOCUMENTATION.md`
- Test individual endpoints with curl
- Use Swagger UI for interactive testing
- Contact: stpatill@gmail.com

