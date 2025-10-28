import axios from 'axios';
import { API_CONFIG, ENDPOINTS, CACHE_DURATION, STORAGE_KEYS } from './constants';

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

  // Get top gainers
  getTopGainers: async () => {
    try {
      // Mock data - replace with actual API call
      return [
        { symbol: 'RELIANCE', price: 2450, change: 45, changePercent: 1.87 },
        { symbol: 'TCS', price: 3850, change: 38, changePercent: 1.00 },
        { symbol: 'HDFC', price: 1650, change: 25, changePercent: 1.54 },
        { symbol: 'INFY', price: 1850, change: 22, changePercent: 1.20 },
        { symbol: 'ICICIBANK', price: 950, change: 15, changePercent: 1.60 },
      ];
    } catch (error) {
      console.error('Top gainers fetch error:', error);
      return [];
    }
  },

  // Get top losers
  getTopLosers: async () => {
    try {
      // Mock data - replace with actual API call
      return [
        { symbol: 'ADANIPORTS', price: 850, change: -25, changePercent: -2.86 },
        { symbol: 'BAJFINANCE', price: 7200, change: -180, changePercent: -2.44 },
        { symbol: 'MARUTI', price: 10500, change: -200, changePercent: -1.87 },
        { symbol: 'TITAN', price: 3200, change: -45, changePercent: -1.39 },
        { symbol: 'NESTLEIND', price: 18500, change: -200, changePercent: -1.07 },
      ];
    } catch (error) {
      console.error('Top losers fetch error:', error);
      return [];
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
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('News fetch error:', error);
      // Return mock data as fallback
      return [
        {
          title: 'Nifty 50 crosses 19,500 mark as banking stocks rally',
          description: 'The benchmark index gained 0.8% led by strong performance in banking and IT sectors.',
          source: { name: 'Economic Times' },
          publishedAt: new Date().toISOString(),
          url: '#',
        },
        {
          title: 'RBI keeps repo rate unchanged at 6.5%',
          description: 'Central bank maintains status quo on interest rates citing inflation concerns.',
          source: { name: 'Business Standard' },
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          url: '#',
        },
      ];
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
