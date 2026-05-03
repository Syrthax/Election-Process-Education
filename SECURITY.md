# Security Policy

## Reporting a vulnerability

Email **sarthakghosh2006@gmail.com** with a description, reproduction steps, and any logs/proof-of-concept. Please do not open a public issue for security reports.

## Threat model

VoteWise is a static client-side React app. It has no backend of its own and stores no user data on a server.

| Asset | Where it lives | Threats considered |
|---|---|---|
| User-typed query (chat, address) | Browser memory only | XSS via stored output, injection into 3rd-party APIs |
| LLM API key (Featherless) | Inlined in production bundle when built with the GitHub Actions secret | Key extraction by anyone who downloads the JS |
| Maps API key (Google) | Inlined in production bundle | Same as above |
| GA Measurement ID | Inlined (non-secret) | n/a — public by design |
| LocalStorage | `votewise-lang` only | Quota abuse, cross-tab leak — none sensitive |

## Controls in place

- **Content-Security-Policy** restricts script/frame/connect origins (see `index.html`).
- **Input sanitisation** (`src/utils/sanitize.js`) strips HTML and control characters from free-text user input before it is sent to Nominatim/Featherless.
- **Output sanitisation** (`src/utils/neutrality.js`) replaces a banned-term list to prevent the assistant from leaking advisory phrasing.
- **Neutrality guard** — both a regex check and a strict system prompt prevent the assistant from producing political recommendations.
- **External links** use `rel="noopener noreferrer"` and `target="_blank"`.
- **Dependencies** are kept up-to-date; CI runs `npm audit` on every push.
- **Strict React StrictMode** in production — surfaces effect-cleanup bugs.
- **Subresource integrity** is not yet applied to the Google Fonts CDN — tracked.

## Known limitations

- Vite inlines `VITE_*` env vars into the client bundle. The Featherless and Maps API keys shipped via GitHub Pages are recoverable from the JS bundle. For a long-running public deployment, route those calls through a serverless proxy (Cloudflare Worker, Vercel Function) holding the key server-side, and apply rate limits.
- The neutrality guard is best-effort. A determined user can phrase a query to elicit something like an opinion. The system-prompt + sanitiser combination is layered defence, not a guarantee.

## Hardening checklist (operational)

- [ ] Set spend caps + per-IP rate limits on the Featherless and Google API keys.
- [ ] Restrict the Google Maps key to the deployed origin in Google Cloud Console.
- [ ] Enable GitHub Dependabot alerts on the repo.
- [ ] Rotate keys quarterly.
