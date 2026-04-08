import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Request Logger Middleware
 * Logs incoming requests and outgoing responses
 * Provides visibility into request flow and performance
 */
export function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const startTime = Date.now();
  const requestId = req.get('x-request-id') || generateRequestId();

  // Attach request ID to response headers
  res.setHeader('x-request-id', requestId);

  // Log incoming request
  logger.debug(`Incoming request`, {
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Capture response end to log response time
  const originalSend = res.send;
  res.send = function (data: unknown): Response {
    const duration = Date.now() - startTime;

    logger.debug(`Response sent`, {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });

    return originalSend.call(this, data);
  };

  next();
}

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Attach request ID to request object for use in handlers
 */
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  req.requestId = req.get('x-request-id') || generateRequestId();
  res.setHeader('x-request-id', req.requestId);
  next();
}
