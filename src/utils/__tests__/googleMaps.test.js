import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

async function load() { return import('../googleMaps.js'); }

describe('googleMaps', () => {
  beforeEach(() => vi.resetModules());
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('isGoogleMapsConfigured returns false without a key', async () => {
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', '');
    const { isGoogleMapsConfigured } = await load();
    expect(isGoogleMapsConfigured()).toBe(false);
  });

  it('geocodeAddress returns null when key missing', async () => {
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', '');
    const { geocodeAddress } = await load();
    expect(await geocodeAddress('Mumbai')).toBeNull();
  });

  it('geocodeAddress parses successful response', async () => {
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', 'k');
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 'OK',
        results: [{
          geometry: { location: { lat: 19.07, lng: 72.87 } },
          formatted_address: 'Mumbai, India',
          place_id: 'p1',
        }],
      }),
    });
    const { geocodeAddress } = await load();
    const r = await geocodeAddress('Mumbai');
    expect(r).toEqual({ lat: 19.07, lng: 72.87, label: 'Mumbai, India', placeId: 'p1' });
  });

  it('geocodeAddress returns null for ZERO_RESULTS', async () => {
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', 'k');
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ZERO_RESULTS', results: [] }),
    });
    const { geocodeAddress } = await load();
    expect(await geocodeAddress('xx')).toBeNull();
  });

  it('findNearbyPollingPlaces maps Places (New) response', async () => {
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', 'k');
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        places: [{
          displayName: { text: 'Govt School Andheri' },
          formattedAddress: '123 Lane, Mumbai',
          types: ['primary_school'],
          location: { latitude: 19.1, longitude: 72.85 },
          googleMapsUri: 'https://maps.google.com/?q=...',
        }],
      }),
    });
    const { findNearbyPollingPlaces } = await load();
    const places = await findNearbyPollingPlaces({ lat: 19.07, lng: 72.87 });

    expect(places).toHaveLength(1);
    expect(places[0]).toMatchObject({
      name: 'Govt School Andheri',
      address: '123 Lane, Mumbai',
      lat: 19.1,
      lng: 72.85,
    });
    expect(fetchSpy.mock.calls[0][1].headers['X-Goog-Api-Key']).toBe('k');
  });

  it('findNearbyPollingPlaces returns [] when key missing', async () => {
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', '');
    const { findNearbyPollingPlaces } = await load();
    expect(await findNearbyPollingPlaces({ lat: 0, lng: 0 })).toEqual([]);
  });
});
