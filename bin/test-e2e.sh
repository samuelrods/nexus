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
$COMPOSE up -d --wait --remove-orphans app_test nginx_test db_test meilisearch_test

echo "🌱 Seeding database for E2E tests..."
$COMPOSE exec app_test php artisan migrate:fresh --seed --env=testing

echo "📦 Installing Node dependencies..."
$COMPOSE run --rm playwright npm install

echo "🎭 Running Playwright E2E tests..."
# In CI emit both reporters: list for readable console output and html for the
# artifact that gets uploaded to GitHub Actions after the job completes.
if [ "${CI:-}" = "true" ]; then
  REPORTER="--reporter=list,html"
else
  REPORTER="--reporter=list"
fi
$COMPOSE run --rm playwright npx playwright test $REPORTER
