#!/usr/bin/env bash
set -euo pipefail

COMPOSE="docker compose -f $(dirname "$0")/../docker-compose.test.yml"

trap "$COMPOSE down" EXIT INT TERM

echo "🚀 Starting test stack..."
$COMPOSE up -d --wait --remove-orphans app_test db_test meilisearch_test

echo "📦 Building frontend assets..."
$COMPOSE exec app_test npm run build

echo "🧪 Running PHPUnit (unit + feature)..."
$COMPOSE exec app_test php artisan test --env=testing
