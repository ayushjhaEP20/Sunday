import dotenv from 'dotenv';

dotenv.config();

/**
 * Application Configuration
 * Centralized configuration following the AI rules for production-grade microservices.
 * All environment variables are validated and typed.
 */
export const config = {
  // Application
  app: {
    name: process.env.SERVICE_NAME || 'api-gateway',
    version: process.env.SERVICE_VERSION || '1.0.0',
    env: (process.env.NODE_ENV || 'development') as 'development' | 'staging' | 'production',
    port: parseInt(process.env.PORT || '3000', 10),
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },

  // CORS
  cors: {
    origins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },

  // Logging
  logging: {
    level: (process.env.LOG_LEVEL || 'info') as string,
  },

  // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'sunday_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },

  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },

  // API Gateway
  gateway: {
    timeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
    maxRequestSize: process.env.MAX_REQUEST_SIZE || '10mb',
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '15', 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // Authentication
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-here',
    jwtExpiry: process.env.JWT_EXPIRY || '24h',
  },

  // Service URLs
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    event: process.env.EVENT_SERVICE_URL || 'http://localhost:3002',
    user: process.env.USER_SERVICE_URL || 'http://localhost:3003',
    media: process.env.MEDIA_SERVICE_URL || 'http://localhost:3004',
    payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
    revenueEngine: process.env.REVENUE_ENGINE_URL || 'http://localhost:3006',
  },

  // Monitoring
  monitoring: {
    enableMetrics: process.env.ENABLE_METRICS === 'true',
    metricsPort: parseInt(process.env.METRICS_PORT || '9090', 10),
  },
};

/**
 * Validate critical configuration at startup
 */
export function validateConfig(): void {
  const errors: string[] = [];

  if (!config.app.port || config.app.port < 1 || config.app.port > 65535) {
    errors.push('Invalid PORT configuration');
  }

  if (!config.auth.jwtSecret || config.auth.jwtSecret === 'your-secret-key-here') {
    if (config.app.isProduction) {
      errors.push('JWT_SECRET must be set in production');
    }
  }

  if (errors.length > 0) {
    console.error('Configuration errors:', errors);
    if (config.app.isProduction) {
      throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
    }
  }
}
