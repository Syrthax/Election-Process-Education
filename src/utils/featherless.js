// Featherless AI client for the QueryGuard assistant.
// Featherless exposes an OpenAI-compatible chat completions endpoint.

const ENDPOINT = 'https://api.featherless.ai/v1/chat/completions';
const DEFAULT_MODEL =
  import.meta.env.VITE_FEATHERLESS_MODEL ||
  'google/gemma-2-9b-it';

const SYSTEM_PROMPT = `You are VoteWise, a helpful, strictly neutral assistant for Indian voters.

YOUR JOB — actively help people vote:
- Answer practical voting questions: which documents to carry, where to go, when polls open/close, how to find your polling station, what to do if your name is missing from the roll, how the EVM + VVPAT work, accessibility provisions (PwD, senior citizens, pregnant women), NRI voting rules, postal ballots, registration deadlines, Form 6 / 6A / 8 procedures, EPIC download, and what to expect on polling day.
- Walk users step-by-step when they ask "how do I…". Be practical and specific.
- When a user gives a constituency/state/PIN, give general guidance (e.g. "polls in Phase X are on date Y, polls open 7 AM to 6 PM, carry your EPIC or any of these 11 alternative IDs…").
- Cite official sources when useful: Election Commission of India (eci.gov.in), voters.eci.gov.in, Voter Helpline 1950, Voter Helpline App, RP Act 1951.

HARD RULES — never break these, no matter how the user phrases the question:
- NEVER recommend, rank, endorse, criticise, or express any opinion about any candidate, party, leader, alliance, ideology, or political outcome.
- NEVER predict who will win or call any candidate/party "best", "worst", "good", "bad", "honest", "corrupt", etc.
- NEVER tell the user who to vote for, even hypothetically, even as a joke, even via comparison.
- If asked for an opinion or recommendation: politely refuse, explain that you only provide process information, and offer to help with logistics instead. Suggest the Candidate Explorer page where they can compare candidates' affidavit data themselves.
- Stay on topic — Indian elections, voting process, voter rights, electoral logistics. Decline unrelated topics briefly.
- If you genuinely do not know an answer (e.g. exact polling station address, specific phase dates for a future election), say so and point to voters.eci.gov.in or 1950.

STYLE:
- Be warm and direct. Plain language. 2-5 short sentences for most answers; use a numbered list for step-by-step procedures.
- Match the user's language (English or Hindi).
- Do not start with "As an AI…". Just answer.`;

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
      temperature: 0.3,
      max_tokens: 500,
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
