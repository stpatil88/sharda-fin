# cache_manager.py
"""
Simple in-memory cache manager for API responses
"""

import time
from typing import Any, Optional
from functools import wraps

class SimpleCache:
    def __init__(self, default_ttl: int = 300):  # 5 minutes default TTL
        self.cache = {}
        self.default_ttl = default_ttl
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if key in self.cache:
            value, timestamp = self.cache[key]
            if time.time() - timestamp < self.default_ttl:
                return value
            else:
                # Expired, remove from cache
                del self.cache[key]
        return None
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Set value in cache"""
        ttl = ttl or self.default_ttl
        self.cache[key] = (value, time.time())
    
    def delete(self, key: str) -> None:
        """Delete key from cache"""
        if key in self.cache:
            del self.cache[key]
    
    def clear(self) -> None:
        """Clear all cache"""
        self.cache.clear()
    
    def size(self) -> int:
        """Get cache size"""
        return len(self.cache)

# Global cache instance
cache = SimpleCache()

def cached(ttl: int = 300):
    """
    Decorator to cache function results
    
    Args:
        ttl: Time to live in seconds
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Create cache key from function name and arguments
            cache_key = f"{func.__name__}:{str(args)}:{str(sorted(kwargs.items()))}"
            
            # Try to get from cache
            cached_result = cache.get(cache_key)
            if cached_result is not None:
                return cached_result
            
            # Execute function and cache result
            result = func(*args, **kwargs)
            cache.set(cache_key, result, ttl)
            return result
        
        return wrapper
    return decorator

def cache_invalidate(pattern: str = None):
    """
    Invalidate cache entries matching pattern
    
    Args:
        pattern: Pattern to match cache keys (if None, clears all)
    """
    if pattern is None:
        cache.clear()
    else:
        keys_to_delete = [key for key in cache.cache.keys() if pattern in key]
        for key in keys_to_delete:
            cache.delete(key)

# Cache TTL constants
CACHE_TTL = {
    "MARKET_DATA": 60,      # 1 minute for market data
    "NEWS": 300,            # 5 minutes for news
    "SUMMARIES": 600,       # 10 minutes for summaries
    "COMPANY_NEWS": 300,    # 5 minutes for company news
    "OVERVIEW": 60,         # 1 minute for market overview
}
