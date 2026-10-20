#!/usr/bin/env bash
# ==============================================================================
# Script: deploy-staffing.sh
# Purpose: Safe, repeatable deployment script for Interskill Staffing Solutions
# Environment: AlmaLinux 9 with cPanel/WHM
# Target Path: /home/interski/interskillstaffingsolutions
# ==============================================================================

set -euo pipefail

# Environment & Binary Configuration
export PATH="/opt/cpanel/ea-nodejs22/bin:/opt/cpanel/ea-nodejs22/lib/node_modules/pm2/bin:/usr/local/bin:/usr/bin:/bin:$PATH"
PROJECT_DIR="/home/interski/interskillstaffingsolutions"
NODE_BIN="/opt/cpanel/ea-nodejs22/bin/node"
NPM_BIN="/opt/cpanel/ea-nodejs22/bin/npm"
PM2_BIN="/opt/cpanel/ea-nodejs22/lib/node_modules/pm2/bin/pm2"
PM2_APP_NAME="interskill-staffing-api"
PORT="5001"
HEALTH_URL="http://127.0.0.1:${PORT}/api/health"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

log "=== Starting Interskill Staffing Solutions Deployment ==="

# 1. Verify Project Directory
if [ ! -d "$PROJECT_DIR" ]; then
  log "ERROR: Project directory $PROJECT_DIR does not exist." >&2
  exit 1
fi

cd "$PROJECT_DIR"
log "Working directory: $(pwd)"

# 2. Verify Node.js and npm from cPanel ea-nodejs22
if [ ! -x "$NODE_BIN" ]; then
  log "ERROR: Node binary not found or not executable at $NODE_BIN" >&2
  exit 1
fi
if [ ! -x "$NPM_BIN" ]; then
  log "ERROR: npm binary not found or not executable at $NPM_BIN" >&2
  exit 1
fi

log "Using Node: $($NODE_BIN -v) ($NODE_BIN)"
log "Using npm:  $($NPM_BIN -v) ($NPM_BIN)"

# 3. Verify .env file exists and has restricted permissions
if [ ! -f ".env" ]; then
  log "ERROR: Production .env file is missing at $PROJECT_DIR/.env" >&2
  log "Create it with restricted permissions (chmod 600 .env) before deploying." >&2
  exit 1
fi

# Ensure permissions are restrictive (600 or 400)
chmod 600 .env 2>/dev/null || true

# 4. Safe Git Fetch & Fast-Forward Update
log "Fetching latest changes from origin/main..."
git fetch origin main

# Check if there are any uncommitted local changes tracked by Git
if ! git diff-index --quiet HEAD --; then
  log "ERROR: Working tree has uncommitted local changes in tracked files." >&2
  log "Please stash or resolve local changes before running deployment." >&2
  exit 1
fi

log "Performing fast-forward merge..."
git merge --ff-only origin/main

CURRENT_COMMIT=$(git rev-parse --short HEAD)
log "Updated to commit: $CURRENT_COMMIT"

# 5. Clean Dependency Installation & Frontend Build
log "Installing dependencies with npm ci..."
"$NPM_BIN" ci

log "Building frontend production bundle..."
"$NPM_BIN" run build

if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
  log "ERROR: Frontend build output 'dist/index.html' is missing." >&2
  exit 1
fi
log "Frontend build verified successfully."

# 6. Reload ONLY the Existing Staffing Backend PM2 Process
log "Checking existing PM2 process: $PM2_APP_NAME"

if "$PM2_BIN" describe "$PM2_APP_NAME" >/dev/null 2>&1; then
  log "Reloading existing PM2 process '$PM2_APP_NAME'..."
  "$PM2_BIN" reload "$PM2_APP_NAME" --update-env
else
  log "ERROR: Existing PM2 process '$PM2_APP_NAME' was not found." >&2
  exit 1
fi

# Save PM2 state using the configured PM2 binary
"$PM2_BIN" save

# 7. Backend Health Verification
log "Verifying backend health check at $HEALTH_URL..."
HEALTHY=0
for i in {1..10}; do
  if curl -s -f -m 5 "$HEALTH_URL" >/dev/null 2>&1; then
    HEALTHY=1
    break
  fi
  log "Health check attempt $i/10 failed. Retrying in 2 seconds..."
  sleep 2
done

if [ "$HEALTHY" -eq 1 ]; then
  log "HEALTH CHECK PASSED: Backend is responsive at $HEALTH_URL"
  HEALTH_RESP=$(curl -s -m 5 "$HEALTH_URL")
  log "Health Response: $HEALTH_RESP"
else
  log "ERROR: Health check failed after 10 attempts at $HEALTH_URL." >&2
  log "Checking PM2 logs for $PM2_APP_NAME:" >&2
  pm2 logs "$PM2_APP_NAME" --lines 20 --nostream >&2 || true
  exit 1
fi

log "=== Interskill Staffing Solutions Deployment Completed Successfully ($CURRENT_COMMIT) ==="
exit 0
