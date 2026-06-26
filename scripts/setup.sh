#!/bin/bash
# ============================================================
# Footballeroo — Local Development Setup Script
# ============================================================
# Usage: ./scripts/setup.sh
# ============================================================

set -e

echo ""
echo "  ╔══════════════════════════════════════════╗"
echo "  ║                                          ║"
echo "  ║   Footballeroo - Local Dev Setup         ║"
echo "  ║                                          ║"
echo "  ╚══════════════════════════════════════════╝"
echo ""

# --- Check prerequisites ---
echo "Checking prerequisites..."

command -v node >/dev/null 2>&1 || { echo "ERROR: Node.js is required. Install from https://nodejs.org"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "ERROR: npm is required."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "ERROR: Docker is required. Install from https://docker.com"; exit 1; }
command -v docker compose >/dev/null 2>&1 || command -v docker-compose >/dev/null 2>&1 || { echo "ERROR: Docker Compose is required."; exit 1; }

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "ERROR: Node.js 18+ required (found v$NODE_VERSION)"
  exit 1
fi

echo "  Node.js: $(node -v)"
echo "  npm: $(npm -v)"
echo "  Docker: $(docker --version | cut -d' ' -f3)"
echo ""

# --- Copy environment files ---
echo "Setting up environment files..."

if [ ! -f .env ]; then
  cp .env.example .env
  echo "  Created .env (edit with your secrets)"
else
  echo "  .env already exists (skipping)"
fi

if [ ! -f apps/web/.env ]; then
  cp apps/web/.env.example apps/web/.env
  echo "  Created apps/web/.env"
else
  echo "  apps/web/.env already exists (skipping)"
fi

if [ ! -f apps/api/.env ]; then
  cp apps/api/.env.example apps/api/.env
  echo "  Created apps/api/.env"
else
  echo "  apps/api/.env already exists (skipping)"
fi

echo ""

# --- Start Docker services ---
echo "Starting Docker services (PostgreSQL + Redis)..."
docker compose up -d

echo "  Waiting for PostgreSQL to be ready..."
until docker exec footballeroo-postgres pg_isready -U footballeroo >/dev/null 2>&1; do
  sleep 1
done
echo "  PostgreSQL is ready!"

echo "  Waiting for Redis to be ready..."
until docker exec footballeroo-redis redis-cli ping >/dev/null 2>&1; do
  sleep 1
done
echo "  Redis is ready!"
echo ""

# --- Install dependencies ---
echo "Installing npm dependencies..."
npm install
echo ""

# --- Generate Prisma client ---
echo "Generating Prisma client..."
npm run db:generate
echo ""

# --- Run database migrations ---
echo "Running database migrations..."
npm run db:migrate
echo ""

# --- Seed the database ---
echo "Seeding database with initial data..."
npm run db:seed
echo ""

# --- Done! ---
echo ""
echo "  ╔══════════════════════════════════════════╗"
echo "  ║                                          ║"
echo "  ║   Setup complete!                        ║"
echo "  ║                                          ║"
echo "  ║   Next steps:                            ║"
echo "  ║   1. Edit .env with your API keys        ║"
echo "  ║   2. Run: npm run dev                    ║"
echo "  ║                                          ║"
echo "  ║   Frontend: http://localhost:3000         ║"
echo "  ║   API:      http://localhost:4000         ║"
echo "  ║   DB Studio: npm run db:studio           ║"
echo "  ║                                          ║"
echo "  ╚══════════════════════════════════════════╝"
echo ""
