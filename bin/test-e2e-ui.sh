#!/usr/bin/env bash
set -euo pipefail

COMPOSE="docker compose -f $(dirname "$0")/../docker-compose.test.yml"

trap "$COMPOSE down" EXIT INT TERM

echo "🚀 Starting test stack..."
$COMPOSE up -d --wait --remove-orphans app_test nginx_test db_test meilisearch_test

echo "🌱 Seeding database for Playwright UI..."
$COMPOSE exec app_test php artisan migrate:fresh --seed --env=testing

echo "📦 Installing Node dependencies..."
$COMPOSE run --rm playwright npm install

echo "🏗️ Building frontend assets..."
$COMPOSE run --rm playwright npm run build

echo "🎭 Launching Playwright UI (http://localhost:8060)..."
$COMPOSE run --rm --service-ports playwright \
  npx playwright test --ui-host=0.0.0.0 --ui-port=8060
