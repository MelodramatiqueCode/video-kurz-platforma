#!/usr/bin/env bash
set -euo pipefail

# Spustite na WebSupport VPS cez SSH (Ubuntu/Debian).
# Použitie: bash deploy/websupport/setup-server.sh kurz.vasadomena.sk

DOMAIN="${1:-}"
APP_DIR="/var/www/video-kurz-platforma"
REPO_URL="${REPO_URL:-https://github.com/MelodramatiqueCode/video-kurz-platforma.git}"

if [[ -z "$DOMAIN" ]]; then
  echo "Použitie: bash deploy/websupport/setup-server.sh kurz.vasadomena.sk"
  exit 1
fi

echo "==> Inštalácia Node.js 20 (ak chýba)"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs git nginx
fi

echo "==> PM2"
if ! command -v pm2 >/dev/null 2>&1; then
  sudo npm install -g pm2
fi

echo "==> Adresár aplikácie"
sudo mkdir -p "$APP_DIR"
sudo chown -R "$USER:$USER" "$APP_DIR"

if [[ ! -d "$APP_DIR/.git" ]]; then
  git clone "$REPO_URL" "$APP_DIR"
fi

cd "$APP_DIR"
git pull --ff-only

if [[ ! -f .env ]]; then
  cp deploy/websupport/env.production.example .env
  echo "Doplňte $APP_DIR/.env a spustite skript znova."
  exit 1
fi

echo "==> Build"
npm ci
npm run build

echo "==> PM2 start"
pm2 startOrReload deploy/websupport/ecosystem.config.cjs
pm2 save

echo "==> Nginx"
NGINX_SITE="/etc/nginx/sites-available/video-kurz-platforma"
sudo cp deploy/websupport/nginx.conf.example "$NGINX_SITE"
sudo sed -i "s/kurz.vasadomena.sk/$DOMAIN/g" "$NGINX_SITE"
sudo ln -sf "$NGINX_SITE" /etc/nginx/sites-enabled/video-kurz-platforma
sudo nginx -t
sudo systemctl reload nginx

echo "==> SSL (Let's Encrypt)"
if command -v certbot >/dev/null 2>&1; then
  sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m admin@"$DOMAIN" || true
fi

echo
echo "Hotovo. Skontrolujte https://$DOMAIN"
echo "Nezabudnite aktualizovať:"
echo "  - Stripe webhook URL -> https://$DOMAIN/api/stripe/webhook"
echo "  - Supabase redirect URLs -> https://$DOMAIN/**"
echo "  - Google OAuth origins -> https://$DOMAIN"
