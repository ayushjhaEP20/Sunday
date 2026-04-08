#!/bin/bash
# Initialize the API Gateway with example services

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Initializing API Gateway structure...${NC}"

# Create directories if they don't exist
mkdir -p src/controllers
mkdir -p src/services
mkdir -p src/models
mkdir -p src/middleware
mkdir -p src/routes
mkdir -p src/utils
mkdir -p src/types
mkdir -p src/config
mkdir -p tests/unit
mkdir -p tests/integration

echo -e "${GREEN}✓${NC} Directory structure created"

# Check for required files
required_files=(
    "package.json"
    ".env.example"
    "tsconfig.json"
    "README-UPDATED.md"
)

echo -e "${YELLOW}Checking required files...${NC}"
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file (missing)"
    fi
done

echo ""
echo -e "${GREEN}✓${NC} Initialization complete!"
echo ""
echo "Quick start:"
echo "  npm install        # Install dependencies"
echo "  npm run dev        # Start dev server"
echo "  npm run build      # Build for production"
echo "  npm test           # Run tests"
