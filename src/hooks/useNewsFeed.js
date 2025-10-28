import { useState, useEffect, useCallback } from 'react';
import { newsAPI } from '../utils/api';

export const useNewsFeed = (limit = 10) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await newsAPI.getMarketNews(limit);
      setNews(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchNews();
    
    // Auto-refresh every 15 minutes
    const interval = setInterval(fetchNews, 900000);
    
    return () => clearInterval(interval);
  }, [fetchNews]);

  return { news, loading, error, refetch: fetchNews };
};

export const useWhatsAppShare = () => {
  const shareToWhatsApp = useCallback((text, url = '') => {
    const shareText = `${text} ${url}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  }, []);

  return { shareToWhatsApp };
};

export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field on blur
    if (validationRules[name]) {
      const error = validateField(name, values[name], validationRules[name]);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [values, validationRules]);

  const validateField = (name, value, rules) => {
    if (rules.required && !value) {
      return `${name} is required`;
    }
    
    if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }
    
    if (rules.phone && value && !/^[6-9]\d{9}$/.test(value.replace(/\D/g, ''))) {
      return 'Please enter a valid phone number';
    }
    
    if (rules.minLength && value && value.length < rules.minLength) {
      return `${name} must be at least ${rules.minLength} characters`;
    }
    
    if (rules.maxLength && value && value.length > rules.maxLength) {
      return `${name} must be no more than ${rules.maxLength} characters`;
    }
    
    return '';
  };

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name], validationRules[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    return isValid;
  }, [values, validationRules]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    isValid: Object.keys(errors).length === 0 && Object.keys(touched).length > 0,
  };
};

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Local storage read error:', error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Local storage write error:', error);
    }
  }, [key]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Local storage remove error:', error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useIntersectionObserver = (ref, options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return isIntersecting;
};
