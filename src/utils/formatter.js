// Number formatting utilities
export const formatNumber = (num, options = {}) => {
  const {
    decimals = 2,
    prefix = '',
    suffix = '',
    compact = false,
  } = options;

  if (isNaN(num)) return 'N/A';

  let formattedNum = num;

  if (compact && Math.abs(num) >= 1000) {
    const units = ['', 'K', 'L', 'Cr'];
    let unitIndex = 0;
    
    while (Math.abs(formattedNum) >= 1000 && unitIndex < units.length - 1) {
      formattedNum /= 1000;
      unitIndex++;
    }
    
    return `${prefix}${formattedNum.toFixed(decimals)}${units[unitIndex]}${suffix}`;
  }

  return `${prefix}${formattedNum.toFixed(decimals)}${suffix}`;
};

// Currency formatting
export const formatCurrency = (amount, currency = 'INR') => {
  if (isNaN(amount)) return 'N/A';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Percentage formatting
export const formatPercentage = (value, decimals = 2) => {
  if (isNaN(value)) return 'N/A';
  
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

// Date formatting utilities
export const formatDate = (date, options = {}) => {
  const {
    format = 'short',
    includeTime = false,
  } = options;

  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) return 'Invalid Date';

  const formatOptions = {
    short: { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    },
    long: { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    },
    time: { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    },
  };

  if (includeTime) {
    formatOptions.short = { ...formatOptions.short, ...formatOptions.time };
  }

  return dateObj.toLocaleDateString('en-IN', formatOptions[format]);
};

// Time formatting
export const formatTime = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) return 'Invalid Time';

  return dateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Relative time formatting
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(dateObj, { format: 'short' });
};

// Text formatting utilities
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const capitalizeFirst = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatTitleCase = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Validation utilities
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Color utilities for charts and UI
export const getColorForChange = (change) => {
  if (change > 0) return '#22c55e'; // primary green
  if (change < 0) return '#ef4444'; // red
  return '#6b7280'; // gray
};

export const getColorForPercentage = (percentage) => {
  if (percentage > 5) return '#22c55e'; // primary green
  if (percentage > 2) return '#16a34a'; // darker green
  if (percentage > 0) return '#f59e0b'; // golden
  if (percentage > -2) return '#f59e0b'; // amber
  if (percentage > -5) return '#f97316'; // orange
  return '#ef4444'; // red
};

// Data processing utilities
export const sortByChange = (data, ascending = false) => {
  return [...data].sort((a, b) => {
    const aChange = a.change || a.changePercent || 0;
    const bChange = b.change || b.changePercent || 0;
    return ascending ? aChange - bChange : bChange - aChange;
  });
};

export const filterByRange = (data, min, max, field = 'price') => {
  return data.filter(item => {
    const value = item[field];
    return value >= min && value <= max;
  });
};

export const groupBy = (data, key) => {
  return data.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

// Storage utilities
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Storage read error:', error);
    return defaultValue;
  }
};

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Storage write error:', error);
    return false;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Storage remove error:', error);
    return false;
  }
};
