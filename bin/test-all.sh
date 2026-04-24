#!/usr/bin/env bash
set -euo pipefail

COMPOSE="docker compose -f $(dirname "$0")/../docker-compose.test.yml"

trap "$COMPOSE down" EXIT INT TERM

echo "🚀 Starting test stack..."
$COMPOSE up -d --wait --remove-orphans app_test nginx_test db_test meilisearch_test

echo "🔍 Verifying assets in container..."
$COMPOSE exec app_test ls -la public/build/manifest.json || (echo "❌ Vite manifest not found in container" && exit 1)

echo "🔍 Checking connectivity to Nginx..."
$COMPOSE run --rm playwright curl -v --fail http://nginx_test/login || (echo "❌ Cannot reach Nginx or got error response" && $COMPOSE run --rm playwright curl -v http://nginx_test/login && exit 1)

echo "🧪 Running PHPUnit (unit + feature)..."
$COMPOSE exec app_test php artisan test --env=testing

echo "🌱 Re-seeding database for E2E tests..."
$COMPOSE exec app_test php artisan migrate:fresh --seed --env=testing

echo "🎭 Running Playwright E2E tests..."
$COMPOSE run --rm -e CI=true playwright npx playwright test --reporter=list
