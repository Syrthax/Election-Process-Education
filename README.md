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

All variables go in `.env.local` (gitignored). Vite only exposes variables prefixed with `VITE_` to the client.

| Variable | Purpose |
|----------|---------|
| `VITE_FEATHERLESS_API_KEY` | Enables the live AI assistant via [Featherless AI](https://featherless.ai). If unset, the assistant falls back to a local keyword responder. |
| `VITE_FEATHERLESS_MODEL`   | Optional model override (default: `meta-llama/Meta-Llama-3.1-8B-Instruct`). |

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
