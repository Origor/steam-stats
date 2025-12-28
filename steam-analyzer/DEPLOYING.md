# Deployment Guide

This guide explains how to deploy the **Steam Analyzer** application (React + Chromium/Rust) to a production Linux server (e.g., Ubuntu/Debian).

## Prerequisites

On your server, you will need:
- **Node.js** (for building the frontend)
- **Rust** (for building the backend)
- **Nginx** (as the web server/reverse proxy)
- **Git**

## 1. Setup

### Clone the Repository
```bash
cd /var/www/
git clone https://github.com/yourusername/steam-analyzer.git
cd steam-analyzer
```

### Configure Backend (Systemd)

1. **Copy the service file**:
   ```bash
   sudo cp deployment/steam-backend.service.example /etc/systemd/system/steam-backend.service
   ```
2. **Edit the file** to match your paths and user:
   ```bash
   sudo nano /etc/systemd/system/steam-backend.service
   ```
   *Make sure to update `User`, `WorkingDirectory`, `ExecStart`, and environment variables like `STEAM_API_KEY` (if not using .env).*

3. **Enable and Start the Service**:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable steam-backend
   sudo systemctl start steam-backend
   ```

### Configure Frontend & Proxy (Nginx)

1. **Copy the configuration**:
   ```bash
   sudo cp deployment/nginx.conf.example /etc/nginx/sites-available/steam-analyzer
   ```
2. **Edit the file** to update your domain and paths:
   ```bash
   sudo nano /etc/nginx/sites-available/steam-analyzer
   ```
3. **Enable the site**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/steam-analyzer /etc/nginx/sites-enabled/
   sudo nginx -t # Test configuration
   sudo systemctl restart nginx
   ```

## 2. Automated Deployment

A helper script `deployment/deploy.sh` is provided to automate updates.

1. **Make it executable**:
   ```bash
   chmod +x deployment/deploy.sh
   ```
2. **Configure the script**:
   Open `deployment/deploy.sh` and verify the `APP_DIR` and `WEB_ROOT` paths match your server setup.

3. **Run a deployment**:
   Whenever you want to update the production server with the latest code from GitHub:
   ```bash
   ./deployment/deploy.sh
   ```

This script will:
- Pull the latest code.
- Rebuild the React frontend.
- Copy frontend assets to the Nginx web root.
- Rebuild the Rust backend (in release mode).
- Restart the backend service.
