/**
 * Simple API response cache to improve performance
 * Prevents redundant API calls and reduces loading times
 */

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class APICache {
  private cache = new Map<string, CacheEntry>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Generate cache key from URL and options
  generateKey(url: string, options?: RequestInit): string {
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }
}

export const apiCache = new APICache();

/**
 * Enhanced fetch with caching
 */
export async function cachedFetch(
  url: string, 
  options?: RequestInit,
  ttl?: number
): Promise<Response> {
  const cacheKey = apiCache.generateKey(url, options);
  
  // Check cache first
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) {
    console.log('🚀 Cache hit for:', url);
    return new Response(JSON.stringify(cachedData), {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' }
    });
  }

  console.log('🌐 Fetching from API:', url);
  
  try {
    const response = await fetch(url, options);
    
    if (response.ok) {
      // Clone the response to avoid consuming the body stream
      const responseClone = response.clone();
      const data = await responseClone.json();
      // Cache successful responses
      apiCache.set(cacheKey, data, ttl);
    }
    
    return response;
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

/**
 * Clear cache for specific patterns
 */
export function clearCachePattern(pattern: string): void {
  const keys = Array.from(apiCache['cache'].keys());
  keys.forEach(key => {
    if (key.includes(pattern)) {
      apiCache.delete(key);
    }
  });
}

