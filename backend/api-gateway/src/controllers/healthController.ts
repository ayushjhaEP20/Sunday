/**
 * Example Health Check Controller
 * Demonstrates the Controller → Service → Model layering pattern
 * Following the AI rules for strict separation of concerns
 */

import { Request, Response } from 'express';
import { sendSuccessResponse } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Get health status
 * GET /api/health
 */
export const getHealthStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const status = {
    service: process.env.SERVICE_NAME || 'api-gateway',
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };

  sendSuccessResponse(res, status, 200);
});

/**
 * Get liveness probe status
 * GET /api/health/live
 */
export const getLivenessProbe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const status = {
    status: 'alive',
    timestamp: new Date().toISOString(),
  };

  sendSuccessResponse(res, status, 200);
});

/**
 * Get readiness probe status
 * GET /api/health/ready
 */
export const getReadinessProbe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // TODO: Add actual readiness checks
  // - Database connectivity
  // - Cache connectivity
  // - External service connectivity

  const status = {
    status: 'ready',
    checks: {
      database: 'ok',
      cache: 'ok',
    },
    timestamp: new Date().toISOString(),
  };

  sendSuccessResponse(res, status, 200);
});
