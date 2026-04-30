// Neutrality enforcement utilities

const ADVISORY_PATTERNS = [
  /who should i vote/i,
  /best candidate/i,
  /worst candidate/i,
  /recommend/i,
  /which party is better/i,
  /who is winning/i,
  /who will win/i,
  /should i support/i,
  /is .+ good/i,
  /is .+ bad/i,
  /vote for .+/i,
];

const NEUTRALITY_RESPONSE = "This system provides factual, verifiable information only. It does not recommend, rank, or express opinions about any candidate or party. However, I can help you compare candidates based on publicly available data.";

/**
 * Check if a query is seeking political advice
 * @param {string} query - User's input
 * @returns {{ isAdvisory: boolean, response: string | null }}
 */
export function checkNeutrality(query) {
  const isAdvisory = ADVISORY_PATTERNS.some(pattern => pattern.test(query));
  return {
    isAdvisory,
    response: isAdvisory ? NEUTRALITY_RESPONSE : null,
  };
}

/**
 * Sanitize any text to remove advisory language
 * @param {string} text
 * @returns {string}
 */
export function sanitizeOutput(text) {
  const banned = ['best', 'worst', 'recommended', 'favorite', 'favourite', 'superior', 'inferior', 'winner', 'loser'];
  let sanitized = text;
  banned.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    sanitized = sanitized.replace(regex, '[term removed for neutrality]');
  });
  return sanitized;
}

export const NEUTRALITY_DISCLAIMER = "⚖️ This system is strictly neutral. It provides only factual, verifiable information sourced from the Election Commission of India. It does not recommend, rank, or express opinions about any candidate or political party.";
