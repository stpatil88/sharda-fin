// API Configuration
export const API_CONFIG = {
  FINNHUB_BASE_URL: 'https://finnhub.io/api/v1',
  NEWS_API_BASE_URL: 'https://newsapi.org/v2',
  GNEWS_API_BASE_URL: 'https://gnews.io/api/v4',
  NSE_API_URL: 'https://api.nseindia.com',
  BSE_API_URL: 'https://api.bseindia.com',
};

// API Endpoints
export const ENDPOINTS = {
  MARKET_DATA: '/quote',
  NEWS: '/everything',
  TOP_GAINERS: '/top-gainers',
  TOP_LOSERS: '/top-losers',
  FII_DII: '/fii-dii-data',
};

// Market Symbols
export const MARKET_SYMBOLS = {
  NIFTY: 'NIFTY',
  SENSEX: 'SENSEX',
  BANKNIFTY: 'BANKNIFTY',
  GOLD: 'GOLD',
  SILVER: 'SILVER',
};

// News Categories
export const NEWS_CATEGORIES = {
  MARKET_UPDATE: 'Market Update',
  POLICY: 'Policy',
  FII_DII: 'FII/DII',
  COMPANY_NEWS: 'Company News',
  ECONOMIC_INDICATORS: 'Economic Indicators',
};

// Service Types
export const SERVICE_TYPES = {
  DEMAT_ACCOUNT: 'Demat Account Opening',
  INSURANCE: 'Insurance Services',
  MUTUAL_FUNDS: 'Mutual Funds',
  LOANS: 'Loans',
  RESEARCH: 'Financial Research',
};

// WhatsApp Share Configuration
export const WHATSAPP_CONFIG = {
  BASE_URL: 'https://api.whatsapp.com/send',
  DEFAULT_MESSAGE: 'Check out this market update from Sharada Financial Services:',
};

// Form Validation
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/,
  REQUIRED_FIELDS: ['name', 'email', 'message'],
};

// Chart Configuration
export const CHART_CONFIG = {
  COLORS: {
    PRIMARY: '#22c55e',
    SECONDARY: '#f59e0b',
    SUCCESS: '#10b981',
    DANGER: '#ef4444',
    WARNING: '#f59e0b',
    INFO: '#22c55e',
  },
  ANIMATION_DURATION: 1000,
  RESPONSIVE: true,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'sharada_user_preferences',
  MARKET_DATA_CACHE: 'sharada_market_data_cache',
  NEWS_CACHE: 'sharada_news_cache',
};

// Cache Duration (in milliseconds)
export const CACHE_DURATION = {
  MARKET_DATA: 5 * 60 * 1000, // 5 minutes
  NEWS: 15 * 60 * 1000, // 15 minutes
  USER_DATA: 24 * 60 * 60 * 1000, // 24 hours
};
