import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

async function loadModule() {
  return import('../analytics.js');
}

describe('analytics', () => {
  beforeEach(() => {
    vi.resetModules();
    delete window.gtag;
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('isAnalyticsEnabled returns false when no measurement id', async () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', '');
    const { isAnalyticsEnabled } = await loadModule();
    expect(isAnalyticsEnabled()).toBe(false);
  });

  it('isAnalyticsEnabled returns false when gtag missing', async () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST');
    const { isAnalyticsEnabled } = await loadModule();
    expect(isAnalyticsEnabled()).toBe(false);
  });

  it('isAnalyticsEnabled returns true when both present', async () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST');
    window.gtag = vi.fn();
    const { isAnalyticsEnabled } = await loadModule();
    expect(isAnalyticsEnabled()).toBe(true);
  });

  it('trackPageView calls gtag with page_path', async () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST');
    window.gtag = vi.fn();
    const { trackPageView } = await loadModule();
    trackPageView('/timeline', 'Timeline');
    expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', expect.objectContaining({
      page_path: '/timeline',
      page_title: 'Timeline',
    }));
  });

  it('trackEvent is a no-op when disabled', async () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', '');
    const { trackEvent } = await loadModule();
    expect(() => trackEvent('test', { foo: 'bar' })).not.toThrow();
  });
});
