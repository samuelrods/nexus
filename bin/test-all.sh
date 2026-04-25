#!/usr/bin/env bash
set -euo pipefail

COMPOSE="docker compose -f $(dirname "$0")/../docker-compose.test.yml"

trap "$COMPOSE down" EXIT INT TERM

echo "🚀 Starting test stack..."
$COMPOSE up -d --wait --remove-orphans app_test nginx_test db_test meilisearch_test

echo "🧪 Running PHPUnit (unit + feature)..."
$COMPOSE exec app_test php artisan test --env=testing

echo "🌱 Re-seeding database for E2E tests..."
$COMPOSE exec app_test php artisan migrate:fresh --seed --env=testing

echo "📦 Installing Node dependencies..."
$COMPOSE run --rm playwright npm install

echo "🏗️ Building frontend assets..."
$COMPOSE run --rm playwright npm run build

echo "🎭 Running Playwright E2E tests..."
$COMPOSE run --rm playwright npx playwright test --reporter=list
