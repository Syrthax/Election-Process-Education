import { describe, it, expect } from 'vitest';
import { checkNeutrality, sanitizeOutput, NEUTRALITY_DISCLAIMER } from '../neutrality';

describe('checkNeutrality', () => {
  it.each([
    'who should i vote for',
    'WHO SHOULD I VOTE FOR?',
    'Tell me the best candidate',
    'who is the worst candidate',
    'can you recommend someone for me',
    'which party is better',
    'who will win this election',
    'who is winning',
    'should i support this party',
    'is XYZ good',
    'is XYZ bad',
    'vote for ABC',
  ])('flags advisory query: %s', (query) => {
    const result = checkNeutrality(query);
    expect(result.isAdvisory).toBe(true);
    expect(typeof result.response).toBe('string');
    expect(result.response.length).toBeGreaterThan(0);
  });

  it.each([
    'how do I register to vote',
    'where is my polling booth',
    'what documents do I need',
    'when does polling start',
    'how does the EVM work',
    'what is VVPAT',
    'NRI voting rules',
    '',
  ])('does NOT flag factual query: %s', (query) => {
    const result = checkNeutrality(query);
    expect(result.isAdvisory).toBe(false);
    expect(result.response).toBeNull();
  });
});

describe('sanitizeOutput', () => {
  it('replaces banned advisory terms', () => {
    const out = sanitizeOutput('This is the best candidate, the worst leader, the winner.');
    expect(out).not.toMatch(/\bbest\b/i);
    expect(out).not.toMatch(/\bworst\b/i);
    expect(out).not.toMatch(/\bwinner\b/i);
    expect(out).toMatch(/\[term removed for neutrality\]/);
  });

  it('preserves neutral text', () => {
    const out = sanitizeOutput('Polls open at 7 AM. Carry your EPIC.');
    expect(out).toBe('Polls open at 7 AM. Carry your EPIC.');
  });

  it('is case-insensitive', () => {
    expect(sanitizeOutput('the BEST option')).not.toMatch(/BEST/);
  });
});

describe('NEUTRALITY_DISCLAIMER', () => {
  it('mentions Election Commission of India', () => {
    expect(NEUTRALITY_DISCLAIMER).toMatch(/Election Commission of India/);
  });
});
