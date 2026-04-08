# Development Guidelines

## Quick Start

### Option 1: Local Development

```bash
# Setup
npm install
cp .env.example .env
# Edit .env with your configuration

# Development
npm run dev

# Testing
npm test
npm run test:watch

# Production build
npm run build
npm start
```

### Option 2: Docker Development

```bash
# Build and start all services
docker-compose up

# View logs
docker-compose logs -f api-gateway

# Stop services
docker-compose down
```

### Option 3: Using Make

```bash
make install      # Install dependencies
make dev         # Start dev server
make docker-up   # Docker Compose up
make docker-down # Docker Compose down
make test        # Run tests
make lint        # Run linter
```

## File Structure Explanation

```
api-gateway/
├── src/
│   ├── config/          # Configuration management
│   │   └── index.ts     # Environment variables and config
│   ├── middleware/      # Express middleware
│   │   ├── errorHandler.ts      # Global error handling
│   │   ├── requestLogger.ts     # Request logging
│   │   └── validation.ts        # Request validation
│   ├── routes/          # API route definitions
│   │   ├── index.ts     # Main router
│   │   └── health.ts    # Health check endpoints
│   ├── controllers/     # HTTP Request handlers
│   │   └── healthController.ts
│   ├── services/        # Business logic layer
│   │   └── healthService.ts
│   ├── utils/           # Utility functions
│   │   ├── errors.ts            # Error classes
│   │   ├── logger.ts            # Logging utility
│   │   └── response.ts          # Response formatting
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   ├── app.ts          # Express app configuration
│   └── server.ts       # Server startup
├── tests/               # Test files
│   ├── unit/           # Unit tests
│   └── integration/    # Integration tests
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── jest.config.js      # Testing configuration
├── .eslintrc.json      # Linting configuration
├── Dockerfile          # Docker image definition
├── docker-compose.yml  # Development environment
├── k8s-deployment.yaml # Kubernetes deployment
└── README-UPDATED.md   # Documentation
```

## Architecture & Layering

Following the AI rules, the application strictly enforces layering:

### 1. Controller Layer
- Handles HTTP routing only
- Validates input (delegates to middleware)
- Calls services for business logic
- Formats responses

Example:
```typescript
export const getHealthStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const status = await healthService.getHealthStatus();
  sendSuccessResponse(res, status, 200);
});
```

### 2. Service Layer
- Contains all business logic
- Calls repository/model layer for data access
- Handles calculations, validations, transformations
- No HTTP concerns

Example:
```typescript
export async getHealthStatus(): Promise<HealthStatus> {
  // Business logic here
  return status;
}
```

### 3. Model/Repository Layer
- Manages data access patterns
- Abstracts database queries
- Handles data transformations from database format

Example:
```typescript
export async getUser(id: string): Promise<User | null> {
  return db.query('SELECT * FROM users WHERE id = $1', [id]);
}
```

### 4. Middleware Layer
- Cross-cutting concerns
- Error handling
- Logging
- Validation
- Authentication
- CORS, security headers

## Adding New Features

### Example: Add a new route

**1. Create Controller** (`src/controllers/userController.ts`)
```typescript
export const getUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  sendSuccessResponse(res, user, 200);
});
```

**2. Create Service** (`src/services/userService.ts`)
```typescript
export class UserService {
  async getUserById(id: string): Promise<User> {
    // Business logic
    return userRepository.findById(id);
  }
}
```

**3. Create Routes** (`src/routes/user.ts`)
```typescript
export const userRouter = Router();
userRouter.get('/:id', getUser);
```

**4. Add to Main Router** (`src/routes/index.ts`)
```typescript
import { userRouter } from './user';
apiRouter.use('/users', userRouter);
```

**5. Add Tests** (`tests/unit/services/userService.test.ts`)
```typescript
describe('UserService', () => {
  it('should get user by ID', async () => {
    const user = await userService.getUserById('123');
    expect(user).toBeDefined();
  });
});
```

## Error Handling Pattern

Always use structured error handling:

```typescript
// ✓ Good - Uses custom error classes
if (!user) {
  throw new NotFoundError('User');
}

// ✓ Good - Validation errors
throw new ValidationError('Invalid email', { email: ['Invalid format'] });

// ✗ Bad - Generic Error
throw new Error('User not found');

// ✗ Bad - HTTP response directly
res.status(404).json({ error: 'Not found' });
```

Error responses are automatically formatted:
```json
{
  "success": false,
  "status": 400,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": { "email": ["Invalid format"] }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "status": 200,
  "data": { /* actual data */ },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Logging Standards

Use the logger utility for all output:

```typescript
import { logger } from '../utils/logger';

// Info level - Important business events
logger.info('User login successful', { userId: '123' });

// Warn level - Unexpected but recoverable situations
logger.warn('Database connection slow', { duration: 1500 });

// Error level - Error conditions
logger.error('Failed to send email', error);

// Debug level - Detailed development info
logger.debug('Processing request', { requestId: '...' });
```

## Testing Guidelines

### Unit Tests
- Test services independently
- Mock dependencies
- Focus on business logic

```typescript
it('should authenticate user with valid credentials', async () => {
  const user = await authService.authenticate('user@example.com', 'password');
  expect(user).toBeDefined();
  expect(user.id).toBe('123');
});
```

### Integration Tests
- Test with real dependencies
- Test API endpoints end-to-end
- Verify database interactions

```typescript
it('should return 200 on GET /api/users/:id', async () => {
  const response = await request(app).get('/api/users/123');
  expect(response.status).toBe(200);
  expect(response.body.data).toBeDefined();
});
```

## Code Quality Checklist

Before committing:

- [ ] `npm run lint` passes (no errors, minimal warnings)
- [ ] `npm run type-check` passes (no TypeScript errors)
- [ ] `npm test` passes (all tests green)
- [ ] Code follows DRY principle (no duplication)
- [ ] Error handling implemented
- [ ] Logging added where appropriate
- [ ] No console.log statements
- [ ] Types are properly defined
- [ ] Comments added for complex logic
- [ ] No unused imports or variables

## Environment Variables

Create `.env` based on `.env.example`:

```env
# Application
NODE_ENV=development
PORT=3000

# Logging
LOG_LEVEL=debug

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sunday_db
DB_USER=postgres
DB_PASSWORD=postgres

# Secrets
JWT_SECRET=dev-secret-key
```

**DO NOT commit .env file. It contains secrets.**

## Debugging Tips

### 1. Enable Debug Logging
```env
LOG_LEVEL=debug
NODE_DEBUG=*
```

### 2. Inspect Request/Response
```typescript
app.use((req, res, next) => {
  console.log('REQUEST:', req.method, req.path, req.body);
  next();
});
```

### 3. VSCode Debugging
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/node_modules/.bin/ts-node",
      "args": ["-P", "tsconfig.dev.json", "src/server.ts"],
      "console": "integratedTerminal"
    }
  ]
}
```

## Common Issues

### Issue: Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000    # Windows
```

### Issue: Module not found
```bash
# Rebuild node_modules
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors after updating
```bash
npm run type-check
# Review the errors and fix
npm run build
```

## Performance Optimization

1. **Use connection pooling** for databases
2. **Implement caching** for frequently accessed data
3. **Use pagination** for list endpoints
4. **Compress responses** with gzip
5. **Use async/await** properly to avoid blocking
6. **Monitor slow queries** in database
7. **Profile memory** for leaks
8. **Implement rate limiting** to prevent abuse

## Security Best Practices

1. ✓ Use HTTPS in production
2. ✓ Validate all inputs
3. ✓ Use parameterized queries
4. ✓ Implement rate limiting
5. ✓ Use strong JWT secrets
6. ✓ Sanitize error messages
7. ✓ Use security headers (Helmet)
8. ✓ Implement CORS properly
9. ✓ Use secrets manager for credentials
10. ✓ Keep dependencies updated

## Additional Resources

- [Express Documentation](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Testing Best Practices](https://testingjavascript.com/)
