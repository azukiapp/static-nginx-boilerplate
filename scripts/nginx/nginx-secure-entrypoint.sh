#!/bin/sh

set -e

echo " - Configuring basic authentication..."
echo -n "$DEFAULT_USER:" > /etc/nginx/.htpasswd
openssl passwd -apr1 "$DEFAULT_PASSWORD" >> /etc/nginx/.htpasswd

echo " - Starting nginx..."
nginx -g "daemon off;"
