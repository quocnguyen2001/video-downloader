# --- Stage 1: Composer (cài vendor) ---
FROM composer:2 AS vendor
WORKDIR /app

# copy toàn bộ project trước
COPY . .

# cài vendor, bỏ qua check extension vì stage runtime sẽ có ext
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --ignore-platform-req=ext-intl \
    --ignore-platform-req=ext-pcntl \
    --optimize-autoloader

# --- Stage 2: Node (build frontend assets, ví dụ Vite) ---
FROM node:22 AS assets
WORKDIR /app

# Clear npm cache and set npm configuration for better reliability
RUN npm cache clean --force && \
    npm config set fund false && \
    npm config set audit false

COPY package*.json ./
RUN npm install --no-fund --no-audit

COPY . .
RUN npm run build

# --- Stage 3: PHP runtime (final) ---
FROM php:8.4-fpm-alpine AS final

# Cài runtime deps
RUN apk add --no-cache \
      icu \
      bash \
      git \
      libzip \
      libpng \
      libjpeg-turbo \
      freetype \
      oniguruma

# Cài build deps tạm thời để compile extensions
RUN apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
        icu-dev \
        libzip-dev \
        libpng-dev \
        libjpeg-turbo-dev \
        freetype-dev \
        oniguruma-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        mbstring \
        zip \
        gd \
        intl \
        pcntl \
        opcache \
    && docker-php-ext-enable intl pcntl \
    && apk del .build-deps

WORKDIR /var/www/html

# copy code & vendor từ stage vendor
COPY --from=vendor /app /var/www/html

# copy build assets từ stage assets
COPY --from=assets /app/public /var/www/html/public

# cấp quyền cho storage & bootstrap/cache
RUN chown -R www-data:www-data storage bootstrap/cache

CMD ["php-fpm", "-F"]
