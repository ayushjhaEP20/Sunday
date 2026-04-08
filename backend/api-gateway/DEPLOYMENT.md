# Production Deployment Checklist

## Pre-Deployment

- [ ] All tests passing: `npm test`
- [ ] TypeScript compiles without errors: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] Code coverage adequate (>80% target)
- [ ] No console.log statements (use logger instead)
- [ ] All dependencies pinned to specific versions
- [ ] Security audit passed: `npm audit`

## Environment Configuration

- [ ] `.env` file configured for target environment
- [ ] Database credentials set securely (use secrets manager)
- [ ] JWT_SECRET configured (minimum 32 characters)
- [ ] LOG_LEVEL set appropriately (info for production)
- [ ] ALLOWED_ORIGINS configured for CORS
- [ ] All service URLs reachable and verified

## Docker Deployment

### Build
```bash
docker build -t api-gateway:latest .
docker tag api-gateway:latest api-gateway:1.0.0
```

### Test
```bash
docker run -it -p 3000:3000 \
  -e NODE_ENV=development \
  api-gateway:latest
```

### Push
```bash
docker push registry.example.com/api-gateway:1.0.0
```

Deployment Checklist for Docker:
- [ ] Image builds successfully
- [ ] Health checks pass
- [ ] Container logs are clean
- [ ] Security scan passed

## Kubernetes Deployment

### Prerequisites
- [ ] kubectl configured
- [ ] Namespace created or verified
- [ ] Secrets created: `kubectl apply -f k8s-config.yaml`
- [ ] ConfigMaps created
- [ ] PersistentVolumes provisioned (if needed)

### Deploy
```bash
kubectl apply -f k8s-config.yaml
kubectl apply -f k8s-deployment.yaml
```

### Verify
```bash
kubectl get pods -l app=api-gateway
kubectl logs -f deployment/api-gateway
kubectl port-forward service/api-gateway 3000:80
```

Deployment Checklist for Kubernetes:
- [ ] Pods are running and ready
- [ ] Liveness probes passing
- [ ] Readiness probes passing
- [ ] No pending or crashing pods
- [ ] HPA configured and monitoring metrics
- [ ] Service endpoints healthy

## Post-Deployment

### Monitoring
- [ ] Application logs flowing to centralized logging
- [ ] Metrics exported to Prometheus
- [ ] Alerts configured for critical errors
- [ ] Dashboard created in Grafana

### Health Checks
- [ ] `/api/health` returns 200 OK
- [ ] `/api/health/live` returns 200 OK
- [ ] `/api/health/ready` returns 200 OK
- [ ] Connectivity to downstream services verified

### Testing
- [ ] Smoke tests passed
- [ ] Integration tests passed with production config
- [ ] Synthetic monitoring started
- [ ] Error tracking (e.g., Sentry) receiving reports

### Rollback Plan
- [ ] Previous version deployable
- [ ] Database migrations reversible
- [ ] Rollback procedure documented
- [ ] Team briefed on rollback process

## Monitoring & Observability

### Key Metrics to Monitor
- Request rate (requests/sec)
- Response time (p50, p95, p99)
- Error rate (5xx errors)
- CPU usage
- Memory usage
- Database connection pool status

### Key Alerts
- Error rate > 1%
- Response time p99 > 1000ms
- Memory usage > 80%
- CPU usage > 80%
- Service unavailable (health check failing)

### Logging
- All errors logged with stack traces
- Request/response logging with IDs for tracing
- Structured logs for easy parsing
- Appropriate log levels (ERROR, WARN, INFO, DEBUG)

## Troubleshooting

### Service won't start
```bash
# Check logs
docker logs <container-id>
kubectl logs deployment/api-gateway

# Check environment variables
docker exec <container-id> printenv
kubectl describe pod <pod-name>

# Check connectivity
docker exec <container-id> nc -zv postgres 5432
```

### High memory usage
```bash
# Check for memory leaks
kubectl top pods -l app=api-gateway

# Check for connection pool issues
# Review logs for connection warnings

# Increase resource limits if needed
```

### Slow response times
```bash
# Check downstream service health
curl http://auth-service/health

# Check database query performance
# Review slow query logs

# Check for connection timeouts
```

## Rollback Procedure

1. **Identify Issue**
   ```bash
   kubectl describe deployment api-gateway
   kubectl logs <pod-name> --tail=100
   ```

2. **Rollback to Previous Version**
   ```bash
   kubectl rollout undo deployment/api-gateway
   kubectl rollout status deployment/api-gateway
   ```

3. **Verify Health**
   ```bash
   curl http://localhost:3000/api/health
   ```

4. **Post-Incident**
   - Review logs and metrics
   - Identify root cause
   - Create incident report
   - Update processes if needed
