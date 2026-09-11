# Quantensprung

Landing- und Sales-Page für das Retreat **„Die 7 Schlüssel zur Befreiung“** mit Joachim & Michaela Andert – live unter **[quantensprung.ist](https://quantensprung.ist)**.

Static site built with [Vite](https://vite.dev) on [Bun](https://bun.sh). No framework, no tracking, fonts self-hosted (GDPR-friendly).

## Local development

```bash
bun install
bun run dev        # http://localhost:5173
bun run build      # → dist/
bun run preview    # serve dist/ locally
```

## Where things live

| What | Where |
| --- | --- |
| Page content (German copy) | `index.html` |
| Styles & design tokens (palette, fonts) | `src/styles/main.css` |
| Contact e-mail, booking link, mail templates | `CONTACT` / `MAILS` in `src/main.js` |
| Impressum / Datenschutz (placeholders) | `impressum.html`, `datenschutz.html` |
| Favicon, robots, sitemap | `public/` |

**Before launch:** set the real contact address in `src/main.js` (and the `mailto:` fallbacks in `index.html`), add the photo of Joachim & Michaela (see the `TODO` in `index.html`), and fill in Impressum and Datenschutz.

## Branches & deployment

```
feature ──PR──▶ main ──promote──▶ prod ──▶ GitHub Pages (quantensprung.ist)
```

- **main**: integration branch. `CI` builds every push and PR.
- **prod**: what's live. Only ever fast-forwarded to a commit on main. Every push to prod runs `Deploy (prod → GitHub Pages)`.

### Promote main → prod

Either:

- **Locally:** `bun run promote` checks that main is clean and in sync, lists the commits going live, builds, asks for confirmation, then runs `git push origin main:prod`. Pass `--yes` to skip the prompt.
- **On GitHub:** Actions → *Promote main → prod* → *Run workflow* on `main`. It builds the exact main commit, fast-forwards prod and triggers the deploy.
  GitHub's built-in token can't push commits that change `.github/workflows/*`. For those promotions, add a repo secret `PROMOTE_TOKEN` (a fine-grained PAT with *Contents* and *Workflows* write access), or promote locally.

If prod ever has commits that aren't on main (a hotfix), both paths refuse to run. Merge prod back into main first.

## One-time GitHub setup

`scripts/setup-github.sh <owner/repo>` creates the repo, enables Pages with GitHub Actions as the source, limits the `github-pages` environment to `prod`, sets the custom domain and pushes prod.

> GitHub Pages on a **private** repository needs a paid plan (GitHub Team/Enterprise for organizations). On the Free plan the repo must be public for Pages to work.

### DNS for quantensprung.ist

At the domain registrar:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | `<owner>.github.io` |

Once the certificate is issued, enforce HTTPS:

```bash
gh api -X PUT repos/<owner>/<repo>/pages -F https_enforced=true
```
