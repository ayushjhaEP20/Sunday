import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

/**
 * Event Service Express Application
 * Production-ready microservice for event management in the Sunday platform
 * Follows strict layering and resilience standards per AI rules
 */
const app: Application = express();

// ========================================
// Security & Core Middleware
// ========================================

// Helmet for security headers (Production-grade security)
app.use(helmet());

// CORS configuration (Cross-origin resource sharing)
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

// Morgan for HTTP request logging (Observability)
app.use(morgan('combined'));

// Body parsing middleware (JSON payloads)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========================================
// Health Check Endpoint
// ========================================

/**
 * Health Check Endpoint
 * GET /health
 * Returns service health status for monitoring and orchestration
 */
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    service: 'event-service',
  });
});

import eventRoutes from './routes/event.routes';

// ========================================
// API Routes
// ========================================

/**
 * Event Service API Routes
 * Mounted at /api/events
 * Handles all event-related operations
 */
app.use('/api/events', eventRoutes);

// ========================================
// 404 Handler
// ========================================

/**
 * 404 Not Found Handler
 * Catches requests to non-existent routes
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: 'Route not found'
  });
});
export default app;