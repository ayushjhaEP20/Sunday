#!/bin/bash
# Setup script for development environment

set -e

echo "🚀 Setting up API Gateway development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js $(node --version) found"
echo "✓ npm $(npm --version) found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Setup environment file
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✓ .env file created. Please edit it with your configuration."
else
    echo "✓ .env file already exists"
fi

# Build TypeScript
echo ""
echo "🔨 Building TypeScript..."
npm run build
echo "✓ Build complete"

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env with your configuration"
echo "  2. Run 'npm run dev' to start development server"
echo "  3. Or run 'docker-compose up' for full stack with dependencies"
