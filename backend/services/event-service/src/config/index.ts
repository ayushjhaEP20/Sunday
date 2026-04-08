import dotenv from 'dotenv';

/**
 * Event Service Configuration
 * Production-ready configuration management for the event-service microservice
 * Follows 12-factor app principles and Sunday platform standards
 */

// Load environment variables from .env file
dotenv.config();

/**
 * Configuration Interface
 * Defines the structure of configuration values
 */
interface Config {
  port: number;
  nodeEnv: string;
}

/**
 * Event Service Configuration
 * Centralized configuration with sensible defaults
 * Supports environment-driven configuration for different deployment environments
 */
export const config: Config = {
  // Server port configuration
  port: parseInt(process.env.PORT || '3002', 10),

  // Node environment (development, staging, production)
  nodeEnv: process.env.NODE_ENV || 'development',
};

/**
 * Validate Configuration
 * Ensures critical configuration values are properly set
 * Called at application startup to catch configuration errors early
 */
export function validateConfig(): void {
  const errors: string[] = [];

  // Validate port
  if (!config.port || config.port < 1 || config.port > 65535) {
    errors.push(`Invalid PORT: ${config.port}. Must be between 1 and 65535.`);
  }

  // Validate node environment
  const validEnvs = ['development', 'staging', 'production'];
  if (!validEnvs.includes(config.nodeEnv)) {
    errors.push(`Invalid NODE_ENV: ${config.nodeEnv}. Must be one of: ${validEnvs.join(', ')}`);
  }

  // Throw error if validation fails
  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
}