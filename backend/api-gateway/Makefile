# Makefile for API Gateway Development

.PHONY: help install dev build start clean test lint format

help:
	@echo "Available commands:"
	@echo "  make install      - Install dependencies"
	@echo "  make dev          - Start development server"
	@echo "  make build        - Build for production"
	@echo "  make start        - Start production server"
	@echo "  make clean        - Clean build artifacts"
	@echo "  make test         - Run tests"
	@echo "  make test-watch   - Run tests in watch mode"
	@echo "  make test-cov     - Run tests with coverage"
	@echo "  make lint         - Run linter"
	@echo "  make lint-fix     - Fix linting issues"
	@echo "  make type-check   - Check TypeScript types"
	@echo "  make docker-build - Build Docker image"
	@echo "  make docker-up    - Start Docker Compose services"
	@echo "  make docker-down  - Stop Docker Compose services"
	@echo "  make docker-logs  - View Docker Compose logs"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm start

clean:
	npm run clean

test:
	npm test

test-watch:
	npm run test:watch

test-cov:
	npm run test:coverage

lint:
	npm run lint

lint-fix:
	npm run lint:fix

type-check:
	npm run type-check

docker-build:
	docker build -t api-gateway:latest .

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f api-gateway

docker-clean:
	docker-compose down -v

# Development workflow shortcuts
dev-install: install dev

setup: install
	cp .env.example .env
	@echo "✓ Setup complete. Edit .env if needed."
	@echo "✓ Run 'make dev' or 'make docker-up' to start"

# CI/CD commands
ci-build: clean lint type-check build test

ci-start: build start
