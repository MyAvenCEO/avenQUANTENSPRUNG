#!/usr/bin/env sh
# main → prod: puts the current state of main live (fast-forward only).
# Usage: bun run promote [--yes]
set -eu

REMOTE="${REMOTE:-origin}"
fail() { printf '✖ %s\n' "$1" >&2; exit 1; }

[ "$(git rev-parse --abbrev-ref HEAD)" = "main" ] || fail "Run this on main."
[ -z "$(git status --porcelain)" ] || fail "Working tree is not clean."

git fetch "$REMOTE" --quiet
[ "$(git rev-parse main)" = "$(git rev-parse "$REMOTE/main")" ] \
  || fail "main is not in sync with $REMOTE/main – push or pull first."

if git rev-parse --verify --quiet "$REMOTE/prod" >/dev/null; then
  git merge-base --is-ancestor "$REMOTE/prod" main \
    || fail "prod has commits that are not on main. Merge prod back into main first."
  CHANGES="$(git log --oneline "$REMOTE/prod..main")"
  [ -n "$CHANGES" ] || { echo "✓ prod is already up to date with main."; exit 0; }
  printf 'Going live:\n%s\n\n' "$CHANGES"
else
  echo "prod does not exist on $REMOTE yet – it will be created from main."
fi

bun run build

if [ "${1:-}" != "--yes" ]; then
  printf 'Promote main → prod now? [y/N] '
  read -r answer
  case "$answer" in y|Y) ;; *) fail "Aborted." ;; esac
fi

git push "$REMOTE" main:prod
echo "✓ prod updated – deploy is running (watch it with: gh run watch)"
