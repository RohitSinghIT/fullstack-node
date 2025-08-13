import { Router } from 'express';
import webRoutes from './web';
import cacheRoutes from './cache';

const router = Router();

// Panel/Dashboard APIs (No versioning - GraphQL)
router.use('/web', webRoutes);
router.use('/cache', cacheRoutes);

// API Version Info
router.get('/versions', (req, res) => {
  res.json({
    success: true,
    data: {
      panel: {
        type: 'GraphQL',
        endpoint: '/graphql',
        version: 'latest',
        description: 'Panel/Dashboard APIs - No versioning',
      },
      mobile: {
        v1: {
          type: 'GraphQL',
          endpoint: '/graphql/mobile/v1',
          status: 'stable',
          description: 'Mobile app APIs - Versioned GraphQL',
        },
      },
    },
  });
});

export default router; 