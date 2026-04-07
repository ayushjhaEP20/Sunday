# API Gateway Microservice

This is the API Gateway microservice for the event platform, built with Express and TypeScript.

## Features

- **Security**: Helmet for security headers
- **CORS**: Configurable cross-origin resource sharing
- **Logging**: Morgan for HTTP request logging
- **Error Handling**: Centralized error handling middleware
- **Health Checks**: Built-in health check endpoint
- **TypeScript**: Full TypeScript support with strict configuration

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This starts the server with hot reloading using nodemon and ts-node.

### Production Build

```bash
npm run build
npm start
```

## Environment Variables

Copy `.env.example` to `.env` and configure the variables:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS
- Service URLs for routing to microservices

## API Endpoints

- `GET /health` - Health check
- `GET /` - Service info

## Architecture

This service follows microservice architecture principles:

- Stateless design
- Centralized error handling
- Security-first approach
- Production-ready logging and monitoring