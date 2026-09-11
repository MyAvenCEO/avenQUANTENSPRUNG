#!/usr/bin/env sh
# One-time setup (idempotent): create/reuse the GitHub repo, enable Pages via Actions, allow only
# prod to deploy, set the custom domain and push prod (first deploy).
# Usage: sh scripts/setup-github.sh <owner/repo> [public|private]
set -eu

REPO="${1:?Usage: sh scripts/setup-github.sh <owner/repo> [public|private]}"
VISIBILITY="${2:-public}"
DOMAIN="quantensprung.ist"

if gh repo view "$REPO" >/dev/null 2>&1; then
  echo "→ $REPO already exists"
else
  echo "→ Creating $REPO ($VISIBILITY)"
  gh repo create "$REPO" "--$VISIBILITY"
fi
git remote get-url origin >/dev/null 2>&1 || git remote add origin "git@github.com:$REPO.git"
git push -u origin main

echo "→ Enabling GitHub Pages (source: GitHub Actions)"
gh api -X POST "repos/$REPO/pages" -f build_type=workflow >/dev/null 2>&1 \
  || gh api -X PUT "repos/$REPO/pages" -f build_type=workflow >/dev/null

echo "→ Restricting the github-pages environment to the prod branch"
gh api -X PUT "repos/$REPO/environments/github-pages" --input - >/dev/null <<'JSON'
{ "deployment_branch_policy": { "protected_branches": false, "custom_branch_policies": true } }
JSON
gh api "repos/$REPO/environments/github-pages/deployment-branch-policies" \
  --jq '.branch_policies[] | select(.name != "prod") | .id' |
  while read -r id; do
    gh api -X DELETE "repos/$REPO/environments/github-pages/deployment-branch-policies/$id"
  done
gh api -X POST "repos/$REPO/environments/github-pages/deployment-branch-policies" \
  -f name=prod -f type=branch >/dev/null 2>&1 || true

echo "→ Setting custom domain $DOMAIN"
gh api -X PUT "repos/$REPO/pages" -f cname="$DOMAIN" >/dev/null

echo "→ Pushing prod (triggers the first deploy)"
git push -u origin prod

echo "✓ Done. Next: point DNS for $DOMAIN at GitHub Pages (see README), then"
echo "  gh api -X PUT repos/$REPO/pages -F https_enforced=true"
