#!/bin/bash

echo "🧪 Testing Redis Connection..."

# Test Redis connection via Docker
echo "1. Testing Redis container..."
if docker ps | grep -q bringfresh_redis; then
    echo "✅ Redis container is running"
else
    echo "❌ Redis container is not running"
    echo "   Run: docker-compose up -d redis"
    exit 1
fi

# Test Redis CLI connection
echo "2. Testing Redis CLI connection..."
if docker exec bringfresh_redis redis-cli ping | grep -q PONG; then
    echo "✅ Redis is responding to ping"
else
    echo "❌ Redis is not responding"
    exit 1
fi

# Test Redis database size
echo "3. Checking Redis database size..."
DB_SIZE=$(docker exec bringfresh_redis redis-cli dbsize)
echo "   Database size: $DB_SIZE keys"

# Test basic Redis operations
echo "4. Testing basic Redis operations..."
docker exec bringfresh_redis redis-cli set test:key "Hello Redis!" > /dev/null
if docker exec bringfresh_redis redis-cli get test:key | grep -q "Hello Redis!"; then
    echo "✅ Redis set/get operations working"
else
    echo "❌ Redis set/get operations failed"
fi

# Clean up test key
docker exec bringfresh_redis redis-cli del test:key > /dev/null

echo ""
echo "🎉 Redis is working correctly!"
echo ""
echo "Useful Redis commands:"
echo "  - Connect to Redis CLI: docker exec -it bringfresh_redis redis-cli"
echo "  - Check Redis info: docker exec bringfresh_redis redis-cli info"
echo "  - Monitor Redis: docker exec bringfresh_redis redis-cli monitor"
echo "  - List all keys: docker exec bringfresh_redis redis-cli keys '*'" 