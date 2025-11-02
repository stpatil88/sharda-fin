import axios from 'axios';
import { API_CONFIG, ENDPOINTS, CACHE_DURATION, STORAGE_KEYS } from './constants';

// Backend base URL
// For production: Use environment variable or detect from current host
// For development: Use localhost
const getBackendURL = () => {
  // Priority 1: Environment variable (most reliable - always use this in production)
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL;
  }
  
  // Priority 2: In browser environment, detect from current host
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const protocol = window.location.protocol; // 'https:' or 'http:'
    const port = window.location.port;
    
    // If accessing from localhost, use localhost:8000
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:8000';
    }
    
    // For production domains: Use same protocol and host
    // Option A: If using Nginx reverse proxy (recommended), use /api path
    // Check if we're on standard ports (80/443) - likely using reverse proxy
    if (!port || port === '80' || port === '443') {
      // Using reverse proxy, backend should be at /api
      return `${protocol}//${host}/api`;
    }
    
    // Option B: Direct port access (if not using reverse proxy)
    // Use same protocol but different port
    return `${protocol}//${host}:8000`;
  }
  
  // Server-side rendering fallback
  return 'http://localhost:8000';
};

const BACKEND_URL = getBackendURL();

// Create backend client
const backendClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance with default config
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add API keys from environment variables
    if (config.url?.includes('finnhub')) {
      config.params = {
        ...config.params,
        token: process.env.NEXT_PUBLIC_FINNHUB_API_KEY,
      };
    }
    
    if (config.url?.includes('newsapi')) {
      config.headers['X-API-Key'] = process.env.NEXT_PUBLIC_NEWS_API_KEY;
    }
    
    if (config.url?.includes('gnews')) {
      config.params = {
        ...config.params,
        apikey: process.env.NEXT_PUBLIC_GNEWS_API_KEY,
      };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Cache utility functions
const getCachedData = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      if (now - timestamp < CACHE_DURATION.MARKET_DATA) {
        return data;
      }
    }
  } catch (error) {
    console.error('Cache read error:', error);
  }
  return null;
};

const setCachedData = (key, data) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Cache write error:', error);
  }
};

// Market Data API
export const marketDataAPI = {
  // Get live market data
  getMarketData: async (symbol) => {
    const cacheKey = `${STORAGE_KEYS.MARKET_DATA_CACHE}_${symbol}`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await apiClient.get(
        `${API_CONFIG.FINNHUB_BASE_URL}${ENDPOINTS.MARKET_DATA}`,
        {
          params: { symbol: `${symbol}.NSE` },
        }
      );
      
      const data = response.data;
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Market data fetch error:', error);
      // Return mock data as fallback
      return {
        c: 19500, // current price
        d: 150,   // change
        dp: 0.78, // change percent
        h: 19600, // high
        l: 19400, // low
        o: 19450, // open
        pc: 19350, // previous close
      };
    }
  },

  // Get single index quote
  getIndexQuote: async (symbol) => {
    try {
      console.log(`[API] Fetching index quote for ${symbol} from ${BACKEND_URL}/index-quote/${symbol}`);
      const response = await backendClient.get(`/index-quote/${symbol}`);
      console.log(`[API] Index quote response for ${symbol}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`[API] Index quote fetch error for ${symbol}:`, error);
      console.error(`[API] Error details:`, error.response?.data || error.message);
      return { status: 'error', error: error.message };
    }
  },

  // Get all index quotes
  getAllIndexQuotes: async () => {
    try {
      console.log(`[API] Fetching all index quotes from ${BACKEND_URL}/index-quotes`);
      const response = await backendClient.get('/index-quotes');
      console.log(`[API] All index quotes response:`, response.data);
      return response.data;
    } catch (error) {
      console.error('[API] All index quotes fetch error:', error);
      console.error('[API] Error details:', error.response?.data || error.message);
      console.error('[API] Backend URL:', BACKEND_URL);
      return {};
    }
  },

  // Get top gainers
  getTopGainers: async () => {
    try {
      console.log('[API] Fetching top gainers...');
      const response = await backendClient.get('/top-gainers?exchange=NSE');
      console.log('[API] Top gainers response:', response.data);
      const gainers = response.data?.gainers || [];
      console.log('[API] Gainers array:', gainers);
      // Validate each gainer has required fields
      gainers.forEach((g, i) => {
        if (!g.symbol) {
          console.warn(`[API] Gainer ${i} missing symbol:`, g);
        }
      });
      return gainers;
    } catch (error) {
      console.error('[API] Top gainers fetch error:', error);
      console.error('[API] Error details:', error.response?.data || error.message);
      // Fallback mock data
      return [
        { symbol: 'RELIANCE', price: 2450, change: 45, changePercent: 1.87 },
        { symbol: 'TCS', price: 3850, change: 38, changePercent: 1.00 },
      ];
    }
  },

  // Get top losers
  getTopLosers: async () => {
    try {
      console.log('[API] Fetching top losers...');
      const response = await backendClient.get('/top-losers?exchange=NSE');
      console.log('[API] Top losers response:', response.data);
      const losers = response.data?.losers || [];
      console.log('[API] Losers array:', losers);
      // Validate each loser has required fields
      losers.forEach((l, i) => {
        if (!l.symbol) {
          console.warn(`[API] Loser ${i} missing symbol:`, l);
        }
      });
      return losers;
    } catch (error) {
      console.error('[API] Top losers fetch error:', error);
      console.error('[API] Error details:', error.response?.data || error.message);
      // Fallback mock data
      return [
        { symbol: 'ADANIPORTS', price: 850, change: -25, changePercent: -2.86 },
        { symbol: 'BAJFINANCE', price: 7200, change: -180, changePercent: -2.44 },
      ];
    }
  },

  // Get Put/Call Ratio data
  getPutCallRatio: async (limit = 100) => {
    try {
      console.log(`[API] Fetching put/call ratio from ${BACKEND_URL}/putcallratio?limit=${limit}`);
      const response = await backendClient.get(`/putcallratio?exchange=NSE&limit=${limit}`);
      console.log(`[API] Put/call ratio response:`, response.data);
      return response.data;
    } catch (error) {
      console.error('[API] Put/call ratio fetch error:', error);
      console.error('[API] Error details:', error.response?.data || error.message);
      // Return mock data as fallback
      return {
        status: 'error',
        data: [],
        total_symbols: 0
      };
    }
  },

  // Get FII/DII data
  getFIIDIIData: async () => {
    try {
      // Mock data - replace with actual API call
      return {
        fii: { net: 2500, buy: 5000, sell: 2500 },
        dii: { net: 1200, buy: 3000, sell: 1800 },
        date: new Date().toISOString(),
      };
    } catch (error) {
      console.error('FII/DII data fetch error:', error);
      return { fii: { net: 0 }, dii: { net: 0 } };
    }
  },
};

// News API
export const newsAPI = {
  // Get market news
  getMarketNews: async (limit = 10) => {
    const cacheKey = `${STORAGE_KEYS.NEWS_CACHE}_market`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Try backend CSV-based Marathi/English news first
      try {
        const response = await apiClient.get(`${BACKEND_URL}/marathi-news`, {
          params: { limit },
        });
        const items = response.data?.articles || [];
        // Normalize for frontend consumption and include both titles
        const normalized = items.map((a, idx) => ({
          id: idx + 1,
          titleEn: a.english_title || '',
          titleMr: a.marathi_title || '',
          source: a.source || 'Unknown',
          url: a.url || '#',
          category: 'Market Update',
          publishedAt: new Date().toISOString(),
        }));
        if (normalized.length > 0) {
          setCachedData(cacheKey, normalized);
          return normalized;
        }
        // If backend returned empty, fall through to external fallback
      } catch (be) {
        // Fallback to external APIs below
      }

      // Using GNews API for better Indian market coverage
      const response = await apiClient.get(API_CONFIG.GNEWS_API_BASE_URL + '/search', {
        params: {
          q: 'Indian stock market NSE BSE',
          lang: 'en',
          country: 'in',
          max: limit,
          sortby: 'publishedAt',
        },
      });

      const data = response.data.articles || [];
      const normalized = data.map((a, idx) => ({
        id: idx + 1,
        titleEn: a.title,
        titleMr: '',
        source: a.source?.name,
        url: a.url,
        category: 'Market Update',
        publishedAt: a.publishedAt,
      }));
      setCachedData(cacheKey, normalized);
      return normalized;
    } catch (error) {
      console.error('News fetch error:', error);
      // Return normalized mock data as fallback
      const fallback = [
        {
          id: 1,
          titleEn: 'Nifty 50 crosses 19,500 mark as banking stocks rally',
          titleMr: 'बँकिंग शेअर्सच्या वाढीमुळे निफ्टी 19,500 च्या वर',
          source: 'Economic Times',
          publishedAt: new Date().toISOString(),
          url: '#',
          category: 'Market Update',
        },
        {
          id: 2,
          titleEn: 'RBI keeps repo rate unchanged at 6.5%',
          titleMr: 'RBI ने रेपो दर 6.5% वर कायम ठेवला',
          source: 'Business Standard',
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          url: '#',
          category: 'Policy',
        },
      ];
      setCachedData(cacheKey, fallback);
      return fallback;
    }
  },
};

// WhatsApp Share API
export const whatsappAPI = {
  share: (text, url = '') => {
    const shareText = `${text} ${url}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  },
};

// EmailJS API (for contact form)
export const emailAPI = {
  sendEmail: async (formData) => {
    try {
      // This would integrate with EmailJS
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('Email send error:', error);
      throw new Error('Failed to send email');
    }
  },
};

export default apiClient;
