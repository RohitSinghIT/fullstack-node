import { Router } from 'express';
import { redisCache } from '../lib/redis';
import { CacheUtils } from '../utils/cache-utils';

const router = Router();

// Get cache statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await CacheUtils.getCacheStats();
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get cache stats'
    });
  }
});

// Clear all cache
router.delete('/clear', async (req, res) => {
  try {
    await CacheUtils.clearAllCache();
    res.json({
      success: true,
      message: 'All cache cleared successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to clear cache'
    });
  }
});

// Get cache info
router.get('/info', async (req, res) => {
  try {
    const info = await redisCache.getStats();
    res.json({
      success: true,
      data: {
        info: info?.info || 'Not available',
        dbsize: info?.dbsize || 0,
        memory: info?.memory || 'Not available'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get cache info'
    });
  }
});

// Test cache operations
router.post('/test', async (req, res) => {
  try {
    const testKey = 'test:cache:key';
    const testData = { message: 'Hello from Redis!', timestamp: new Date().toISOString() };
    
    // Set test data
    await CacheUtils.cacheData(testKey, testData, 60); // 1 minute TTL
    
    // Get test data
    const retrievedData = await CacheUtils.getCachedData(testKey);
    
    // Check if exists
    const exists = await CacheUtils.isCached(testKey);
    
    // Clean up
    await CacheUtils.deleteCachedData(testKey);
    
    res.json({
      success: true,
      data: {
        set: true,
        retrieved: retrievedData,
        exists: exists,
        cleaned: true
      },
      message: 'Cache test completed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Cache test failed'
    });
  }
});

export default router; 