# Redis Setup and Usage Guide

## Overview

Redis has been integrated into the BringFresh backend for caching, session management, and performance optimization.

## Features

- **Caching Layer**: Redis provides fast in-memory caching for frequently accessed data
- **Session Management**: Store user sessions and authentication tokens
- **Performance Optimization**: Reduce database load with intelligent caching
- **Health Monitoring**: Built-in health checks and statistics

## Installation

### Using Docker (Recommended)

1. Start all services including Redis:
```bash
docker-compose up -d
```

2. Redis will be available at `localhost:6379`

### Manual Installation

1. Install Redis on your system:
   - **macOS**: `brew install redis`
   - **Ubuntu/Debian**: `sudo apt-get install redis-server`
   - **Windows**: Download from [Redis.io](https://redis.io/download)

2. Start Redis server:
```bash
redis-server
```

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

### Docker Environment

When using Docker, Redis is automatically configured:
- Host: `redis` (container name)
- Port: `6379`
- No password required
- Database: `0`

## Usage

### Basic Caching

```typescript
import { CacheUtils } from './utils/cache-utils';

// Cache user data
await CacheUtils.cacheUser('user123', userData);

// Get cached user data
const user = await CacheUtils.getCachedUser('user123');

// Invalidate cache
await CacheUtils.invalidateUserCache('user123');
```

### GraphQL Resolver Example

```typescript
export const getUser = async (parent: any, { id }: { id: string }, context: Context) => {
  // Try cache first
  const cachedUser = await CacheUtils.getCachedUser(id);
  if (cachedUser) {
    return cachedUser;
  }

  // Get from database
  const user = await context.prisma.user.findUnique({
    where: { id }
  });

  if (user) {
    // Cache for future requests
    await CacheUtils.cacheUser(id, user);
  }

  return user;
};
```

### Cache Management

#### Cache Statistics
```bash
GET /cache/stats
```

#### Clear All Cache
```bash
DELETE /cache/clear
```

#### Cache Information
```bash
GET /cache/info
```

#### Test Cache Operations
```bash
POST /cache/test
```

## Cache TTL (Time To Live)

Predefined TTL constants:

```typescript
CACHE_TTL = {
  USER: 3600,        // 1 hour
  USERS_LIST: 1800,  // 30 minutes
  USER_PROFILE: 7200, // 2 hours
  AUTH_TOKEN: 86400,  // 24 hours
  SHORT: 300,        // 5 minutes
  MEDIUM: 1800,      // 30 minutes
  LONG: 7200,        // 2 hours
}
```

## Health Check

The health endpoint now includes Redis status:

```bash
GET /health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development",
  "services": {
    "database": "connected",
    "redis": "connected",
    "redisStatus": "ready"
  }
}
```

## Monitoring

### Redis CLI

Connect to Redis CLI:
```bash
# Local installation
redis-cli

# Docker container
docker exec -it bringfresh_redis redis-cli
```

### Common Redis Commands

```bash
# Check Redis info
INFO

# Check memory usage
MEMORY STATS

# List all keys
KEYS *

# Check database size
DBSIZE

# Monitor Redis commands in real-time
MONITOR
```

## Best Practices

### 1. Cache Key Naming
Use consistent naming conventions:
```typescript
// Good
'user:123'
'users:list:1:10'
'user:profile:123'

// Avoid
'user123'
'user_list_1_10'
```

### 2. Cache Invalidation
Always invalidate cache when data is updated:
```typescript
// After updating user
await context.prisma.user.update({ where: { id }, data });
await CacheUtils.invalidateUserCache(id);
```

### 3. Error Handling
Redis operations should be wrapped in try-catch:
```typescript
try {
  await CacheUtils.cacheData(key, data);
} catch (error) {
  console.error('Cache operation failed:', error);
  // Continue without cache
}
```

### 4. Memory Management
Monitor Redis memory usage and set appropriate limits:
```bash
# Set max memory (in redis.conf or via CONFIG)
CONFIG SET maxmemory 100mb
CONFIG SET maxmemory-policy allkeys-lru
```

## Troubleshooting

### Connection Issues

1. **Redis not running**:
   ```bash
   # Check if Redis is running
   redis-cli ping
   # Should return PONG
   ```

2. **Port conflicts**:
   ```bash
   # Check if port 6379 is in use
   lsof -i :6379
   ```

3. **Docker issues**:
   ```bash
   # Check container status
   docker ps | grep redis
   
   # View logs
   docker logs bringfresh_redis
   ```

### Performance Issues

1. **High memory usage**:
   ```bash
   # Check memory usage
   redis-cli info memory
   ```

2. **Slow queries**:
   ```bash
   # Monitor slow queries
   redis-cli slowlog get 10
   ```

## Development Workflow

1. **Start services**:
   ```bash
   docker-compose up -d
   ```

2. **Run migrations**:
   ```bash
   yarn prisma:migrate
   ```

3. **Start development server**:
   ```bash
   yarn dev
   ```

4. **Test cache endpoints**:
   ```bash
   curl http://localhost:4000/cache/test
   ```

## Production Considerations

1. **Redis Persistence**: Enable AOF (Append Only File) for data persistence
2. **Security**: Set strong passwords and use SSL/TLS
3. **Monitoring**: Use Redis monitoring tools like RedisInsight
4. **Backup**: Implement regular backup strategies
5. **Scaling**: Consider Redis Cluster for high availability

## Additional Resources

- [Redis Documentation](https://redis.io/documentation)
- [ioredis Documentation](https://github.com/luin/ioredis)
- [Redis Best Practices](https://redis.io/topics/memory-optimization) 