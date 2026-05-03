import { useState, useCallback } from 'react';
import { MapPin, Navigation, Search, ExternalLink, AlertCircle } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { sanitizeUserInput } from '../utils/sanitize';

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 }; // India
const GMAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function buildOsmEmbed(lat, lng) {
  const delta = 0.04;
  const left = lng - delta;
  const right = lng + delta;
  const top = lat + delta;
  const bottom = lat - delta;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}`;
}

function buildGoogleMapsEmbed(lat, lng) {
  // Google Maps Embed API — Place mode centred on coords with a polling-booth search.
  const q = encodeURIComponent(`polling booth near ${lat},${lng}`);
  return `https://www.google.com/maps/embed/v1/search?key=${GMAPS_KEY}&q=${q}&zoom=14`;
}

export default function PollingBooth() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [coords, setCoords] = useState(null);
  const [resolvedLabel, setResolvedLabel] = useState('');
  const [error, setError] = useState('');

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setError('');
    setLoading(true);
    trackEvent('polling_booth_geolocate');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setResolvedLabel('Your current location');
        setSearched(true);
        setLoading(false);
      },
      () => {
        setError('Unable to get your location. Please enter your address manually.');
        setLoading(false);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    const q = sanitizeUserInput(address.trim());
    if (!q) return;
    setError('');
    setLoading(true);
    setSearched(true);
    trackEvent('polling_booth_search', { query_length: q.length });
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(q)}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('Geocoding failed');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setCoords({ lat: parseFloat(lat), lng: parseFloat(lon) });
        setResolvedLabel(display_name);
      } else {
        setCoords(null);
        setResolvedLabel('');
        setError(`No location found for "${q}". Try a more specific address or PIN code.`);
      }
    } catch {
      setCoords(null);
      setError('Could not reach the geocoding service. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [address]);

  const center = coords || DEFAULT_CENTER;
  const usingGoogleMaps = Boolean(GMAPS_KEY);
  const mapEmbedUrl = usingGoogleMaps ? buildGoogleMapsEmbed(center.lat, center.lng) : buildOsmEmbed(center.lat, center.lng);
  const googleMapsSearchUrl = coords
    ? `https://www.google.com/maps/search/polling+booth/@${coords.lat},${coords.lng},14z`
    : `https://www.google.com/maps/search/polling+booth+near+${encodeURIComponent(address || 'India')}`;
  const directionsUrl = coords
    ? `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=polling+booth+near+${encodeURIComponent(address)}`;

  return (
    <div className="animate-fade-in-up">
      <div className="page-header" style={{ paddingTop: '1.5rem' }}>
        <h1>
          <span className="gradient-text">Find Your</span> Polling Booth
        </h1>
        <p>Locate the nearest polling station and get directions.</p>
      </div>

      <section aria-labelledby="search-heading" className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 id="search-heading" className="visually-hidden">Search for a polling booth</h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <MapPin size={16} aria-hidden="true" style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
            }} />
            <label htmlFor="address-input" className="visually-hidden">Your address, area, or PIN code</label>
            <input
              id="address-input"
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Enter your address, area, or PIN code..."
              autoComplete="street-address"
              maxLength={200}
              aria-describedby="address-help"
              style={{
                width: '100%',
                padding: '12px 12px 12px 38px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--glass-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                fontSize: '0.95rem',
              }}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} aria-busy={loading}>
            <Search size={18} aria-hidden="true" />
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleGeolocate}
            disabled={loading}
          >
            <Navigation size={18} aria-hidden="true" />
            Use My Location
          </button>
        </form>
        <p id="address-help" className="visually-hidden">Enter an address, area, or PIN code in India to find nearby polling stations.</p>
        {error && (
          <div role="alert" style={{
            marginTop: '0.75rem',
            padding: '0.6rem 0.85rem',
            borderRadius: 'var(--radius)',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fecaca',
            fontSize: '0.85rem',
          }}>
            {error}
          </div>
        )}
        {coords && resolvedLabel && (
          <div role="status" aria-live="polite" style={{
            marginTop: '0.75rem',
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
          }}>
            <span aria-hidden="true">📍</span> {resolvedLabel}
          </div>
        )}
      </section>

      <aside className="glass-card" style={{
        padding: '1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}>
        <AlertCircle size={20} aria-hidden="true" style={{ color: 'var(--color-info)', flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          <strong style={{ color: 'var(--color-text)' }}>Official Method:</strong> For the most accurate polling booth information,
          search your name on{' '}
          <a href="https://voters.eci.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-light)' }}>
            voters.eci.gov.in
          </a>{' '}
          using your EPIC number. Your exact polling station will be shown.
        </div>
      </aside>

      {searched && coords && (
        <section aria-labelledby="results-heading" className="animate-fade-in-up">
          <h2 id="results-heading" className="visually-hidden">Map of polling stations near {resolvedLabel || 'your location'}</h2>
          <div className="glass-card" style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
            <div style={{
              width: '100%',
              height: '400px',
              background: 'var(--color-surface-light)',
              position: 'relative',
            }}>
              <iframe
                key={`${coords.lat}-${coords.lng}-${usingGoogleMaps}`}
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map showing polling stations near ${resolvedLabel || 'your location'}`}
                allow="geolocation"
              />
            </div>
            <div style={{ padding: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href={googleMapsSearchUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <ExternalLink size={16} aria-hidden="true" />
                Open in Google Maps
              </a>
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <Navigation size={16} aria-hidden="true" />
                Get Directions
              </a>
              <a
                href={`https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=15/${coords.lat}/${coords.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <ExternalLink size={16} aria-hidden="true" />
                Open in OpenStreetMap
              </a>
            </div>
            {usingGoogleMaps && (
              <div style={{ padding: '0 1.25rem 1rem', fontSize: '0.7rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                Map data © Google
              </div>
            )}
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
              <span aria-hidden="true">📋</span> Polling Day Tips
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                'Arrive early to avoid long queues — booths open at 7 AM',
                'Carry your Voter ID (EPIC) or any approved photo ID',
                'No mobile phones or cameras allowed inside the booth',
                'Check your serial number in the voter list before going',
                'Persons with disabilities, pregnant women, and senior citizens get priority',
              ].map((tip, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.9rem' }}>
                  <span aria-hidden="true" style={{ color: 'var(--color-primary-light)' }}>•</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
