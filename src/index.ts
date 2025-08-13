import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { join } from 'path';
import path from 'path';

// Load all GraphQL schema files for Panel
const typesArray = loadFilesSync(join(__dirname, 'graphql/schema'), {
  extensions: ['graphql'],
});

const typeDefs = mergeTypeDefs(typesArray);
import { resolvers } from './graphql/resolvers';

// Load Mobile V1 schema and resolvers
import { mobileV1Schema } from './graphql/mobile/v1';
import { mobileV1Resolvers } from './graphql/mobile/v1/resolvers';

import { prisma } from './lib/prisma';
import { redis, redisCache } from './lib/redis';
import { Context } from './types/context';
import { authMiddleware, AuthRequest } from './middleware/auth';
import { RequestHandler } from 'express';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Set up EJS view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Import routes
import routes from './routes';

// Mount routes
app.use('/', routes);

// Security middleware
app.use(helmet());
app.use(compression() as unknown as RequestHandler);  
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://bringfresh.in'] 
    : ['http://localhost:3000', 
      'http://localhost:3001',
      'http://localhost:5173'],
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Auth middleware
app.use(authMiddleware);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check Redis connection
    const redisStatus = redis.status;
    const redisConnected = redisStatus === 'ready';
    
    // Check database connection
    let dbConnected = false;
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbConnected = true;
    } catch (error) {
      console.error('Database connection error:', error);
    }
    
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      port: process.env.PORT || 4000,
      services: {
        database: dbConnected ? 'connected' : 'disconnected',
        redis: redisConnected ? 'connected' : 'disconnected',
        redisStatus
      },
      endpoints: {
        panel: `http://localhost:${process.env.PORT || 4000}/graphql`,
        mobile: `http://localhost:${process.env.PORT || 4000}/graphql/mobile/v1`,
        health: `http://localhost:${process.env.PORT || 4000}/health`
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

async function startServer() {
  // Create Panel Apollo Server
  const panelServer = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    formatError: (error) => {
      console.error('Panel GraphQL Error:', error);
      return {
        message: error.message,
        path: error.path,
      };
    },
    plugins: [
      {
        requestDidStart: async () => ({
          willSendResponse: async ({ response }) => {
            if (response.body.kind === 'single') {
              const { data, errors } = response.body.singleResult;
              if (errors) {
                console.error('Panel GraphQL Errors:', errors);
              }
            }
          },
        }),
      },
    ],
  });

  // Create Mobile V1 Apollo Server
  const mobileV1Server = new ApolloServer<Context>({
    typeDefs: mobileV1Schema,
    resolvers: mobileV1Resolvers,
    formatError: (error) => {
      console.error('Mobile V1 GraphQL Error:', error);
      return {
        message: error.message,
        path: error.path,
      };
    },
    plugins: [
      {
        requestDidStart: async () => ({
          willSendResponse: async ({ response }) => {
            if (response.body.kind === 'single') {
              const { data, errors } = response.body.singleResult;
              if (errors) {
                console.error('Mobile V1 GraphQL Errors:', errors);
              }
            }
          },
        }),
      },
    ],
  });

  // Start the servers
  await Promise.all([panelServer.start(), mobileV1Server.start()]);

  // Apply Panel Apollo middleware
  app.use(
    '/graphql',
    expressMiddleware(panelServer, {
      context: async ({ req, res }): Promise<Context> => {
        const authReq = req as AuthRequest;
        return {
          prisma,
          redis,
          redisCache,
          req,
          res,
          user: authReq.user,
        };
      },
    })
  );

  // Apply Mobile V1 Apollo middleware
  app.use(
    '/graphql/mobile/v1',
    expressMiddleware(mobileV1Server, {
      context: async ({ req, res }): Promise<Context> => {
        const authReq = req as AuthRequest;
        return {
          prisma,
          redis,
          redisCache,
          req,
          res,
          user: authReq.user,
        };
      },
    })
  );

  // Start the Express server
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
    console.log(`📊 Panel GraphQL: http://localhost:${PORT}/graphql`);
    console.log(`📱 Mobile V1 GraphQL: http://localhost:${PORT}/graphql/mobile/v1`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 