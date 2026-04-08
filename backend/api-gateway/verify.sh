#!/usr/bin/env bash

# Final verification checklist for TypeScript Express microservice setup

echo "═══════════════════════════════════════════════════════════════════"
echo "  API Gateway - TypeScript Express Microservice Verification"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check files
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        return 0
    else
        echo -e "${RED}✗${NC} $1/"
        return 1
    fi
}

echo "Configuration Files:"
echo "─────────────────────────────────────────────────────────────────"
check_file "package.json"
check_file "tsconfig.json"
check_file "tsconfig.dev.json"
check_file ".eslintrc.json"
check_file "jest.config.js"
check_file ".env.example"
echo ""

echo "Source Code:"
echo "─────────────────────────────────────────────────────────────────"
check_file "src/app.ts"
check_file "src/server.ts"
check_file "src/config/index.ts"
check_file "src/utils/logger.ts"
check_file "src/utils/errors.ts"
check_file "src/utils/response.ts"
check_file "src/middleware/errorHandler.ts"
check_file "src/middleware/requestLogger.ts"
check_file "src/middleware/validation.ts"
check_file "src/routes/index.ts"
check_file "src/routes/health.ts"
check_file "src/controllers/healthController.ts"
check_file "src/services/healthService.ts"
check_file "src/types/index.ts"
echo ""

echo "Tests:"
echo "─────────────────────────────────────────────────────────────────"
check_file "tests/utils/logger.test.ts"
echo ""

echo "Documentation:"
echo "─────────────────────────────────────────────────────────────────"
check_file "README-UPDATED.md"
check_file "DEVELOPMENT.md"
check_file "DEPLOYMENT.md"
echo ""

echo "Deployment & Infrastructure:"
echo "─────────────────────────────────────────────────────────────────"
check_file "Dockerfile"
check_file "docker-compose.yml"
check_file "k8s-deployment.yaml"
check_file "k8s-config.yaml"
check_file "Makefile"
check_file "healthcheck.sh"
echo ""

echo "Setup Scripts:"
echo "─────────────────────────────────────────────────────────────────"
check_file "setup.sh"
check_file "setup.bat"
check_file "init.sh"
echo ""

echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo -e "${YELLOW}Quick Start:${NC}"
echo "1. npm install              # Install dependencies"
echo "2. cp .env.example .env     # Setup environment"
echo "3. npm run dev              # Start development server"
echo ""
echo -e "${YELLOW}Or with Docker:${NC}"
echo "docker-compose up"
echo ""
echo -e "${YELLOW}Documentation:${NC}"
echo "- README-UPDATED.md  - Project overview and setup"
echo "- DEVELOPMENT.md     - Developer guide"
echo "- DEPLOYMENT.md      - Production deployment guide"
echo ""
echo "═══════════════════════════════════════════════════════════════════"
