import { describe, it, expect } from 'vitest';
import { sanitizeUserInput, escapeHtml } from '../sanitize';

describe('sanitizeUserInput', () => {
  it('strips HTML tags', () => {
    expect(sanitizeUserInput('hello <script>alert(1)</script> world')).toBe('hello alert(1) world');
  });

  it('collapses whitespace and strips control chars', () => {
    // Tab/newline are control chars and get stripped, then runs of spaces collapse.
    expect(sanitizeUserInput('a    b   c')).toBe('a b c');
  });

  it('trims', () => {
    expect(sanitizeUserInput('  trim me  ')).toBe('trim me');
  });

  it('truncates to 500 chars', () => {
    const long = 'x'.repeat(600);
    expect(sanitizeUserInput(long)).toHaveLength(500);
  });

  it('returns empty string for non-string', () => {
    expect(sanitizeUserInput(null)).toBe('');
    expect(sanitizeUserInput(undefined)).toBe('');
    expect(sanitizeUserInput(123)).toBe('');
    expect(sanitizeUserInput({})).toBe('');
  });
});

describe('escapeHtml', () => {
  it('escapes all dangerous chars', () => {
    expect(escapeHtml('<b>"&\'</b>')).toBe('&lt;b&gt;&quot;&amp;&#39;&lt;/b&gt;');
  });

  it('returns empty string for non-string', () => {
    expect(escapeHtml(null)).toBe('');
  });
});
