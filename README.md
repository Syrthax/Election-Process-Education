# Election Process Education (VoteWise)

A neutral, fact-based education app for the Indian electoral process — built with React + Vite. Includes a candidate explorer, voting walkthrough, polling-booth finder, election timeline, and a neutrality-guarded AI assistant.

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in your Featherless API key (optional)
npm run dev
```

The app runs at `http://localhost:5173`.

## Environment variables

All variables go in `.env.local` (gitignored) for local dev. Vite only exposes variables prefixed with `VITE_` to the client bundle.

| Variable | Purpose |
|----------|---------|
| `VITE_FEATHERLESS_API_KEY` | Enables the live AI assistant via [Featherless AI](https://featherless.ai). If unset, the assistant falls back to a local keyword responder. |
| `VITE_FEATHERLESS_MODEL`   | Optional model override (default: `google/gemma-2-9b-it`). |

## Deployment (GitHub Pages)

A GitHub Actions workflow at `.github/workflows/deploy.yml` builds and deploys the site to GitHub Pages on every push to `main`.

**Setup (one-time):**
1. **Repo → Settings → Secrets and variables → Actions → New repository secret**
   Name: `FEATHERLESS_API`  ·  Value: your Featherless API key.
2. **Repo → Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Push to `main`. The workflow will build with the secret injected as `VITE_FEATHERLESS_API_KEY` and publish to `https://<user>.github.io/Election-Process-Education/`.

The workflow also copies `index.html` → `404.html` so client-side routes survive a refresh.

### ⚠️ Security caveat (read before publishing)

Vite inlines `VITE_*` env vars into the **client bundle**. That means the Featherless key shipped via GitHub Pages is **visible to anyone who views the JS** — they can extract and reuse it. For a public site, you should either:

- Put the API call behind a serverless proxy (Cloudflare Workers, Vercel function, etc.) that holds the key server-side, or
- Use a Featherless key with a low spend cap and aggressive rate limits, treating leakage as expected.

For local dev / private demos this is fine.

## Features

- **Find Booth** — geocodes addresses or your current location via OpenStreetMap Nominatim and embeds a map (no API key required). Links out to Google Maps and the official ECI lookup.
- **Ask VoteWise** — chat assistant powered by Featherless AI with a strict neutrality system prompt. Refuses recommendations and politically loaded queries.
- **Candidate Explorer / Compare** — browse and compare candidate affidavit data side by side.
- **Guided Voting Flow** — step-by-step voting walkthrough including EVM + VVPAT.
- **Timeline / Scenario Assistant** — election dates and eligibility scenarios.
- **i18n** — English and Hindi.

## Scripts

```bash
npm run dev      # dev server
npm run build    # production build
npm run preview  # preview production build
npm run lint     # ESLint
```

## Neutrality

This project intentionally refuses to recommend candidates or parties. The assistant is bound by a system prompt and a regex-based guard (see `src/utils/neutrality.js` and `src/utils/featherless.js`). Output is also passed through a banned-term filter.
