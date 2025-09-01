#!/usr/bin/env bash

# Simple deploy script: git pull, install prod deps, build
# As requested: just pull git, npm i (no dev), run build

set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

log()   { printf "[%s] %s\n" "$(date '+%Y-%m-%d %H:%M:%S')" "$*"; }
info()  { log "INFO: $*"; }
error() { log "ERROR: $*"; }

on_error() {
  local exit_code=$?
  error "Deploy failed with exit code ${exit_code}. Last command: '${BASH_COMMAND}'"
  exit "$exit_code"
}
trap on_error ERR

# 1) Update repo
info "Updating git repository..."
if command -v git >/dev/null 2>&1; then
  git fetch --all --prune
  git pull --ff-only
else
  error "git not found. Please install git."; exit 1
fi

# 2) Install dependencies (production only)
info "Installing production dependencies (npm)..."
if ! command -v npm >/dev/null 2>&1; then
  error "npm not found. Please install Node.js/npm."; exit 1
fi

# Prefer reproducible install in CI when lockfile exists
if [[ -n "${CI:-}" && -f package-lock.json ]]; then
  npm ci --omit=dev --no-audit --fund=false
else
  npm install --omit=dev --no-audit --fund=false
fi

# 3) Build
info "Building for production..."
export NODE_ENV=production
npm run build

info "Done. Build artifacts are in: $SCRIPT_DIR/build"

