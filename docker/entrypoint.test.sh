#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Configure Git to trust the mounted repository to avoid dubious ownership errors
git config --global --add safe.directory /var/www

echo "=== Test Entrypoint ==="

# Install composer dependencies if vendor folder is missing
if [ ! -d "vendor" ]; then
    echo "Vendor directory not found. Installing dependencies..."
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# Wait for the test database to be ready
echo "Waiting for db_test..."
until php artisan db:monitor --databases=mysql --env=testing > /dev/null 2>&1; do
  echo "  db_test is unavailable — retrying in 2s"
  sleep 2
done
echo "  db_test is ready."

# Run a fresh migration + seed on the test database (wipes + re-creates schema + seeds fixtures)
echo "Running fresh migrations + seeds on nexus_test..."
php artisan migrate:fresh --env=testing --force --no-interaction --seed

# Sync Scout index settings against the test Meilisearch instance
echo "Syncing Scout index settings (test)..."
php artisan scout:sync-index-settings --env=testing

echo "Bootstrap complete. Starting command..."

# Signal that bootstrap is done (used by the Docker healthcheck)
touch /tmp/.bootstrap_complete

# Execute the main container command
exec "$@"
