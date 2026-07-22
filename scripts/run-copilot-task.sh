#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <prompt>" >&2
  exit 1
fi

PROMPT="$1"
GITHUB_SCOPE="${COPILOT_GITHUB_SCOPE:-local-only}"

ARGS=(
  -p "$PROMPT"
  --add-dir "$REPO_ROOT"
  --allow-all-tools
  --disable-builtin-mcps
  --no-remote
  --no-remote-export
  --disallow-temp-dir
  --silent
)

if [[ "$GITHUB_SCOPE" == "public-read" ]]; then
  ARGS+=(
    --allow-url=github.com
    --allow-url=raw.githubusercontent.com
  )
else
  PROMPT="${PROMPT} Work only with local repository files and local git history. Do not access GitHub, other websites, remote APIs, or files outside this repository."
fi

copilot "${ARGS[@]}"