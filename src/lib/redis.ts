import Redis from 'ioredis';

// Environment variable validation
const requiredEnvVars = {
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`${key} is not defined`);
  }
});

// TLS configuration
const tlsConfig = process.env.REDIS_TLS === 'true' ? {
  rejectUnauthorized: false,
  servername: process.env.REDIS_HOST,
} : undefined;

// Create Redis client with connection pooling
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  username: 'default',
  tls: tlsConfig,
  maxRetriesPerRequest: 5,
  enableReadyCheck: true,
  retryStrategy: (times) => {
    if (times > 5) {
      console.error('Redis connection failed after 5 retries');
      return null; // Stop retrying after 5 attempts
    }
    const delay = Math.min(times * 1000, 5000); // Increase delay between retries
    console.log(`Redis retry attempt ${times} with delay ${delay}ms`);
    return delay;
  },
  connectTimeout: 10000, // 10 seconds
  commandTimeout: 5000, // 5 seconds
  reconnectOnError: (err) => {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      console.error('Redis reconnecting due to READONLY error');
      return true;
    }
    return false;
  },
});

// Enhanced event logging
redis.on('connect', () => {
  console.log('Redis client connected successfully');
});

redis.on('error', (err: Error & { code?: string }) => {
  console.error('Redis connection error:', {
    message: err.message,
    code: err.code,
    stack: err.stack,
  });
});

redis.on('ready', () => {
  console.log('Redis client is ready for commands');
});

redis.on('reconnecting', () => {
  console.log('Redis client is attempting to reconnect...');
});

redis.on('end', () => {
  console.log('Redis connection has ended');
});

// Cache configuration
const CACHE_CONFIG = {
  // Session cache
  SESSION_PREFIX: 'session:',
  SESSION_TTL: 24 * 60 * 60, // 24 hours in seconds

  // Rate limiting
  RATE_LIMIT_PREFIX: 'ratelimit:',
  RATE_LIMIT_WINDOW: 60, // 1 minute in seconds
  RATE_LIMIT_MAX_REQUESTS: 100, // Maximum requests per window

  // API response cache
  API_CACHE_PREFIX: 'api:',
  API_CACHE_TTL: 5 * 60, // 5 minutes in seconds
};

// Enhanced session cache functions with logging
export const sessionCache = {
  set: async (key: string, value: any) => {
    try {
      const serialized = JSON.stringify(value);
      await redis.set(
        `${CACHE_CONFIG.SESSION_PREFIX}${key}`,
        serialized,
        'EX',
        CACHE_CONFIG.SESSION_TTL
      );
      console.log(`Session cache set for key: ${key}`);
    } catch (error) {
      console.error('Session cache set error:', error);
      throw error;
    }
  },

  get: async (key: string) => {
    try {
      const data = await redis.get(`${CACHE_CONFIG.SESSION_PREFIX}${key}`);
      console.log(`Session cache ${data ? 'hit' : 'miss'} for key: ${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Session cache get error:', error);
      throw error;
    }
  },

  delete: async (key: string) => {
    try {
      await redis.del(`${CACHE_CONFIG.SESSION_PREFIX}${key}`);
      console.log(`Session cache deleted for key: ${key}`);
    } catch (error) {
      console.error('Session cache delete error:', error);
      throw error;
    }
  },
};

// Enhanced rate limiting functions with logging
export const rateLimit = {
  check: async (key: string): Promise<boolean> => {
    try {
      const current = await redis.incr(`${CACHE_CONFIG.RATE_LIMIT_PREFIX}${key}`);
      if (current === 1) {
        await redis.expire(
          `${CACHE_CONFIG.RATE_LIMIT_PREFIX}${key}`,
          CACHE_CONFIG.RATE_LIMIT_WINDOW
        );
      }
      const isAllowed = current <= CACHE_CONFIG.RATE_LIMIT_MAX_REQUESTS;
      console.log(`Rate limit check for key: ${key}, current: ${current}, allowed: ${isAllowed}`);
      return isAllowed;
    } catch (error) {
      console.error('Rate limit check error:', error);
      throw error;
    }
  },

  reset: async (key: string) => {
    try {
      await redis.del(`${CACHE_CONFIG.RATE_LIMIT_PREFIX}${key}`);
      console.log(`Rate limit reset for key: ${key}`);
    } catch (error) {
      console.error('Rate limit reset error:', error);
      throw error;
    }
  },
};

// Enhanced API cache functions with logging
export const apiCache = {
  set: async (key: string, value: any) => {
    try {
      const serialized = JSON.stringify(value);
      await redis.set(
        `${CACHE_CONFIG.API_CACHE_PREFIX}${key}`,
        serialized,
        'EX',
        CACHE_CONFIG.API_CACHE_TTL
      );
      console.log(`API cache set for key: ${key}`);
    } catch (error) {
      console.error('API cache set error:', error);
      throw error;
    }
  },

  get: async (key: string) => {
    try {
      const data = await redis.get(`${CACHE_CONFIG.API_CACHE_PREFIX}${key}`);
      console.log(`API cache ${data ? 'hit' : 'miss'} for key: ${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('API cache get error:', error);
      throw error;
    }
  },

  delete: async (key: string) => {
    try {
      await redis.del(`${CACHE_CONFIG.API_CACHE_PREFIX}${key}`);
      console.log(`API cache deleted for key: ${key}`);
    } catch (error) {
      console.error('API cache delete error:', error);
      throw error;
    }
  },

  generateKey: (path: string, params: Record<string, any>) => {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}:${params[key]}`)
      .join('|');
    return `${path}:${sortedParams}`;
  },
};

// Enhanced health check function
export const checkRedisHealth = async () => {
  try {
    const startTime = Date.now();
    await redis.ping();
    const responseTime = Date.now() - startTime;
    console.log(`Redis health check passed, response time: ${responseTime}ms`);
    return {
      status: 'healthy',
      responseTime,
      timestamp: new Date().toISOString(),
    };
  } catch (error: unknown) {
    console.error('Redis health check failed:', error);
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
};

// Graceful shutdown with timeout
const shutdown = async () => {
  console.log('Initiating Redis graceful shutdown...');
  try {
    await Promise.race([
      redis.quit(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Redis shutdown timeout')), 5000)
      ),
    ]);
    console.log('Redis client disconnected gracefully');
  } catch (error) {
    console.error('Redis shutdown error:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default redis; 