import app from './app';
import { config, validateConfig } from './config';
import { logger } from './utils/logger';

/**
 * Server Initialization
 * Handles configuration validation, server startup, and graceful shutdown
 */
async function startServer(): Promise<void> {
  try {
    // Validate configuration
    validateConfig();
    logger.info('Configuration validated successfully');

    // Start the server
    const server = app.listen(config.app.port, () => {
      logger.info(`🚀 ${config.app.name} running on port ${config.app.port}`);
      logger.info(`📊 Health check available at http://localhost:${config.app.port}/api/health`);
      logger.info(`📖 Documentation available at http://localhost:${config.app.port}/api/docs`);
      logger.info(`Environment: ${config.app.env}`);
    });

    // ========================================
    // Graceful Shutdown Handlers
    // ========================================

    /**
     * SIGTERM Handler
     * Triggered by orchestrators during planned shut downs
     */
    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('Force shutting down due to timeout');
        process.exit(1);
      }, 30000);
    });

    /**
     * SIGINT Handler
     * Triggered by Ctrl+C
     */
    process.on('SIGINT', () => {
      logger.info('SIGINT signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('Force shutting down due to timeout');
        process.exit(1);
      }, 30000);
    });

    // ========================================
    // Unhandled Error Handlers
    // ========================================

    /**
     * Unhandled Promise Rejection Handler
     */
    process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
      logger.error('Unhandled Rejection', {
        reason: reason instanceof Error ? reason.message : String(reason),
        promise: String(promise),
      });

      // In production, consider alerting and potentially restarting
      if (config.app.isProduction) {
        // TODO: Send alert to monitoring service
      }
    });

    /**
     * Uncaught Exception Handler
     */
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      // Graceful shutdown on uncaught exception
      server.close(() => {
        logger.error('Server closed due to uncaught exception');
        process.exit(1);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Force shutting down due to uncaught exception');
        process.exit(1);
      }, 10000);
    });
  } catch (error) {
    logger.error('Failed to start server', error instanceof Error ? error : { error });
    process.exit(1);
  }
}

// Start the server
startServer();