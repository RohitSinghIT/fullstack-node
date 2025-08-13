import { redisCache } from '../lib/redis';

// Cache key generators
export const generateUserCacheKey = (userId: string) => `user:${userId}`;
export const generateUsersListCacheKey = (page: number, limit: number) => `users:list:${page}:${limit}`;
export const generateUserProfileCacheKey = (userId: string) => `user:profile:${userId}`;

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  USER: 3600, // 1 hour
  USERS_LIST: 1800, // 30 minutes
  USER_PROFILE: 7200, // 2 hours
  AUTH_TOKEN: 86400, // 24 hours
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 7200, // 2 hours
};

// Cache utility functions
export class CacheUtils {
  // Cache user data
  static async cacheUser(userId: string, userData: any): Promise<void> {
    const key = generateUserCacheKey(userId);
    await redisCache.set(key, userData, CACHE_TTL.USER);
  }

  // Get cached user data
  static async getCachedUser(userId: string): Promise<any | null> {
    const key = generateUserCacheKey(userId);
    return await redisCache.get(key);
  }

  // Invalidate user cache
  static async invalidateUserCache(userId: string): Promise<void> {
    const key = generateUserCacheKey(userId);
    await redisCache.del(key);
  }

  // Cache users list
  static async cacheUsersList(page: number, limit: number, usersData: any): Promise<void> {
    const key = generateUsersListCacheKey(page, limit);
    await redisCache.set(key, usersData, CACHE_TTL.USERS_LIST);
  }

  // Get cached users list
  static async getCachedUsersList(page: number, limit: number): Promise<any | null> {
    const key = generateUsersListCacheKey(page, limit);
    return await redisCache.get(key);
  }

  // Invalidate users list cache
  static async invalidateUsersListCache(): Promise<void> {
    // This would need to be implemented based on your specific needs
    // You might want to use Redis patterns to delete multiple keys
    console.log('Users list cache invalidation - implement based on your needs');
  }

  // Cache with custom key and TTL
  static async cacheData(key: string, data: any, ttlSeconds: number = CACHE_TTL.MEDIUM): Promise<void> {
    await redisCache.set(key, data, ttlSeconds);
  }

  // Get cached data
  static async getCachedData(key: string): Promise<any | null> {
    return await redisCache.get(key);
  }

  // Delete cached data
  static async deleteCachedData(key: string): Promise<void> {
    await redisCache.del(key);
  }

  // Check if data exists in cache
  static async isCached(key: string): Promise<boolean> {
    return await redisCache.exists(key);
  }

  // Cache multiple items at once
  static async cacheMultiple(dataMap: Record<string, any>, ttlSeconds: number = CACHE_TTL.MEDIUM): Promise<void> {
    await redisCache.mset(dataMap, ttlSeconds);
  }

  // Get multiple cached items
  static async getMultipleCached(keys: string[]): Promise<Record<string, any>> {
    return await redisCache.mget(keys);
  }

  // Clear all cache (use with caution)
  static async clearAllCache(): Promise<void> {
    await redisCache.flushAll();
  }

  // Get cache statistics
  static async getCacheStats(): Promise<any> {
    return await redisCache.getStats();
  }
}

// Example usage in GraphQL resolvers:
/*
// In a user resolver:
export const getUser = async (parent: any, { id }: { id: string }, context: Context) => {
  // Try to get from cache first
  const cachedUser = await CacheUtils.getCachedUser(id);
  if (cachedUser) {
    console.log('User found in cache');
    return cachedUser;
  }

  // If not in cache, get from database
  const user = await context.prisma.user.findUnique({
    where: { id }
  });

  if (user) {
    // Cache the user data
    await CacheUtils.cacheUser(id, user);
  }

  return user;
};

// In a mutation that updates user data:
export const updateUser = async (parent: any, { id, data }: { id: string, data: any }, context: Context) => {
  const updatedUser = await context.prisma.user.update({
    where: { id },
    data
  });

  // Invalidate cache after update
  await CacheUtils.invalidateUserCache(id);

  return updatedUser;
};
*/ 