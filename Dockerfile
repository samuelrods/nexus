# Stage 1: PHP Dependencies
FROM php:8.2-cli AS vendor

# Install system dependencies for composer and common extensions
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libicu-dev \
    && docker-php-ext-install zip intl pdo_mysql

WORKDIR /var/www/html
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-plugins \
    --no-scripts \
    --prefer-dist

# Stage 2: Frontend Assets
FROM node:20 AS frontend
WORKDIR /var/www/html
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Final Production Image
FROM serversideup/php:8.2-fpm-nginx AS final

# Set working directory
WORKDIR /var/www/html

# Set environment variables for production
ENV AUTORUN_ENABLED=true
ENV AUTORUN_LARAVEL_MIGRATION=false
ENV APP_ENV=production
ENV APP_DEBUG=false

# Copy PHP dependencies from Stage 1
COPY --from=vendor /var/www/html/vendor ./vendor

# Copy Frontend assets from Stage 2
COPY --from=frontend /var/www/html/public/build ./public/build

# Copy application code
COPY . .

# Ensure storage and bootstrap/cache are writable
RUN mkdir -p \
    storage/app/public \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/testing \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

# Fix ownership
USER root
RUN chown -R www-data:www-data /var/www/html
USER www-data
