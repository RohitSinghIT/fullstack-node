import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000,
};

// Create Redis client
export const redis = new Redis(redisConfig);

// Redis event handlers
redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redis.on('error', error => {
  console.error('❌ Redis connection error:', error);
});

redis.on('ready', () => {
  console.log('🚀 Redis is ready');
});

redis.on('close', () => {
  console.log('🔌 Redis connection closed');
});

redis.on('reconnecting', () => {
  console.log('🔄 Redis reconnecting...');
});

// Utility functions for caching
export class RedisCache {
  private static instance: RedisCache;
  private redis: Redis;

  private constructor() {
    this.redis = redis;
  }

  public static getInstance(): RedisCache {
    if (!RedisCache.instance) {
      RedisCache.instance = new RedisCache();
    }
    return RedisCache.instance;
  }

  // Set cache with TTL
  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.redis.setex(key, ttlSeconds, serializedValue);
    } catch (error) {
      console.error('Redis set error:', error);
      throw error;
    }
  }

  // Get cache
  async get(key: string): Promise<any | null> {
    try {
      const value = await this.redis.get(key);
      if (value) {
        return JSON.parse(value);
      }
      return null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  // Delete cache
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Redis del error:', error);
      throw error;
    }
  }

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  }

  // Set multiple keys
  async mset(
    keyValuePairs: Record<string, any>,
    ttlSeconds: number = 3600
  ): Promise<void> {
    try {
      const pipeline = this.redis.pipeline();
      for (const [key, value] of Object.entries(keyValuePairs)) {
        const serializedValue = JSON.stringify(value);
        pipeline.setex(key, ttlSeconds, serializedValue);
      }
      await pipeline.exec();
    } catch (error) {
      console.error('Redis mset error:', error);
      throw error;
    }
  }

  // Get multiple keys
  async mget(keys: string[]): Promise<Record<string, any>> {
    try {
      const values = await this.redis.mget(...keys);
      const result: Record<string, any> = {};

      keys.forEach((key, index) => {
        if (values[index]) {
          try {
            result[key] = JSON.parse(values[index]!);
          } catch {
            result[key] = values[index];
          }
        }
      });

      return result;
    } catch (error) {
      console.error('Redis mget error:', error);
      return {};
    }
  }

  // Clear all cache
  async flushAll(): Promise<void> {
    try {
      await this.redis.flushall();
    } catch (error) {
      console.error('Redis flushall error:', error);
      throw error;
    }
  }

  // Get cache statistics
  async getStats(): Promise<any> {
    try {
      const info = await this.redis.info();
      const memory = await this.redis.memory('STATS');
      return {
        info,
        memory,
        dbsize: await this.redis.dbsize(),
      };
    } catch (error) {
      console.error('Redis stats error:', error);
      return null;
    }
  }
}

// Export singleton instance
export const redisCache = RedisCache.getInstance();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing Redis connection');
  await redis.quit();
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing Redis connection');
  await redis.quit();
});
