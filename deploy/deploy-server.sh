#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/spoticheck/app"
BACKEND_DIR="/var/www/spoticheck/backend"
FRONTEND_DIR="/var/www/spoticheck/frontend"
PM2_APP="spoticheck-backend"

cd "$APP_DIR"

git pull

cd "$APP_DIR/backend"
npm install --omit=dev

mkdir -p "$BACKEND_DIR/src"
rsync -a --delete "$APP_DIR/backend/src/" "$BACKEND_DIR/src/"
rsync -a "$APP_DIR/backend/package.json" "$APP_DIR/backend/package-lock.json" "$BACKEND_DIR/"

cd "$APP_DIR/frontend"
npm install
npm run build

mkdir -p "$FRONTEND_DIR"
rsync -a --delete "$APP_DIR/frontend/dist/" "$FRONTEND_DIR/"

pm2 restart "$PM2_APP"
pm2 status "$PM2_APP"
