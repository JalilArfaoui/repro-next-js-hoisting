#!/usr/bin/env bash
# Builds twice (scope hoisting on, then off) and reports whether the
# hydration crash is caused by scope hoisting.
set -u
PORT=3095
cd "$(dirname "$0")"

run_once() { # $1 = on|off
  if [ "$1" = off ]; then
    sed -i 's|typescript: { ignoreBuildErrors: true },|typescript: { ignoreBuildErrors: true },\n\texperimental: { turbopackScopeHoisting: false },|' next.config.mjs
  fi
  NODE_ENV=production npm run build > /tmp/repro-build.log 2>&1
  local rc=$?
  if [ "$1" = off ]; then
    sed -i '/turbopackScopeHoisting: false/d' next.config.mjs
  fi
  [ $rc -ne 0 ] && { echo "BUILD-FAIL"; return; }
  (NODE_ENV=production npx next start --port $PORT > /tmp/repro-serve.log 2>&1 &)
  sleep 2
  local DOM
  DOM=$(timeout 30 chromium --headless=new --disable-gpu --no-sandbox --virtual-time-budget=8000 --dump-dom "http://localhost:$PORT/" 2>/dev/null)
  pkill -f "next start --port $PORT" 2>/dev/null
  sleep 0.5
  if echo "$DOM" | grep -q "pied"; then echo "OK"; else echo "CRASH"; fi
}

ON=$(run_once on); OFF=$(run_once off)
echo "with scope hoisting: $ON — without: $OFF"
if [ "$ON" = CRASH ] && [ "$OFF" = OK ]; then echo "HOISTING-BUG reproduced"; exit 0; fi
echo "not reproduced"; exit 1
