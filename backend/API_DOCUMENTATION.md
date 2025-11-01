# API Documentation - Sharada Financial Services Backend

## 🚀 **Enhanced API Endpoints**

### **Core Endpoints**

#### **1. Health & Status**
- **`GET /`** - API information and status
- **`GET /health`** - Health check endpoint

#### **2. Market News**
- **`GET /market-news?limit=20`** - General market news
- **`GET /latest-summaries?limit=10`** - AI-summarized news

### **📈 New Market-Specific News Endpoints**

#### **3. Nifty & Sensex News**
- **`GET /nifty-news?limit=10`** - Nifty 50 related news
- **`GET /sensex-news?limit=10`** - Sensex related news

#### **4. Commodity & Futures News**
- **`GET /gold-news?limit=10`** - Gold market news
- **`GET /futures-news?limit=10`** - Futures & derivatives news

#### **5. Company-Specific News**
- **`GET /company-news/{symbol}?limit=20`** - News for specific company
  - Example: `/company-news/RELIANCE`
  - Example: `/company-news/TCS`

### **📊 Angel One SmartAPI Integration**

#### **6. Market Data**
- **`GET /nifty-data`** - Live Nifty 50 data
- **`GET /sensex-data`** - Live Sensex data
- **`GET /gold-data`** - Live Gold futures data
- **`GET /futures-data/{symbol}`** - Live futures data for symbol

#### **7. Top Performers**
- **`GET /top-gainers?exchange=NSE`** - Top gaining stocks
- **`GET /top-losers?exchange=NSE`** - Top losing stocks

#### **8. Market Overview**
- **`GET /market-overview`** - Comprehensive market data
- **`GET /market-sentiment`** - Market sentiment analysis

### **🤖 AI & Processing Endpoints**

#### **9. Summarization**
- **`POST /batch-summarize`** - Batch text summarization
  - Body: `{"texts": ["text1", "text2"], "max_length": 120}`

### **⚡ Cache Management**

#### **10. Cache Control**
- **`POST /cache/clear`** - Clear all cache
- **`GET /cache/stats`** - Cache statistics

---

## 🔧 **API Features**

### **✅ Implemented Features:**

1. **Market-Specific News**
   - Nifty 50 news filtering
   - Sensex news filtering
   - Gold market news
   - Futures & derivatives news

2. **Angel One SmartAPI Integration**
   - Live Nifty/Sensex data
   - Top gainers/losers from NSE
   - Gold futures data
   - Futures market data

3. **Enhanced News Processing**
   - Company-specific news
   - Market sentiment analysis
   - Batch summarization
   - AI-powered news summaries

4. **Performance Optimization**
   - Response caching with TTL
   - Cache management endpoints
   - Optimized API calls

5. **Error Handling**
   - Comprehensive error handling
   - Fallback mechanisms
   - Mock data for testing

---

## 📋 **Response Formats**

### **News Endpoints Response:**
```json
{
  "count": 10,
  "articles": [
    {
      "id": "article_id",
      "headline": "News headline",
      "summary": "Article summary",
      "source": "News source",
      "url": "Article URL",
      "datetime": 1678886400,
      "category": "Nifty",
      "related_symbols": ["NIFTY"]
    }
  ],
  "category": "Nifty"
}
```

### **Market Data Response:**
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

### **Top Gainers/Losers Response:**
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

### **Market Overview Response:**
```json
{
  "timestamp": "2024-01-25T12:00:00",
  "indices": {
    "nifty": { /* Nifty data */ },
    "sensex": { /* Sensex data */ }
  },
  "commodities": {
    "gold": { /* Gold data */ }
  },
  "futures": {
    "nifty_futures": { /* Futures data */ }
  },
  "top_gainers": [ /* Top gainers */ ],
  "top_losers": [ /* Top losers */ ]
}
```

---

## ⚙️ **Configuration**

### **Environment Variables:**
```env
# Angel One SmartAPI
API_KEY=tczFBIhY
SECRET_KEY=cf6cd4ba-d098-4136-9b7b-186ae26540d3
TOTP=RD4OPMKWDFKAV6TW5WEMVLEGMU

# Finnhub API
FINNHUB_API_KEY=d3u6ft9r01qvr0dlmqq0d3u6ft9r01qvr0dlmqqg

# Hugging Face
HF_TOKEN=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

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=True
CORS_ORIGINS=http://localhost:3000
```

### **Cache TTL Settings:**
- **Market Data**: 60 seconds
- **News**: 300 seconds (5 minutes)
- **Summaries**: 600 seconds (10 minutes)
- **Company News**: 300 seconds (5 minutes)
- **Market Overview**: 60 seconds

---

## 🚀 **Usage Examples**

### **Get Nifty News:**
```bash
curl "http://localhost:8000/nifty-news?limit=5"
```

### **Get Top Gainers:**
```bash
curl "http://localhost:8000/top-gainers?exchange=NSE"
```

### **Get Company News:**
```bash
curl "http://localhost:8000/company-news/RELIANCE?limit=10"
```

### **Get Market Overview:**
```bash
curl "http://localhost:8000/market-overview"
```

### **Batch Summarize:**
```bash
curl -X POST "http://localhost:8000/batch-summarize" \
  -H "Content-Type: application/json" \
  -d '{"texts": ["Long text 1", "Long text 2"], "max_length": 100}'
```

---

## 🔒 **Security & Rate Limiting**

- **CORS**: Configured for frontend domains
- **Rate Limiting**: 60 requests per minute (configurable)
- **API Keys**: Required for external services
- **Error Handling**: Graceful fallbacks for API failures

---

## 📊 **Performance**

- **Caching**: In-memory cache with TTL
- **Batch Processing**: Efficient batch operations
- **Mock Data**: Fallback data for testing
- **Optimized Queries**: Reduced API calls

---

## 🎯 **Next Steps**

1. **Real-time Data**: WebSocket integration for live updates
2. **User Authentication**: JWT-based authentication
3. **Database Integration**: Persistent data storage
4. **Advanced Analytics**: Technical indicators and analysis
5. **Mobile API**: Optimized endpoints for mobile apps

---

**API Version**: 1.0.0  
**Last Updated**: January 2024  
**Contact**: stpatill@gmail.com
# API Documentation - Sharada Financial Services Backend

## 🚀 **Enhanced API Endpoints**

### **Core Endpoints**

#### **1. Health & Status**
- **`GET /`** - API information and status
- **`GET /health`** - Health check endpoint

#### **2. Market News**
- **`GET /market-news?limit=20`** - General market news
- **`GET /latest-summaries?limit=10`** - AI-summarized news

### **📈 New Market-Specific News Endpoints**

#### **3. Nifty & Sensex News**
- **`GET /nifty-news?limit=10`** - Nifty 50 related news
- **`GET /sensex-news?limit=10`** - Sensex related news

#### **4. Commodity & Futures News**
- **`GET /gold-news?limit=10`** - Gold market news
- **`GET /futures-news?limit=10`** - Futures & derivatives news

#### **5. Company-Specific News**
- **`GET /company-news/{symbol}?limit=20`** - News for specific company
  - Example: `/company-news/RELIANCE`
  - Example: `/company-news/TCS`

### **📊 Angel One SmartAPI Integration**

#### **6. Market Data**
- **`GET /nifty-data`** - Live Nifty 50 data
- **`GET /sensex-data`** - Live Sensex data
- **`GET /gold-data`** - Live Gold futures data
- **`GET /futures-data/{symbol}`** - Live futures data for symbol

#### **7. Top Performers**
- **`GET /top-gainers?exchange=NSE`** - Top gaining stocks
- **`GET /top-losers?exchange=NSE`** - Top losing stocks

#### **8. Market Overview**
- **`GET /market-overview`** - Comprehensive market data
- **`GET /market-sentiment`** - Market sentiment analysis

### **🤖 AI & Processing Endpoints**

#### **9. Summarization**
- **`POST /batch-summarize`** - Batch text summarization
  - Body: `{"texts": ["text1", "text2"], "max_length": 120}`

### **⚡ Cache Management**

#### **10. Cache Control**
- **`POST /cache/clear`** - Clear all cache
- **`GET /cache/stats`** - Cache statistics

---

## 🔧 **API Features**

### **✅ Implemented Features:**

1. **Market-Specific News**
   - Nifty 50 news filtering
   - Sensex news filtering
   - Gold market news
   - Futures & derivatives news

2. **Angel One SmartAPI Integration**
   - Live Nifty/Sensex data
   - Top gainers/losers from NSE
   - Gold futures data
   - Futures market data

3. **Enhanced News Processing**
   - Company-specific news
   - Market sentiment analysis
   - Batch summarization
   - AI-powered news summaries

4. **Performance Optimization**
   - Response caching with TTL
   - Cache management endpoints
   - Optimized API calls

5. **Error Handling**
   - Comprehensive error handling
   - Fallback mechanisms
   - Mock data for testing

---

## 📋 **Response Formats**

### **News Endpoints Response:**
```json
{
  "count": 10,
  "articles": [
    {
      "id": "article_id",
      "headline": "News headline",
      "summary": "Article summary",
      "source": "News source",
      "url": "Article URL",
      "datetime": 1678886400,
      "category": "Nifty",
      "related_symbols": ["NIFTY"]
    }
  ],
  "category": "Nifty"
}
```

### **Market Data Response:**
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

### **Top Gainers/Losers Response:**
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

### **Market Overview Response:**
```json
{
  "timestamp": "2024-01-25T12:00:00",
  "indices": {
    "nifty": { /* Nifty data */ },
    "sensex": { /* Sensex data */ }
  },
  "commodities": {
    "gold": { /* Gold data */ }
  },
  "futures": {
    "nifty_futures": { /* Futures data */ }
  },
  "top_gainers": [ /* Top gainers */ ],
  "top_losers": [ /* Top losers */ ]
}
```

---

## ⚙️ **Configuration**

### **Environment Variables:**
```env
# Angel One SmartAPI
API_KEY=tczFBIhY
SECRET_KEY=cf6cd4ba-d098-4136-9b7b-186ae26540d3
TOTP=RD4OPMKWDFKAV6TW5WEMVLEGMU

# Finnhub API
FINNHUB_API_KEY=d3u6ft9r01qvr0dlmqq0d3u6ft9r01qvr0dlmqqg

# Hugging Face
HF_TOKEN=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

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=True
CORS_ORIGINS=http://localhost:3000
```

### **Cache TTL Settings:**
- **Market Data**: 60 seconds
- **News**: 300 seconds (5 minutes)
- **Summaries**: 600 seconds (10 minutes)
- **Company News**: 300 seconds (5 minutes)
- **Market Overview**: 60 seconds

---

## 🚀 **Usage Examples**

### **Get Nifty News:**
```bash
curl "http://localhost:8000/nifty-news?limit=5"
```

### **Get Top Gainers:**
```bash
curl "http://localhost:8000/top-gainers?exchange=NSE"
```

### **Get Company News:**
```bash
curl "http://localhost:8000/company-news/RELIANCE?limit=10"
```

### **Get Market Overview:**
```bash
curl "http://localhost:8000/market-overview"
```

### **Batch Summarize:**
```bash
curl -X POST "http://localhost:8000/batch-summarize" \
  -H "Content-Type: application/json" \
  -d '{"texts": ["Long text 1", "Long text 2"], "max_length": 100}'
```

---

## 🔒 **Security & Rate Limiting**

- **CORS**: Configured for frontend domains
- **Rate Limiting**: 60 requests per minute (configurable)
- **API Keys**: Required for external services
- **Error Handling**: Graceful fallbacks for API failures

---

## 📊 **Performance**

- **Caching**: In-memory cache with TTL
- **Batch Processing**: Efficient batch operations
- **Mock Data**: Fallback data for testing
- **Optimized Queries**: Reduced API calls

---

## 🎯 **Next Steps**

1. **Real-time Data**: WebSocket integration for live updates
2. **User Authentication**: JWT-based authentication
3. **Database Integration**: Persistent data storage
4. **Advanced Analytics**: Technical indicators and analysis
5. **Mobile API**: Optimized endpoints for mobile apps

---

**API Version**: 1.0.0  
**Last Updated**: January 2024  
**Contact**: stpatill@gmail.com
>>>>>>> 756fc543ca08e67528a808aa3a8621db44ab0a9e
