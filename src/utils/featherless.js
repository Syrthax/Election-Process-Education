// Featherless AI client for the QueryGuard assistant.
// Featherless exposes an OpenAI-compatible chat completions endpoint.

const ENDPOINT = 'https://api.featherless.ai/v1/chat/completions';
const DEFAULT_MODEL =
  import.meta.env.VITE_FEATHERLESS_MODEL ||
  'meta-llama/Meta-Llama-3.1-8B-Instruct';

const SYSTEM_PROMPT = `You are VoteWise, a strictly neutral assistant for Indian election process education.

HARD RULES — never break these:
- Provide only factual, verifiable information about the Indian electoral process.
- NEVER recommend, rank, endorse, criticise, or express any opinion about any candidate, party, leader, ideology, or political outcome.
- NEVER predict who will win or claim any candidate is "best", "worst", "good", or "bad".
- If asked for an opinion or recommendation, refuse politely and redirect to factual sources (Election Commission of India, voters.eci.gov.in, Voter Helpline 1950).
- Cite official sources where relevant (ECI, voters.eci.gov.in, RP Act 1951, Form 6 / 6A).
- Keep answers concise (2-4 short sentences). Use plain language.
- If you do not know, say so and point the user to voters.eci.gov.in or 1950.
- Topics you cover: voter registration, EPIC / Voter ID, polling booth lookup, voting process (EVM/VVPAT), eligibility, NRI voting, election timeline, candidate affidavit data (factual), accessibility provisions.

Respond in the same language the user writes in (English or Hindi).`;

export function isFeatherlessConfigured() {
  return Boolean(import.meta.env.VITE_FEATHERLESS_API_KEY);
}

export async function askFeatherless(userMessage, history = [], { signal } = {}) {
  const apiKey = import.meta.env.VITE_FEATHERLESS_API_KEY;
  if (!apiKey) {
    throw new Error('Featherless API key is not configured');
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.slice(-6).map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: userMessage },
  ];

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages,
      temperature: 0.2,
      max_tokens: 350,
    }),
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Featherless API ${res.status}: ${text || res.statusText}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response from Featherless');
  return content.trim();
}
