#!/bin/bash

# Health Check Script for Docker
# Used by Docker HEALTHCHECK instruction to verify service is running

PORT="${PORT:-3000}"
TIMEOUT="${TIMEOUT:-3}"

# Attempt to connect to health endpoint
status=$(curl -s -o /dev/null -w "%{http_code}" \
  --connect-timeout "$TIMEOUT" \
  --max-time "$TIMEOUT" \
  "http://localhost:$PORT/api/health/live")

if [ "$status" -eq 200 ]; then
  exit 0
else
  exit 1
fi
