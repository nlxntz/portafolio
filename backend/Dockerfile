FROM php:8.3-apache

# Habilitar mod_rewrite de Apache para URLs amigables de CodeIgniter 4
RUN a2enmod rewrite headers

# Instalar dependencias del sistema y extensiones PHP necesarias para CI4
RUN apt-get update && apt-get install -y \
    libicu-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    unzip \
    git \
    curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-configure intl \
    && docker-php-ext-install -j$(nproc) \
        intl \
        mysqli \
        pdo \
        pdo_mysql \
        zip \
        gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Configurar Apache DocumentRoot hacia el directorio /public de CodeIgniter 4
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Permitir que el archivo .htaccess de CodeIgniter sobreescriba configuraciones (AllowOverride All)
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
