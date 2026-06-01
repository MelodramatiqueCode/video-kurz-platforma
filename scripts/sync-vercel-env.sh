#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/.."
VERCEL="./node_modules/.bin/vercel"

add_env() {
  local name="$1"
  local value="$2"
  for env in production preview development; do
    $VERCEL env add "$name" "$env" --value "$value" --yes --force >/dev/null
  done
  echo "Set $name"
}

MAP_ENV="/Users/melodramatique_1_2/Projects/mamymimodavu-mapa/.env"
RADIO_ENV="/Users/melodramatique_1_2/Projects/webove-radio/.env.local"

DATABASE_URL=$(grep '^DATABASE_URL=' "$MAP_ENV" | cut -d= -f2- | tr -d '"')
BLOB_TOKEN=$(grep '^BLOB_READ_WRITE_TOKEN=' "$RADIO_ENV" | cut -d= -f2- | tr -d '"')

add_env "DATABASE_URL" "$DATABASE_URL"
add_env "NEXT_PUBLIC_SUPABASE_URL" "https://rdulzfcijhjlgxmkmqse.supabase.co"
add_env "NEXT_PUBLIC_APP_URL" "https://video-kurz-platforma.vercel.app"
add_env "ADMIN_EMAILS" "finance@melodramatique.sk,ceo@melodramatique.sk,mamy.mimo.davu@gmail.com"
add_env "BLOB_READ_WRITE_TOKEN" "$BLOB_TOKEN"

if [ -n "${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}" ]; then
  add_env "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$NEXT_PUBLIC_SUPABASE_ANON_KEY"
fi

if [ -n "${STRIPE_SECRET_KEY:-}" ]; then
  add_env "STRIPE_SECRET_KEY" "$STRIPE_SECRET_KEY"
fi

if [ -n "${STRIPE_WEBHOOK_SECRET:-}" ]; then
  add_env "STRIPE_WEBHOOK_SECRET" "$STRIPE_WEBHOOK_SECRET"
fi

if [ -n "${MUX_TOKEN_ID:-}" ]; then
  add_env "MUX_TOKEN_ID" "$MUX_TOKEN_ID"
fi

if [ -n "${MUX_TOKEN_SECRET:-}" ]; then
  add_env "MUX_TOKEN_SECRET" "$MUX_TOKEN_SECRET"
fi

echo "Done."
