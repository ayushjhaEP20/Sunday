#!/bin/bash
# Development setup for Windows users

echo "Setting up API Gateway for Windows development..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js $(node --version)"
echo "✓ npm $(npm --version)"

# Create .env file
if [ ! -f .env ]; then
    copy .env.example .env
    echo "✓ Created .env from .env.example - please configure it"
else
    echo "✓ .env already exists"
fi

# Install dependencies
echo "Installing dependencies..."
call npm install

echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your settings"
echo "2. Run: npm run dev    (for development)"
echo "3. Or run: npm run build && npm start (for production)"
