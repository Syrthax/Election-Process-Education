# VoteWise LLM proxy (Cloudflare Worker)

Holds the Featherless API key server-side and forwards chat completions
from the VoteWise client. Fixes the security gap where Vite would otherwise
inline the key into the public bundle.

## Endpoints

| Method | Path | What it does |
|---|---|---|
| `POST` | `/` | Forwards a `chat/completions`-style payload to Featherless |
| `GET` | `/health` | Liveness check, returns `{ ok: true, model }` |
| `OPTIONS` | `*` | CORS preflight |

## Request / response shape

The Worker accepts the same JSON the client sends to Featherless, but
**without** the API key — the Worker injects it. Validation:

- `messages` must be a non-empty array of `{role, content}` (≤ 14 entries)
- non-system message content ≤ 1000 chars
- `temperature` is clamped to `[0, 1]`, `max_tokens` to `[1, 1024]`
- `model` is honoured if provided, otherwise the env default is used

## Deploy

```bash
cd workers/llm-proxy
npm install
npx wrangler login
npx wrangler secret put FEATHERLESS_API_KEY    # paste the key when prompted
npx wrangler deploy
```

After deploy, set `VITE_LLM_PROXY_URL` in the main app's env (or in
GitHub repo Variables) to the worker URL, e.g.

```
VITE_LLM_PROXY_URL=https://votewise-llm-proxy.<account>.workers.dev
```

The client (`src/utils/featherless.js`) uses the proxy when this var is
set and falls back to direct Featherless calls otherwise.

## Optional: KV-backed rate limit

Create a KV namespace and bind it as `RATE_LIMIT`:

```bash
npx wrangler kv namespace create RATE_LIMIT
# Then add to wrangler.toml under [[kv_namespaces]]:
# [[kv_namespaces]]
# binding = "RATE_LIMIT"
# id = "<id from previous command>"
```

Without the binding, rate limiting is skipped (the Worker still
enforces origin allow-list and payload validation).

## Update the CORS allow-list

In `wrangler.toml` under `[vars]`, edit `ALLOWED_ORIGINS` to a
comma-separated list of origins, e.g.

```
ALLOWED_ORIGINS = "http://localhost:5173,https://syrthax.github.io"
```

Re-deploy after changes.
