// Defensive sanitisation helpers for free-text user input.
// Stripping HTML / control characters before sending the value to a
// third-party API (Nominatim, Featherless, etc.) reduces the surface
// for injection-style abuse, even though those APIs are themselves
// trusted.

const HTML_TAG_RE = /<\/?[^>]+>/g;
const MAX_LENGTH = 500;

// Strip ASCII control chars (U+0000-U+001F) and DEL (U+007F) by code,
// not by literal characters in source — easier on linters and reviewers.
function stripControlChars(s) {
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    if (code > 0x1f && code !== 0x7f) out += s[i];
  }
  return out;
}

export function sanitizeUserInput(value) {
  if (typeof value !== 'string') return '';
  let out = value.replace(HTML_TAG_RE, '');
  out = stripControlChars(out);
  return out.replace(/\s+/g, ' ').trim().slice(0, MAX_LENGTH);
}

export function escapeHtml(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
