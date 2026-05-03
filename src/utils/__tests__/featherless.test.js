import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We re-import the module fresh in each test so import.meta.env stubs
// take effect as expected.
async function loadModule() {
  const mod = await import('../featherless.js');
  return mod;
}

describe('isFeatherlessConfigured', () => {
  beforeEach(() => {
    vi.resetModules();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns false when no key', async () => {
    vi.stubEnv('VITE_FEATHERLESS_API_KEY', '');
    const { isFeatherlessConfigured } = await loadModule();
    expect(isFeatherlessConfigured()).toBe(false);
  });

  it('returns true when key set', async () => {
    vi.stubEnv('VITE_FEATHERLESS_API_KEY', 'test-key');
    const { isFeatherlessConfigured } = await loadModule();
    expect(isFeatherlessConfigured()).toBe(true);
  });
});

describe('askFeatherless', () => {
  beforeEach(() => {
    vi.resetModules();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('throws when API key not configured', async () => {
    vi.stubEnv('VITE_FEATHERLESS_API_KEY', '');
    const { askFeatherless } = await loadModule();
    await expect(askFeatherless('hello')).rejects.toThrow(/not configured/);
  });

  it('calls Featherless endpoint with correct payload', async () => {
    vi.stubEnv('VITE_FEATHERLESS_API_KEY', 'test-key');
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'Polls open at 7 AM.' } }] }),
    });
    const { askFeatherless } = await loadModule();
    const out = await askFeatherless('when do polls open');
    expect(out).toBe('Polls open at 7 AM.');

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.featherless.ai/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer test-key' }),
      })
    );
    const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
    expect(body.messages[0].role).toBe('system');
    expect(body.messages[0].content).toMatch(/never recommend|NEVER recommend/i);
    expect(body.messages.at(-1)).toEqual({ role: 'user', content: 'when do polls open' });
  });

  it('throws on non-OK response', async () => {
    vi.stubEnv('VITE_FEATHERLESS_API_KEY', 'test-key');
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
      text: async () => 'down',
    });
    const { askFeatherless } = await loadModule();
    await expect(askFeatherless('hi')).rejects.toThrow(/503/);
  });

  it('throws on empty content', async () => {
    vi.stubEnv('VITE_FEATHERLESS_API_KEY', 'test-key');
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [] }),
    });
    const { askFeatherless } = await loadModule();
    await expect(askFeatherless('hi')).rejects.toThrow(/Empty response/);
  });
});
