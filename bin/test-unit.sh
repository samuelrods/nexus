#!/usr/bin/env bash
set -euo pipefail

COMPOSE="docker compose -f $(dirname "$0")/../docker-compose.test.yml"

on_exit() {
  local exit_code=$?
  if [ $exit_code -ne 0 ]; then
    echo ""
    echo "❌ Test stack exited with code $exit_code — dumping app_test logs:"
    echo "──────────────────────────────────────────────────────────────────"
    $COMPOSE logs app_test 2>/dev/null || true
    echo "──────────────────────────────────────────────────────────────────"
  fi
  $COMPOSE down --remove-orphans 2>/dev/null || true
}

trap on_exit EXIT INT TERM

echo "🚀 Starting test stack..."
$COMPOSE up -d --wait --remove-orphans app_test db_test meilisearch_test

echo "📦 Installing Node dependencies..."
$COMPOSE exec app_test npm install

echo "🏗️ Building frontend assets..."
$COMPOSE exec app_test npm run build

echo "🧪 Running PHPUnit (unit + feature)..."
$COMPOSE exec app_test php artisan test --env=testing
