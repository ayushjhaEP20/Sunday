import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { config, validateConfig } from './config';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLoggerMiddleware, requestIdMiddleware } from './middleware/requestLogger';
import { apiRouter } from './routes';

/**
 * Application Factory
 * Creates and configures the Express application following production-grade standards
 * Implements strict layering and error handling as per AI rules
 */
export function createApp(): Application {
  const app: Application = express();

  // ========================================
  // Security & CORS Middleware
  // ========================================

  // Helmet for security headers
  app.use(helmet());
  logger.debug('Helmet security middleware configured');

  // CORS configuration
  app.use(cors({
    origin: config.cors.origins,
    credentials: config.cors.credentials,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  }));
  logger.debug('CORS middleware configured');

  // ========================================
  // Request Processing Middleware
  // ========================================

  // Morgan logging (HTTP request logging)
  app.use(
    morgan(config.app.isDevelopment ? 'dev' : 'combined', {
      skip: (req: Request) => req.method === 'OPTIONS',
    }),
  );

  // Request ID middleware
  app.use(requestIdMiddleware);

  // Custom request logger middleware
  app.use(requestLoggerMiddleware);

  // Body parsing middleware
  app.use(express.json({ limit: config.gateway.maxRequestSize }));
  app.use(
    express.urlencoded({
      extended: true,
      limit: config.gateway.maxRequestSize,
    }),
  );

  logger.debug('Request processing middleware configured');

  // ========================================
  // API Routes
  // ========================================

  app.use('/api', apiRouter);

  logger.debug('API routes configured');

  // ========================================
  // 404 Handler
  // ========================================

  app.use(notFoundHandler);

  // ========================================
  // Error Handling Middleware
  // ========================================

  app.use(errorHandler);

  logger.info('Express application configured successfully');

  return app;
}

// Create app instance
const app = createApp();

export default app;