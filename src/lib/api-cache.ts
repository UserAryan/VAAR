import { apiCache } from './redis';

type CacheOptions = {
  ttl?: number;
  skipCache?: boolean;
};

export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const { ttl, skipCache = false } = options;

  // Skip cache if requested
  if (skipCache) {
    return fn();
  }

  // Try to get from cache first
  const cached = await apiCache.get(key);
  if (cached) {
    return cached as T;
  }

  // If not in cache, execute the function
  const result = await fn();

  // Store in cache
  await apiCache.set(key, result);

  return result;
}

// Example usage:
/*
const getCachedData = async (params: any) => {
  const cacheKey = apiCache.generateKey('/api/data', params);
  return withCache(cacheKey, async () => {
    // Your API logic here
    return data;
  });
};
*/ 