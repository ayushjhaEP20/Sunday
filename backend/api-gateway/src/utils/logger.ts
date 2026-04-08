import { config } from '../config';

/**
 * Log Levels
 */
export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

/**
 * Logger utility for structured logging
 * Provides consistent logging format across the microservice
 */
export class Logger {
  private readonly serviceName: string;

  constructor(serviceName: string = config.app.name) {
    this.serviceName = serviceName;
  }

  /**
   * Format log message with standard structure
   */
  private formatMessage(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${this.serviceName}] [${level}] ${message}${metaStr}`;
  }

  /**
   * Log error level messages
   */
  error(message: string, meta?: Record<string, unknown> | Error): void {
    let metadata = meta;
    if (meta instanceof Error) {
      metadata = {
        name: meta.name,
        message: meta.message,
        stack: meta.stack,
      };
    }
    console.error(this.formatMessage(LogLevel.ERROR, message, metadata as Record<string, unknown>));
  }

  /**
   * Log warning level messages
   */
  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, meta));
  }

  /**
   * Log info level messages
   */
  info(message: string, meta?: Record<string, unknown>): void {
    console.info(this.formatMessage(LogLevel.INFO, message, meta));
  }

  /**
   * Log debug level messages (only in development)
   */
  debug(message: string, meta?: Record<string, unknown>): void {
    if (config.app.isDevelopment || config.logging.level === 'debug') {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, meta));
    }
  }
}

/**
 * Global logger instance
 */
export const logger = new Logger();
