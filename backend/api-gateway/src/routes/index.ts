import { Router, Request, Response } from 'express';
import { sendSuccessResponse } from '../utils/response';
import { healthRouter } from './health';

/**
 * Main API Router
 * Aggregates all route groups following the layering standards
 */
export const apiRouter = Router();

/**
 * Health check routes
 */
apiRouter.use('/health', healthRouter);

/**
 * Service Status Endpoint
 * GET /
 */
apiRouter.get('/', (req: Request, res: Response) => {
  const response = {
    service: process.env.SERVICE_NAME || 'api-gateway',
    version: process.env.SERVICE_VERSION || '1.0.0',
    message: 'API Gateway is operational',
    documentation: '/docs',
  };

  sendSuccessResponse(res, response, 200);
});

/**
 * API Documentation Placeholder
 * GET /docs
 */
apiRouter.get('/docs', (req: Request, res: Response) => {
  const response = {
    title: 'API Gateway Documentation',
    version: process.env.SERVICE_VERSION || '1.0.0',
    paths: {
      '/health': {
        description: 'Health check endpoints',
        endpoints: [
          { method: 'GET', path: '/health', description: 'Generic health check' },
          { method: 'GET', path: '/health/live', description: 'Liveness probe' },
          { method: 'GET', path: '/health/ready', description: 'Readiness probe' },
        ],
      },
    },
  };

  sendSuccessResponse(res, response, 200);
});
