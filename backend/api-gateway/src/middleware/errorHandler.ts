import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse, isAppError } from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * Global Error Handler Middleware
 * Catches all errors and sends structured error responses
 * Follows the AI rules: resilience, error handling, and clean code
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const requestInfo = {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  };

  if (isAppError(err)) {
    logger.warn(`AppError in ${req.method} ${req.path}`, {
      ...requestInfo,
      code: err.code,
      message: err.message,
    });
  } else {
    logger.error(`Unexpected error in ${req.method} ${req.path}`, {
      ...requestInfo,
      error: err.message,
      stack: err.stack,
    });
  }

  sendErrorResponse(res, err);
}

/**
 * 404 Not Found Handler
 * Handles requests to non-existent routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    status: 404,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
    timestamp: new Date().toISOString(),
    path: req.path,
  });
}

/**
 * Async Error Wrapper
 * Wraps async route handlers to catch errors and pass to error handler
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
