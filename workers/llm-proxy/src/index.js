// VoteWise LLM proxy — Cloudflare Worker
// ----------------------------------------------------------------
// Why this exists: the React client cannot hold the Featherless API
// key safely (Vite inlines VITE_* vars into the public bundle). This
// Worker holds the key server-side, applies CORS + a small rate limit,
// validates input, and forwards the chat request to Featherless.
//
// Deploy:
//   cd workers/llm-proxy
//   npx wrangler login
//   npx wrangler secret put FEATHERLESS_API_KEY
//   npx wrangler deploy
// Then set VITE_LLM_PROXY_URL in the Pages env (or repo Variables) to
// the worker URL, e.g. https://votewise-llm-proxy.<account>.workers.dev

const FEATHERLESS_ENDPOINT = 'https://api.featherless.ai/v1/chat/completions';
const MAX_MESSAGES = 14;
const MAX_USER_CHARS = 1000;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method === 'GET' && new URL(request.url).pathname === '/health') {
      return json({ ok: true, model: env.DEFAULT_MODEL }, 200, cors);
    }

    if (request.method !== 'POST') {
      return json({ error: 'method_not_allowed' }, 405, cors);
    }

    if (!env.FEATHERLESS_API_KEY) {
      return json({ error: 'proxy_misconfigured' }, 500, cors);
    }

    // Origin allow-list.
    if (origin && !isAllowedOrigin(origin, env)) {
      return json({ error: 'forbidden_origin' }, 403, cors);
    }

    // Rate limit (best-effort, KV-backed).
    const rateLimit = await checkRateLimit(request, env);
    if (!rateLimit.ok) {
      return json({ error: 'rate_limited', retry_after: rateLimit.retryAfter }, 429, {
        ...cors,
        'Retry-After': String(rateLimit.retryAfter),
      });
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: 'invalid_json' }, 400, cors);
    }

    const validation = validatePayload(payload);
    if (!validation.ok) {
      return json({ error: 'invalid_payload', detail: validation.reason }, 400, cors);
    }

    const upstreamBody = {
      model: payload.model || env.DEFAULT_MODEL,
      messages: payload.messages,
      temperature: clamp(payload.temperature ?? 0.3, 0, 1),
      max_tokens: clamp(payload.max_tokens ?? 500, 1, 1024),
    };

    const upstream = await fetch(FEATHERLESS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.FEATHERLESS_API_KEY}`,
      },
      body: JSON.stringify(upstreamBody),
    });

    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
        ...cors,
      },
    });
  },
};

function corsHeaders(origin, env) {
  const allowed = isAllowedOrigin(origin, env) ? origin : '';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function isAllowedOrigin(origin, env) {
  const list = String(env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  return list.includes(origin);
}

function validatePayload(p) {
  if (!p || typeof p !== 'object') return { ok: false, reason: 'not_an_object' };
  if (!Array.isArray(p.messages)) return { ok: false, reason: 'messages_required' };
  if (p.messages.length === 0) return { ok: false, reason: 'messages_empty' };
  if (p.messages.length > MAX_MESSAGES) return { ok: false, reason: 'too_many_messages' };

  for (const m of p.messages) {
    if (!m || typeof m !== 'object') return { ok: false, reason: 'bad_message' };
    if (!['system', 'user', 'assistant'].includes(m.role)) return { ok: false, reason: 'bad_role' };
    if (typeof m.content !== 'string') return { ok: false, reason: 'bad_content' };
    if (m.content.length > MAX_USER_CHARS && m.role !== 'system') {
      return { ok: false, reason: 'message_too_long' };
    }
  }
  return { ok: true };
}

async function checkRateLimit(request, env) {
  if (!env.RATE_LIMIT) return { ok: true };
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const limit = parseInt(env.RATE_LIMIT_PER_MIN || '20', 10);
  const now = Math.floor(Date.now() / 1000);
  const windowKey = `rl:${ip}:${Math.floor(now / 60)}`;

  const current = parseInt((await env.RATE_LIMIT.get(windowKey)) || '0', 10);
  if (current >= limit) {
    return { ok: false, retryAfter: 60 - (now % 60) };
  }
  await env.RATE_LIMIT.put(windowKey, String(current + 1), { expirationTtl: 90 });
  return { ok: true };
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}
