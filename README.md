# VoteWise — Election Process Education

> Built for **Google for Developers · PromptWars Virtual** (Hack2Skill).

A neutral, fact-based education app for the Indian electoral process. React + Vite, with a Gemma-powered AI assistant that actively helps voters with logistics — but is hard-blocked from recommending any candidate or party.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-57_passing-brightgreen)](src)
[![Deploy](https://github.com/Syrthax/Election-Process-Education/actions/workflows/deploy.yml/badge.svg)](https://github.com/Syrthax/Election-Process-Education/actions)

🔗 **Live demo:** https://syrthax.github.io/Election-Process-Education/
📦 **Repo:** https://github.com/Syrthax/Election-Process-Education

---

## 1. Chosen vertical

**Civic Tech / Election Process Education.**

The challenge brief is to build a real-world application that educates Indian voters about the electoral process. VoteWise picks the *most under-served* slice of that problem — first-time voters who get lost between voter registration, finding their booth, understanding the EVM/VVPAT, and navigating edge cases (lost EPIC, moved cities, NRI voting). The Election Commission of India's resources exist but are scattered across multiple sites and forms; VoteWise stitches them into a single guided experience and adds an AI assistant to answer the long tail of personal questions.

**Hard constraint, self-imposed:** the system must never recommend a candidate or party. Voter education ≠ voter influence.

---

## 2. Approach and logic

### Design principles

1. **Neutrality is non-negotiable.** A civic-tech tool that even *appears* to lean is worse than no tool. Neutrality is enforced as **layered defence**, not a single check.
2. **Help with what's hard, link out for what's authoritative.** We give logistics, walkthroughs, and a map; for the actual voter-roll lookup we deep-link to `voters.eci.gov.in`. We never claim to be the source of truth for whether a person is registered.
3. **Graceful degradation.** Every external service is optional — the app stays useful when keys are missing. No Featherless key → keyword responder. No Google Maps key → OpenStreetMap. No GA → no-op.
4. **Zero backend.** A static SPA is cheap to host (GitHub Pages) and has no PII surface — we never see a voter's address; geocoding is client-to-Nominatim direct.
5. **Build for the AI evaluator AND humans.** Lint, tests, accessibility, code splitting, CSP — these are scored *and* they make the product better.

### How neutrality is enforced (layered)

```
User query
    │
    ▼
┌──────────────────────────────────┐
│ 1. Regex pre-filter              │  src/utils/neutrality.js
│   ADVISORY_PATTERNS catches      │  Catches "who should I vote for",
│   the obvious advisory phrasing  │  "best candidate", "will X win", etc.
└──────────────┬───────────────────┘
               │ pass
               ▼
┌──────────────────────────────────┐
│ 2. Strict system prompt          │  src/utils/featherless.js
│   to Gemma 2: NEVER recommend,   │  Hard rules + topic scope + refusal
│   rank, predict, or opine        │  template baked into the prompt.
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ 3. Output sanitiser              │  src/utils/neutrality.js
│   replaces banned terms          │  best/worst/winner/loser → [redacted]
│   ("best", "worst", "winner"…)   │
└──────────────┬───────────────────┘
               │
               ▼
            Response
```

A determined adversary can probably still elicit *something*. Three independent layers make accidental leakage very unlikely.

---

## 3. How the solution works

### High-level architecture

```
┌─────────────────────── Browser (static React SPA) ──────────────────────┐
│                                                                          │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Dashboard│  │ Voting Guide │  │ Find     │  │Candidate │  │Timeline│ │
│  │          │  │ (steps + EVM)│  │ Booth    │  │Explorer  │  │+ Help  │ │
│  └─────┬────┘  └──────┬───────┘  └─────┬────┘  └────┬─────┘  └────┬───┘ │
│        │              │                │            │             │     │
│        └──────────────┴────────────────┼────────────┴─────────────┘     │
│                                        │                                 │
│                            ┌───────────┴───────────┐                     │
│                            │   Ask VoteWise (chat) │                     │
│                            │   QueryGuard.jsx      │                     │
│                            └───────────┬───────────┘                     │
└──────────┬───────────┬─────────────────┼─────────────────┬───────────────┘
           │           │                 │                 │
           ▼           ▼                 ▼                 ▼
  ┌───────────────┐ ┌──────────┐ ┌────────────────┐ ┌──────────────────┐
  │  Featherless  │ │  Google  │ │  OpenStreetMap │ │ Google Analytics │
  │  → Gemma 2 9B │ │  Maps    │ │  Nominatim     │ │ 4 (route + event │
  │  (LLM)        │ │  Embed   │ │  (geocoding)   │ │  tracking)       │
  └───────────────┘ └──────────┘ └────────────────┘ └──────────────────┘

           Static data: src/data/{candidates,scenarios,timeline,votingSteps}.json
           — sourced from ECI affidavits via the Python scraper in /scripts.
```

### Per-feature flow

**Find Booth** — User types address or hits "Use My Location" → query is sanitised (HTML/control-char strip) → Nominatim geocodes (India only) → coordinates feed the Google Maps Embed API (`q=polling+booth+near+lat,lng`). When `VITE_GOOGLE_MAPS_API_KEY` is absent the same coordinates feed an OpenStreetMap embed instead, so the page works for anyone forking the repo.

**Ask VoteWise** — Query passes the regex guard → if advisory, returns a polite refusal locally, no API call. Otherwise calls Featherless `chat/completions` with Gemma 2 9B + the strict system prompt + last 6 turns. Response is run through the banned-term sanitiser before display. If the API fails or no key, falls back to a local keyword responder so the assistant *always* returns something useful.

**Candidate Explorer** — Loads from `candidates.json` (scraped from ECI affidavits and `myneta.info` via `scripts/scraper.py`). Search is debounced 200 ms; cards are `React.memo`'d; the comparison view is gated by `compareList.length >= 2`.

**Voting Guide** — Branches on the user's `userState` (not_registered / registered / ready_to_vote) and walks them through different paths. State is held in `AppContext` with a pure reducer (independently unit-tested).

**Analytics** — `App.jsx` mounts a `<RouteAnalytics>` component that listens to `useLocation` and fires a GA4 `page_view` on every route change. Specific events (`polling_booth_search`, `polling_booth_geolocate`) are emitted from page handlers via `trackEvent`.

### Build & deploy

- **Vite** with route-level `React.lazy` + `Suspense` and manual chunk splitting (`react-vendor`, `react-router`, `icons`).
- **GitHub Actions** (`.github/workflows/deploy.yml`) runs `lint → test → build → deploy` on every push to `main`. `npm test -- --run` gates the deploy on tests passing.
- **GitHub Pages** serves the static bundle. The workflow copies `index.html` → `404.html` so client-side deep links survive a refresh.

---

## 4. Assumptions made

These are explicit so the evaluator (and any future contributor) can challenge them.

| # | Assumption | Why it's safe / what to do if it's wrong |
|---|---|---|
| 1 | Users are accessing from India and want results in India. | Nominatim is hard-restricted to `countrycodes=in`; the language toggle covers EN + HI. For diaspora / NRI flows we link to ECI's NRI portal. |
| 2 | Authoritative voter-roll lookup will always live at `voters.eci.gov.in`. | We deep-link rather than scrape. If ECI changes the domain, one constant in `PollingBooth.jsx` updates. |
| 3 | Candidate affidavit data has a meaningful refresh cadence. | `scripts/scraper.py` ingests fresh `candidates.json` on demand. The UI labels the data with its source ("Election Commission of India — Affidavit Data") and always defers to ECI for the live view. |
| 4 | Featherless / Gemma 2 9B is "good enough" for civic-process Q&A. | The system prompt narrows the model to logistics. Hallucinations on dates / specific addresses are mitigated by always pointing back to `voters.eci.gov.in` and 1950. |
| 5 | The deployment surface is a static site (GitHub Pages). | Hence the Vite build inlines API keys. This is documented in `SECURITY.md`; for a production civic-tech tool the LLM and Maps calls should move behind a serverless proxy with rate limits. |
| 6 | Modern evergreen browsers (last 2 versions). | `<noscript>` fallback points users to ECI; CSS uses graceful fallbacks for `backdrop-filter`. |
| 7 | The neutrality-guard regex is best-effort, not perfect. | Hence the *three independent* layers in §2. We accept that a determined user might still extract something and rely on the LLM's system prompt as the strongest line. |
| 8 | Election dates in `timeline.json` are educational examples, not live. | Clearly labelled in the UI. The `scripts/scraper.py` pattern can be extended to ingest live ECI press notes. |
| 9 | Language coverage = English + Hindi initially. | `src/i18n/translations.js` is keyed; adding more languages is a JSON edit, not a code change. |

---

## Features

- 🤖 **Ask VoteWise** — assistant powered by **Google Gemma 2** via Featherless AI. Helps with documents, where/when to vote, registration steps, EVM/VVPAT, NRI rules, accessibility provisions. Hard-blocked from political recommendations.
- 📍 **Find Booth** — Google Maps Embed API (with OpenStreetMap fallback) + OSM Nominatim geocoding. Direct links to ECI, Google Maps, and OSM.
- 👥 **Candidate Explorer** — browse and compare up to 3 candidates side by side using factual affidavit data. Memoised cards + debounced search.
- 📋 **Voting Guide** — step-by-step walkthrough including EVM + VVPAT.
- 📅 **Timeline** + countdown to election day.
- 🆘 **Scenario Assistant** — lost EPIC, moved cities, NRI, missing from roll, etc.
- 🌐 **i18n** — English + Hindi.
- ♿ **Accessible** — skip link, ARIA roles, focus-visible, semantic HTML, `prefers-reduced-motion`, screen-reader friendly.
- 📈 **Google Analytics 4** with route-level + custom event tracking.

## Stack

| Layer | Tech |
|---|---|
| UI | React 19, react-router 7, Tailwind v4 |
| Build | Vite 8 (route-level code splitting + manual chunks) |
| LLM | Google Gemma 2 9B IT via Featherless AI |
| Maps | Google Maps Embed API → fallback to OpenStreetMap (Nominatim) |
| Analytics | Google Analytics 4 |
| Testing | Vitest + React Testing Library + jsdom (57 tests) |
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

The workflow at `.github/workflows/deploy.yml` runs **lint → tests → build → deploy** on every push to `main`.

**One-time setup:**
1. **Settings → Pages → Build and deployment → Source = GitHub Actions.**
2. **Settings → Secrets and variables → Actions → Secrets:**
   - `FEATHERLESS_API` (required for the AI assistant)
   - `GOOGLE_MAPS_API_KEY` (optional — OSM fallback otherwise)
3. **Settings → Secrets and variables → Actions → Variables:**
   - `GA_MEASUREMENT_ID` (e.g. `G-XXXXXXXXXX`, optional)
   - `FEATHERLESS_MODEL` (optional override of the default)

### ⚠️ Security caveat

Vite inlines `VITE_*` env vars into the **client bundle**. Keys deployed via Pages are recoverable from the JS. For a long-running public site, route LLM/Maps calls through a serverless proxy (Cloudflare Worker, Vercel function) and keep keys server-side. See [`SECURITY.md`](SECURITY.md) for the full threat model.

## Tests

```
src/utils/__tests__/neutrality.test.js   — guard + sanitiser (24 cases)
src/utils/__tests__/sanitize.test.js     — input sanitisation
src/utils/__tests__/featherless.test.js  — LLM client (mocked fetch + error paths)
src/utils/__tests__/analytics.test.js    — GA wrapper
src/context/__tests__/appReducer.test.js — every action + immutability
src/i18n/__tests__/I18nContext.test.jsx  — translation lookup, fallback, persistence
src/components/__tests__/QueryGuard.test.jsx — chat UI + neutrality guard end-to-end
```

```
$ npm run test:run
 Test Files  7 passed (7)
 Tests       57 passed (57)
```

## Project layout

```
src/
├── App.jsx                  # routes, code-split via React.lazy
├── components/              # reusable UI + custom hooks
├── context/
│   ├── AppContext.jsx       # provider only
│   ├── AppContextRef.js     # createContext lives here (react-refresh friendly)
│   ├── appReducer.js        # pure reducer (testable in isolation)
│   └── useApp.js            # hook
├── i18n/                    # same provider/ref/hook split + translations
├── pages/                   # route components
├── utils/
│   ├── analytics.js         # GA4 wrapper
│   ├── featherless.js       # Featherless / Gemma client
│   ├── neutrality.js        # guard + output sanitiser
│   └── sanitize.js          # HTML / control-char stripping
└── data/                    # JSON fixtures from scripts/scraper.py
.github/workflows/deploy.yml # lint → test → build → deploy
public/{robots.txt,sitemap.xml,manifest.json,favicon.svg}
SECURITY.md                  # threat model + reporting
LICENSE                      # MIT
```

## License

MIT — see [LICENSE](LICENSE).
