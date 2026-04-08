# API Gateway Microservice

Production-grade TypeScript Express microservice following the Sunday event platform architecture.

## Overview

This is the API Gateway service for the Sunday event platform - a high-performance microservice that routes requests to downstream services, handles cross-cutting concerns, and provides unified API access.

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript 5.3
- **Security**: Helmet, CORS
- **Logging**: Morgan + Winston-style structured logging
- **Development**: Nodemon + ts-node

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Development server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3000` with hot-reload enabled.

## Available Scripts

### Development

```bash
npm run dev          # Start with nodemon (hot reload)
npm run type-check   # Check TypeScript types
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
```

### Production

```bash
npm run build        # Compile TypeScript to JavaScript
npm run start        # Run compiled server
```

### Testing

```bash
npm test             # Run tests once
npm run test:watch   # Watch mode
npm run test:coverage # Generate coverage report
```

## Project Structure

```
src/
├── config/           # Configuration management
├── middleware/       # Express middleware (error handling, logging, validation)
├── routes/           # API route definitions
├── services/         # Business logic layer (to be implemented)
├── models/           # Data models and repositories (to be implemented)
├── controllers/      # Request handlers (to be implemented)
├── utils/            # Utility functions (errors, logging, responses)
├── types/            # TypeScript type definitions
├── app.ts           # Express app configuration
└── server.ts        # Server startup and shutdown logic
```

## API Endpoints

### Health Check

```
GET /api/health          # Generic health check
GET /api/health/live     # Liveness probe (Kubernetes)
GET /api/health/ready    # Readiness probe (Kubernetes)
```

### Service Status

```
GET /api/                # Service information
GET /api/docs           # API documentation
```

## Architecture Principles

This microservice follows the Sunday platform architecture guidelines:

### Strict Layering

- **Controllers**: Handle HTTP routing only
- **Services**: Contain all business logic
- **Models**: Manage data access and persistence
- **Middleware**: Cross-cutting concerns

### Production Standards

- **Error Handling**: Comprehensive try/catch with structured error types
- **Logging**: Structured logging with request IDs
- **Security**: Helmet for HTTP headers, CORS validation, request sanitization
- **Resilience**: Graceful shutdown, unhandled rejection handling, timeout management
- **Configuration**: Environment-driven (12-factor app principles)

### Code Quality

- **TypeScript**: Strict mode with noImplicitAny, strictNullChecks
- **Linting**: ESLint with TypeScript support
- **Testing**: Jest with TypeScript
- **DRY**: Utilities for common patterns (error handling, responses, validation)

## Configuration

Environment variables (see `.env.example`):

```
# Application
NODE_ENV=development
PORT=3000
SERVICE_NAME=api-gateway

# CORS
ALLOWED_ORIGINS=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sunday_db

# Service URLs
AUTH_SERVICE_URL=http://localhost:3001
EVENT_SERVICE_URL=http://localhost:3002
```

## Error Handling

The service provides standardized error responses:

```json
{
  "success": false,
  "status": 400,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "email": ["Invalid email format"]
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Logging

Structured logging with request IDs for tracing:

```
[2024-01-01T00:00:00.000Z] [api-gateway] [INFO] Health check available at http://localhost:3000/api/health
[2024-01-01T00:00:00.001Z] [api-gateway] [DEBUG] Incoming request {"requestId":"...","method":"GET","path":"/api/health"}
```

## Deployment

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD node healthcheck.js
CMD ["npm", "start"]
```

### Kubernetes

```yaml
livenessProbe:
  httpGet:
    path: /api/health/live
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /api/health/ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

## Contributing

Follow the architecture guidelines in `docs/architecture.md` and AI rules in `docs/ai_rules.md`.

## License

MIT
