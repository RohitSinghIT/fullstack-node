#!/bin/bash

# Function to handle script termination
cleanup() {
    echo "Shutting down..."
    # Kill all background processes
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Set up trap for cleanup on script termination
trap cleanup SIGINT SIGTERM

echo "🚀 Setting up BringFresh Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

# Generate GraphQL types
echo "📊 Generating GraphQL types..."
yarn codegen

# Function to start the full development environment

echo "🚀 Starting full development environment..."
    
# Start the API database and Redis
echo "Starting API database and Redis..."
docker-compose up -d postgres redis

# Wait a moment for services to start
echo "⏳ Waiting for services to start..."
sleep 3

# Check if Redis is running
echo "🔍 Checking Redis connection..."
if docker exec bringfresh_redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is running and responding"
else
    echo "⚠️  Redis might not be ready yet, but continuing..."
fi

# Start the API server in the background
echo "Starting API server..."
yarn dev &
API_PID=$!

# Wait for both processes
wait $API_PID

echo ""
echo "🎉 Development environment is running!"
echo "📊 API: http://localhost:4000"
echo "🔍 GraphQL: http://localhost:4000/graphql"
echo "🏥 Health: http://localhost:4000/health"
echo "🗄️  Cache Management:"
echo "   - Stats: http://localhost:4000/cache/stats"
echo "   - Info: http://localhost:4000/cache/info"
echo "   - Test: http://localhost:4000/cache/test"
echo "🔧 Redis CLI: docker exec -it bringfresh_redis redis-cli"

