#!/bin/sh
set -e

# Run migrations and seed database automatically on startup
php artisan migrate --force
php artisan db:seed --force

# Start Supervisord to run nginx, php-fpm, and queues
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
