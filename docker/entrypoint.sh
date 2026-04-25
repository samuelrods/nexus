#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Configure Git to trust the mounted repository to avoid dubious ownership errors
git config --global --add safe.directory /var/www

# Fix permissions for Laravel storage and bootstrap cache
chmod -R 777 storage bootstrap/cache

echo "Running entrypoint script..."

# Install composer dependencies if vendor folder is missing
if [ ! -d "vendor" ]; then
    echo "Vendor directory not found. Installing dependencies..."
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# Wait for database to be ready
echo "Waiting for database..."
until php artisan db:monitor --databases=mysql > /dev/null 2>&1; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Sync Scout index settings
echo "Syncing Scout index settings..."
php artisan scout:sync-index-settings

# Execute the main container command (from Dockerfile or docker-compose)
echo "Starting application..."
exec "$@"
