#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

CHANGELOG_FILE="CHANGELOG.md"
MAX_COMMITS="${CHANGELOG_COMMITS:-250}"

if [[ ! -f "$CHANGELOG_FILE" ]]; then
  cat > "$CHANGELOG_FILE" <<'EOF'
# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog.

## [Unreleased]

### Added
-

### Changed
-

### Fixed
-

### Removed
-
EOF
fi

copilot -p "Update CHANGELOG.md for this repository. Use git commit history as source of truth by reading the latest ${MAX_COMMITS} commits with git log. Produce a clean, release-ready changelog in Keep a Changelog style. Keep existing release history, deduplicate entries, and improve readability. Group meaningful user-facing changes under [Unreleased] and existing release sections with headings like Added, Changed, Fixed, Removed. Only modify CHANGELOG.md." \
  --add-dir "$REPO_ROOT" \
  --allow-all-tools \
  --allow-all-paths \
  --silent
