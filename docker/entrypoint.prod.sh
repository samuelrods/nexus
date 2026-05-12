#!/bin/bash
set -e

# Fix permissions for Laravel storage and bootstrap cache
# Using 775/755 is better for production than 777
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

echo "Running production entrypoint script..."

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

# Cache configuration, routes, and views for performance
echo "Caching Laravel bootstrap..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Starting application..."
exec "$@"
