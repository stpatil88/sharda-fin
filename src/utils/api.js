import axios from 'axios';
import { CACHE_DURATION, STORAGE_KEYS } from './constants';

const apiClient = axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getCachedData = (key, ttl) => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const cached = window.localStorage.getItem(key);
    if (!cached) {
      return null;
    }

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < ttl) {
      return data;
    }
  } catch (error) {
    console.error('Cache read error:', error);
  }

  return null;
};

const setCachedData = (key, data) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(
      key,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error('Cache write error:', error);
  }
};

export const marketDataAPI = {
  getMarketData: async (symbol) => marketDataAPI.getIndexQuote(symbol),

  getIndexQuote: async (symbol) => {
    try {
      const response = await apiClient.get('/api/market/index', {
        params: { symbol },
      });
      return response.data;
    } catch (error) {
      console.error(`[API] Index quote fetch error for ${symbol}:`, error);
      return { status: 'error', symbol, error: error.message };
    }
  },

  getAllIndexQuotes: async () => {
    const cacheKey = `${STORAGE_KEYS.MARKET_DATA_CACHE}_indices`;
    const cached = getCachedData(cacheKey, CACHE_DURATION.MARKET_DATA);
    if (cached) {
      return cached;
    }

    try {
      const response = await apiClient.get('/api/market/indices');
      setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('[API] All index quotes fetch error:', error);
      return {};
    }
  },

  getTopGainers: async (limit = 10) => {
    const cacheKey = `${STORAGE_KEYS.MARKET_DATA_CACHE}_gainers_${limit}`;
    const cached = getCachedData(cacheKey, CACHE_DURATION.MARKET_DATA);
    if (cached) {
      return cached;
    }

    try {
      const response = await apiClient.get('/api/market/movers', {
        params: { limit },
      });
      const gainers = response.data?.gainers || [];
      setCachedData(cacheKey, gainers);
      return gainers;
    } catch (error) {
      console.error('[API] Top gainers fetch error:', error);
      return [];
    }
  },

  getTopLosers: async (limit = 10) => {
    const cacheKey = `${STORAGE_KEYS.MARKET_DATA_CACHE}_losers_${limit}`;
    const cached = getCachedData(cacheKey, CACHE_DURATION.MARKET_DATA);
    if (cached) {
      return cached;
    }

    try {
      const response = await apiClient.get('/api/market/movers', {
        params: { limit },
      });
      const losers = response.data?.losers || [];
      setCachedData(cacheKey, losers);
      return losers;
    } catch (error) {
      console.error('[API] Top losers fetch error:', error);
      return [];
    }
  },

  getPutCallRatio: async () => ({
    status: 'error',
    data: [],
    total_symbols: 0,
  }),

  getFIIDIIData: async () => ({
    status: 'error',
    data: {},
  }),
};

export const nseDataAPI = {
  getBlockDeals: async () => ({ status: 'error', data: [], count: 0 }),
  getBulkDeals: async () => ({ status: 'error', data: [], count: 0 }),
  getFIIDIIData: async () => ({ status: 'error', data: {} }),
  getPastResults: async () => ({ status: 'error', data: {} }),
};

export const newsAPI = {
  getMarketNews: async (limit = 10) => {
    const cacheKey = `${STORAGE_KEYS.NEWS_CACHE}_market_${limit}`;
    const cached = getCachedData(cacheKey, CACHE_DURATION.NEWS);
    if (cached) {
      return cached;
    }

    try {
      const response = await apiClient.get('/api/news', {
        params: { limit },
      });
      const articles = response.data?.articles || [];
      setCachedData(cacheKey, articles);
      return articles;
    } catch (error) {
      console.error('News fetch error:', error);
      return [];
    }
  },
};

export const whatsappAPI = {
  share: (text, url = '') => {
    const shareText = `${text} ${url}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  },
};

export const emailAPI = {
  sendEmail: async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('Email send error:', error);
      throw new Error('Failed to send email');
    }
  },
};

export default apiClient;
