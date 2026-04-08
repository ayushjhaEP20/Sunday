import { Router, Request, Response } from 'express';
import { sendSuccessResponse } from '../utils/response';
import { logger } from '../utils/logger';

/**
 * Health Check Routes
 * Provides liveness and readiness probes for Kubernetes/Docker orchestration
 */
export const healthRouter = Router();

/**
 * Liveness Probe
 * Used by orchestrators to determine if the service is alive
 * GET /health/live
 */
healthRouter.get('/live', (req: Request, res: Response) => {
  const response = {
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };

  logger.debug('Liveness probe', response);
  sendSuccessResponse(res, response, 200);
});

/**
 * Readiness Probe
 * Used by orchestrators to determine if the service is ready to handle traffic
 * GET /health/ready
 */
healthRouter.get('/ready', (req: Request, res: Response) => {
  const response = {
    status: 'ready',
    timestamp: new Date().toISOString(),
    checks: {
      database: 'ok', // TODO: Add actual database health check
      cache: 'ok', // TODO: Add actual cache health check
    },
  };

  logger.debug('Readiness probe', response);
  sendSuccessResponse(res, response, 200);
});

/**
 * Generic Health Check
 * GET /health
 */
healthRouter.get('/', (req: Request, res: Response) => {
  const response = {
    service: process.env.SERVICE_NAME || 'api-gateway',
    version: process.env.SERVICE_VERSION || '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  };

  logger.debug('Health check', response);
  sendSuccessResponse(res, response, 200);
});
