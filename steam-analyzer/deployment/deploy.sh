#!/bin/bash

# Deployment Script for Steam Analyzer
# Usage: ./deploy.sh

set -e # Exit immediately if a command exits with a non-zero status

APP_DIR="/path/to/steam-stats/steam-analyzer" # UPDATE THIS
BACKEND_DIR="$APP_DIR/backend"
WEB_ROOT="/var/www/steam-analyzer" # UPDATE THIS

echo "🚀 Starting Deployment..."

# 1. Update Code
echo "📦 Pulling latest changes..."
cd "$APP_DIR"
git pull origin main

# 2. Build Frontend
echo "🏗️  Building React Frontend..."
npm install
npm run build

# 3. Deploy Frontend (Copy to Web Root)
echo "📂 Copying frontend build to web root..."
# Ensure the directory exists
sudo mkdir -p "$WEB_ROOT"
# Remove old contents (optional but recommended for clean slate)
sudo rm -rf "$WEB_ROOT/*"
# Copy new build
sudo cp -r dist/* "$WEB_ROOT"

# 4. Build Backend
echo "🦀 Building Rust Backend..."
cd "$BACKEND_DIR"
cargo build --release

# 5. Run Migrations (Optional)
# Uncomment if you have sqlx-cli installed on the server
# echo "🗄️  Running Database Migrations..."
# sqlx migrate run

# 6. Restart Service
echo "🔄 Restarting Backend Service..."
sudo systemctl restart steam-backend

echo "✅ Deployment Complete!"
