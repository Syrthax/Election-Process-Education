# VoteWise — Election Process Education

> Built for **Google for Developers · PromptWars Virtual** (Hack2Skill).

A neutral, fact-based education app for the Indian electoral process. React + Vite, with a Gemma-powered AI assistant that actively helps voters with logistics — but is hard-blocked from recommending any candidate or party.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-57_passing-brightgreen)](src)
[![Deploy](https://github.com/Syrthax/Election-Process-Education/actions/workflows/deploy.yml/badge.svg)](https://github.com/Syrthax/Election-Process-Education/actions)

---

## Features

- 🤖 **Ask VoteWise** — assistant powered by **Google Gemma 2** via Featherless AI. Helps with documents, where/when to vote, registration steps, EVM/VVPAT, NRI rules, accessibility provisions. Hard-blocked from political recommendations by a layered guard (system prompt + regex + sanitiser).
- 📍 **Find Booth** — Google Maps Embed API (with OpenStreetMap fallback) + OSM Nominatim geocoding. Direct links to ECI, Google Maps, and OSM.
- 👥 **Candidate Explorer** — browse and compare up to 3 candidates side by side using factual affidavit data. Memoised cards + debounced search.
- 📋 **Voting Guide** — step-by-step walkthrough with EVM + VVPAT.
- 📅 **Timeline** + countdown to election day.
- 🆘 **Scenario Assistant** — lost EPIC, moved cities, NRI, missing from roll, etc.
- 🌐 **i18n** — English + Hindi.
- ♿ **Accessible** — skip link, ARIA roles, focus-visible, semantic HTML, `prefers-reduced-motion`, screen-reader friendly.
- 📈 **Google Analytics 4** with route-level tracking.

## Stack

| Layer | Tech |
|---|---|
| UI | React 19, react-router 7, Tailwind v4 |
| Build | Vite 8 (with route-level code splitting + manual chunks) |
| LLM | Google Gemma 2 9B IT via Featherless AI |
| Maps | Google Maps Embed API → fallback to OpenStreetMap (Nominatim) |
| Analytics | Google Analytics 4 |
| Testing | Vitest + React Testing Library + jsdom |
| Hosting | GitHub Pages via GitHub Actions |

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in keys (all optional)
npm run dev                  # http://localhost:5173
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build (code-split, minified) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint (zero errors enforced in CI) |
| `npm test` | Vitest in watch mode |
| `npm run test:run` | Single CI-style test pass |
| `npm run test:coverage` | Coverage report (text + html + lcov) |

## Environment variables

All client env vars are prefixed `VITE_` and live in `.env.local` (gitignored). Every variable is optional — the app degrades gracefully when keys are missing.

| Variable | Effect when missing |
|---|---|
| `VITE_FEATHERLESS_API_KEY` | Assistant falls back to a local keyword responder |
| `VITE_FEATHERLESS_MODEL` | Defaults to `google/gemma-2-9b-it` |
| `VITE_GOOGLE_MAPS_API_KEY` | Map falls back to OpenStreetMap embed |
| `VITE_GA_MEASUREMENT_ID` | Analytics calls become no-ops |

## Deployment (GitHub Pages)

The workflow at `.github/workflows/deploy.yml` runs lint → tests → build → deploy on every push to `main`.

**One-time setup:**
1. **Settings → Pages → Build and deployment → Source = GitHub Actions.**
2. **Settings → Secrets and variables → Actions → New repository secret:**
   - `FEATHERLESS_API` (required)
   - `GOOGLE_MAPS_API_KEY` (optional — OSM fallback otherwise)
3. **Settings → Secrets and variables → Actions → Variables:**
   - `GA_MEASUREMENT_ID` (e.g. `G-XXXXXXXXXX`, optional)
   - `FEATHERLESS_MODEL` (optional override)

The workflow copies `index.html` → `404.html` so client-side routes survive a refresh on Pages.

### ⚠️ Security caveat

Vite inlines `VITE_*` env vars into the **client bundle**. Keys deployed via Pages are recoverable from the JS. For a long-running public site, route LLM/Maps calls through a serverless proxy (Cloudflare Worker, Vercel function) and keep keys server-side. See `SECURITY.md` for the full threat model.

## Architecture highlights

- **Neutrality is layered defence**, not a single check:
  1. Regex pre-filter on the user query (`src/utils/neutrality.js`)
  2. Strict system prompt to Gemma (`src/utils/featherless.js`)
  3. Banned-term sanitiser on model output
- **Code splitting**: every route is `React.lazy`'d; vendor chunks are separated (react / react-router / icons / app).
- **Pure reducer** in `src/context/appReducer.js` — independently unit-tested.
- **Context split** — every `createContext` call lives in its own `*Ref.js` file so React Refresh and `react-refresh/only-export-components` stay happy.

## Tests

```
src/utils/__tests__/neutrality.test.js   — guard + sanitiser
src/utils/__tests__/sanitize.test.js     — input sanitisation
src/utils/__tests__/featherless.test.js  — LLM client (mocked fetch, error paths)
src/utils/__tests__/analytics.test.js    — GA wrapper
src/context/__tests__/appReducer.test.js — every action + immutability
src/i18n/__tests__/I18nContext.test.jsx  — translation lookup, fallback, persistence
src/components/__tests__/QueryGuard.test.jsx — chat UI + neutrality guard
```

## License

MIT — see [LICENSE](LICENSE).
