FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    libicu-dev \
    libzip-dev \
    libpq-dev \
    && docker-php-ext-install \
    intl \
    zip \
    opcache

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/symfony

# Copy only composer files first to leverage Docker cache
COPY composer.json composer.lock ./
RUN composer install --prefer-dist --no-scripts --no-dev --no-autoloader

# Copy the rest of the application
COPY . .

# Finish Composer setup
RUN composer dump-autoload --no-dev --optimize

# Set permissions
RUN chown -R www-data:www-data var

CMD ["php-fpm"]

EXPOSE 9000 