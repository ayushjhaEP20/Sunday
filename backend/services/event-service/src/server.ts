import app from './app';
import { config, validateConfig } from './config';
import { logger } from './utils/logger';

/**
 * Event Service Server Entry Point
 * Production-grade microservice for event management in the Sunday platform
 * Follows strict layering and resilience standards per AI rules
 */
async function startServer(): Promise<void> {
  try {
    // Validate configuration at startup (Resilience requirement)
    validateConfig();
    logger.info('Event Service configuration validated successfully');

    // Start the HTTP server
    const server = app.listen(config.app.port, () => {
      logger.info(`🚀 Event Service running on port ${config.app.port}`);
      logger.info(`📊 Health check available at http://localhost:${config.app.port}/api/health`);
      logger.info(`📖 Documentation available at http://localhost:${config.app.port}/api/docs`);
      logger.info(`Environment: ${config.app.env}`);
      logger.info(`Service: event-service`);
    });

    // ========================================
    // Graceful Shutdown Handlers (Resilience)
    // ========================================

    /**
     * SIGTERM Handler - Kubernetes/Docker orchestrated shutdown
     */
    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing Event Service HTTP server');
      server.close(() => {
        logger.info('Event Service HTTP server closed gracefully');
        process.exit(0);
      });

      // Force shutdown after 30 seconds if graceful shutdown fails
      setTimeout(() => {
        logger.error('Force shutting down Event Service due to timeout');
        process.exit(1);
      }, 30000);
    });

    /**
     * SIGINT Handler - Development shutdown (Ctrl+C)
     */
    process.on('SIGINT', () => {
      logger.info('SIGINT signal received: closing Event Service HTTP server');
      server.close(() => {
        logger.info('Event Service HTTP server closed gracefully');
        process.exit(0);
      });

      // Force shutdown after 30 seconds if graceful shutdown fails
      setTimeout(() => {
        logger.error('Force shutting down Event Service due to timeout');
        process.exit(1);
      }, 30000);
    });

    // ========================================
    // Unhandled Error Handlers (Resilience)
    // ========================================

    /**
     * Unhandled Promise Rejection Handler
     * Catches async errors that weren't properly handled
     */
    process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
      logger.error('Event Service - Unhandled Promise Rejection', {
        reason: reason instanceof Error ? reason.message : String(reason),
        promise: String(promise),
      });

      // In production, send alerts to monitoring service
      if (config.app.isProduction) {
        // TODO: Integrate with monitoring/alerting system
        // Example: sendAlert('Event Service Unhandled Rejection', { reason, promise });
      }
    });

    /**
     * Uncaught Exception Handler
     * Catches synchronous errors that bubble up
     */
    process.on('uncaughtException', (error: Error) => {
      logger.error('Event Service - Uncaught Exception', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      // Graceful shutdown on uncaught exception
      server.close(() => {
        logger.error('Event Service server closed due to uncaught exception');
        process.exit(1);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Force shutting down Event Service due to uncaught exception');
        process.exit(1);
      }, 10000);
    });

  } catch (error) {
    logger.error('Failed to start Event Service', error instanceof Error ? error : { error });
    process.exit(1);
  }
}

// ========================================
// Server Startup (Clean Code - Single Responsibility)
// ========================================
startServer().catch((error) => {
  console.error('Critical error during Event Service startup:', error);
  process.exit(1);
});