#!/bin/sh

set -eu

if [ "${CONFIGURATION:-}" != "Release" ]; then
  exit 0
fi

repository_root="${SRCROOT}/../.."
node_binary="${NODE_BINARY:-}"

if [ -n "$node_binary" ]; then
  if [ ! -x "$node_binary" ]; then
    resolved_node="$(command -v "$node_binary" 2>/dev/null || true)"
    node_binary="$resolved_node"
  fi
else
  for candidate in "$HOME/.local/bin/node" /opt/homebrew/bin/node /usr/local/bin/node; do
    if [ -x "$candidate" ]; then
      node_binary="$candidate"
      break
    fi
  done
fi

if [ -z "$node_binary" ] || [ ! -x "$node_binary" ]; then
  echo "error: Other Bali Release preflight needs Node 22. Set NODE_BINARY to its absolute path." >&2
  exit 1
fi

node_major="$($node_binary -p 'process.versions.node.split(".")[0]')"
if [ "$node_major" != "22" ]; then
  echo "error: Other Bali Release preflight requires Node 22; found $($node_binary --version)." >&2
  exit 1
fi

cd "$repository_root"
exec "$node_binary" scripts/verify-ios-release.mjs --config-only
