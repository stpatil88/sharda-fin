# Frontend-Backend Integration Guide

This guide explains how to connect your Next.js frontend to the FastAPI backend.

## 📊 Current State

### Backend (FastAPI)
- **Status**: ✅ Implemented with 20+ endpoints
- **URL**: http://localhost:8000
- **Features**: News, Market Data, AI Summarization, Caching
- **Documentation**: http://localhost:8000/docs

### Frontend (Next.js)
- **Status**: ⚠️ Not connected to backend
- **Current Behavior**: Uses external APIs directly (Finnhub, GNews, NewsAPI)
- **Location**: `src/utils/api.js` has mock data

## 🔗 Integration Steps

### Step 1: Environment Configuration

**Create/Update `.env.local` in root directory:**

```env
# Backend URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Keep existing API keys (for fallback)
NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_key
NEXT_PUBLIC_GNEWS_API_KEY=your_gnews_key
```

### Step 2: Update API Configuration

**Modify `src/utils/api.js`:**

```javascript
import axios from 'axios';
import { API_CONFIG, ENDPOINTS, CACHE_DURATION, STORAGE_KEYS } from './constants';

// Backend base URL
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Create backend client
const backendClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Existing apiClient for external APIs
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ... keep existing configuration ...

// Updated marketDataAPI
export const marketDataAPI = {
  getMarketData: async (symbol) => {
    const cacheKey = `${STORAGE_KEYS.MARKET_DATA_CACHE}_${symbol}`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Try backend first
      const response = await backendClient.get('/nifty-data');
      const data = response.data;
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Backend error, trying fallback:', error);
      
      // Fallback to external API
      try {
        const response = await apiClient.get(
          `${API_CONFIG.FINNHUB_BASE_URL}${ENDPOINTS.MARKET_DATA}`,
          { params: { symbol: `${symbol}.NSE` } }
        );
        
        const data = response.data;
        setCachedData(cacheKey, data);
        return data;
      } catch (fallbackError) {
        console.error('All APIs failed');
        // Return mock data as last resort
        return {
          c: 19500,
          d: 150,
          dp: 0.78,
          h: 19600,
          l: 19400,
          o: 19450,
          pc: 19350,
        };
      }
    }
  },

  getTopGainers: async () => {
    try {
      const response = await backendClient.get('/top-gainers?exchange=NSE');
      return response.data.gainers || [];
    } catch (error) {
      console.error('Error fetching gainers:', error);
      // Mock fallback
      return [
        { symbol: 'RELIANCE', price: 2450, change: 45, changePercent: 1.87 },
        { symbol: 'TCS', price: 3850, change: 38, changePercent: 1.00 },
      ];
    }
  },

  getTopLosers: async () => {
    try {
      const response = await backendClient.get('/top-losers?exchange=NSE');
      return response.data.losers || [];
    } catch (error) {
      console.error('Error fetching losers:', error);
      // Mock fallback
      return [
        { symbol: 'ADANIPORTS', price: 850, change: -25, changePercent: -2.86 },
      ];
    }
  },

  getFIIDIIData: async () => {
    // Mock data - backend doesn't have this endpoint yet
    return {
      fii: { net: 2500, buy: 5000, sell: 2500 },
      dii: { net: 1200, buy: 3000, sell: 1800 },
      date: new Date().toISOString(),
    };
  },
};

// Updated newsAPI
export const newsAPI = {
  getMarketNews: async (limit = 10) => {
    const cacheKey = `${STORAGE_KEYS.NEWS_CACHE}_market`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Try backend first
      const response = await backendClient.get(`/market-news?limit=${limit}`);
      const articles = response.data.articles || [];
      
      // Transform backend format to frontend format
      const transformed = articles.map(article => ({
        title: article.headline,
        description: article.summary,
        source: { name: article.source },
        publishedAt: new Date(article.datetime * 1000).toISOString(),
        url: article.url,
      }));
      
      setCachedData(cacheKey, transformed);
      return transformed;
    } catch (error) {
      console.error('Backend error, trying fallback:', error);
      
      // Fallback to external APIs...
      // (keep existing fallback logic)
    }
  },
};

// ... rest of the file remains the same ...
```

### Step 3: Update Constants (Optional)

**Add backend URL to `src/utils/constants.js`:**

```javascript
export const API_CONFIG = {
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
  FINNHUB_BASE_URL: 'https://finnhub.io/api/v1',
  // ... rest of config
};
```

### Step 4: Test the Integration

**Start both servers:**

```bash
# Terminal 1: Backend
cd backend
python app.py

# Terminal 2: Frontend
cd ..
npm run dev
```

**Test in browser:**

1. Visit http://localhost:3000
2. Open browser console (F12)
3. Check network tab for API calls
4. Verify data is coming from backend

## 🔄 Development Workflow

### Running Both Servers

**Option 1: Separate Terminals**

```bash
# Terminal 1 (Backend)
cd backend && python app.py

# Terminal 2 (Frontend)  
cd . && npm run dev
```

**Option 2: Use Concurrently**

Install concurrently:
```bash
npm install -g concurrently
```

Create `scripts/start-dev.sh`:
```bash
#!/bin/bash
concurrently \
  "cd backend && python app.py" \
  "npm run dev"
```

Run: `bash scripts/start-dev.sh`

### Building for Production

```bash
# Build frontend
npm run build

# Start production backend
cd backend
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4

# Serve frontend
npm start
```

## 🎯 Backend Features Overview

### News Endpoints
- ✅ `/market-news` - General market news
- ✅ `/nifty-news` - Nifty 50 news
- ✅ `/sensex-news` - Sensex news
- ✅ `/gold-news` - Gold market news
- ✅ `/company-news/{symbol}` - Company-specific news

### Market Data Endpoints
- ✅ `/nifty-data` - Live Nifty data
- ✅ `/sensex-data` - Live Sensex data
- ✅ `/top-gainers` - Top gaining stocks
- ✅ `/top-losers` - Top losing stocks
- ✅ `/market-overview` - Comprehensive data

### Processing Endpoints
- ✅ `/latest-summaries` - AI summaries
- ✅ `/batch-summarize` - Batch processing
- ✅ `/cache/clear` - Cache management

## 🐛 Troubleshooting

### CORS Errors

**Problem**: Frontend can't access backend

**Solution**: Update `backend/.env`:
```env
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Then restart backend.

### Empty Responses

**Problem**: Endpoints return empty data

**Causes**:
1. Backend not running
2. Wrong environment variables
3. API key issues
4. CORS blocking requests

**Solution**: Check console logs in both browser and backend terminal.

### Network Errors

**Problem**: Connection refused

**Check**:
1. Backend is running on port 8000
2. No firewall blocking
3. Frontend points to correct URL
4. Both servers on same network

## 📊 Testing Integration

### Quick Test

```bash
# Test backend
curl http://localhost:8000/health

# Test from frontend context
# Open browser console and run:
fetch('http://localhost:8000/market-news?limit=3')
  .then(r => r.json())
  .then(console.log)
```

### Comprehensive Test

Run the test script:
```bash
cd backend
python test_apis.py
```

### Frontend Testing

1. Check browser console for errors
2. Verify network tab shows backend calls
3. Test each feature (news, market data, etc.)
4. Check caching behavior

## 📝 Environment Variables

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_FINNHUB_API_KEY=your_key
NEXT_PUBLIC_GNEWS_API_KEY=your_key
```

### Backend (`backend/.env`)
```env
API_KEY=your_angel_one_key
SECRET_KEY=your_angel_one_secret
TOTP=your_angel_one_totp
FINNHUB_API_KEY=your_finnhub_key
HF_TOKEN=your_huggingface_token
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:3000
```

## 🚀 Production Deployment

### Backend Deployment

1. Set environment variables on server
2. Use production database
3. Set up SSL/TLS
4. Configure CORS for production domain

### Frontend Deployment

1. Set `NEXT_PUBLIC_BACKEND_URL` to production URL
2. Build: `npm run build`
3. Deploy to Vercel/Netlify/etc.
4. Update backend CORS to allow frontend domain

### Example Production Config

**Frontend `.env.production`:**
```env
NEXT_PUBLIC_BACKEND_URL=https://api.shardafin.com
```

**Backend `.env` (production):**
```env
CORS_ORIGINS=https://shardafin.com,https://www.shardafin.com
```

## ✅ Integration Checklist

- [ ] Backend server starts successfully
- [ ] Frontend can reach backend (test `/health`)
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] API calls updated in frontend
- [ ] Fallback mechanisms work
- [ ] Error handling in place
- [ ] Caching working properly
- [ ] Performance acceptable
- [ ] No console errors

## 📚 Additional Resources

- **Backend API Docs**: http://localhost:8000/docs
- **Testing Guide**: `backend/TESTING_GUIDE.md`
- **Project Analysis**: `PROJECT_ANALYSIS.md`
- **Backend README**: `backend/README.md`

---

**Status**: Ready for integration  
**Last Updated**: January 2024  
**Support**: stpatill@gmail.com

