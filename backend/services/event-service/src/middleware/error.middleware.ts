import { ErrorRequestHandler } from 'express';
import { config } from '../config';

/**
 * Global Error Handler
 * Converts thrown or forwarded errors into a consistent JSON response.
 * Returns stack traces only in development to avoid leaking internals in production.
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = typeof (err as any).status === 'number' ? (err as any).status : 500;
  const message = err?.message || 'Internal server error';

  const payload: {
    success: false;
    message: string;
    stack?: string;
  } = {
    success: false,
    message,
  };

  if (config.nodeEnv === 'development' && err?.stack) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};