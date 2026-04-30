import { useState } from 'react';
import { MapPin, Navigation, Search, ExternalLink, AlertCircle } from 'lucide-react';

export default function PollingBooth() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [useGeolocate, setUseGeolocate] = useState(false);
  const [coords, setCoords] = useState(null);

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setSearched(true);
        setLoading(false);
      },
      (error) => {
        alert('Unable to get location. Please enter your address manually.');
        setLoading(false);
      }
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!address.trim()) return;
    setLoading(true);
    setSearched(true);
    // Simulate search
    setTimeout(() => setLoading(false), 800);
  };

  const googleMapsSearchUrl = address
    ? `https://www.google.com/maps/search/polling+booth+near+${encodeURIComponent(address)}`
    : '';

  const googleMapsEmbedUrl = coords
    ? `https://www.google.com/maps?q=polling+booth&ll=${coords.lat},${coords.lng}&z=14&output=embed`
    : address
      ? `https://www.google.com/maps?q=polling+booth+near+${encodeURIComponent(address)}&output=embed`
      : '';

  return (
    <div className="animate-fade-in-up">
      <div className="page-header" style={{ paddingTop: '1.5rem' }}>
        <h1>
          <span className="gradient-text">Find Your</span> Polling Booth
        </h1>
        <p>Locate the nearest polling station and get directions.</p>
      </div>

      {/* Search Section */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearch} style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <MapPin size={16} style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
            }} />
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Enter your address, area, or PIN code..."
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
          <button type="submit" className="btn-primary" disabled={loading}>
            <Search size={18} />
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleGeolocate}
            disabled={loading}
          >
            <Navigation size={18} />
            Use My Location
          </button>
        </form>
      </div>

      {/* Info box */}
      <div className="glass-card" style={{
        padding: '1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}>
        <AlertCircle size={20} style={{ color: 'var(--color-info)', flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          <strong style={{ color: 'var(--color-text)' }}>Official Method:</strong> For the most accurate polling booth information, 
          search your name on{' '}
          <a href="https://voters.eci.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-light)' }}>
            voters.eci.gov.in
          </a>{' '}
          using your EPIC number. Your exact polling station will be shown. The map below shows polling booths near your general area.
        </div>
      </div>

      {/* Map Area */}
      {searched && (
        <div className="animate-fade-in-up">
          <div className="glass-card" style={{
            overflow: 'hidden',
            marginBottom: '1.5rem',
          }}>
            {/* Map embed */}
            <div style={{
              width: '100%',
              height: '400px',
              background: 'var(--color-surface-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
              <iframe
                src={googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Polling booth map"
              />
            </div>

            {/* Actions */}
            <div style={{
              padding: '1.25rem',
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
            }}>
              <a
                href={googleMapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <ExternalLink size={16} />
                Open in Google Maps
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=polling+booth+near+${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <Navigation size={16} />
                Get Directions
              </a>
            </div>
          </div>

          {/* Tips */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>📋 Polling Day Tips</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                'Arrive early to avoid long queues — booths open at 7 AM',
                'Carry your Voter ID (EPIC) or any approved photo ID',
                'No mobile phones or cameras allowed inside the booth',
                'Check your serial number in the voter list before going',
                'Persons with disabilities, pregnant women, and senior citizens get priority',
              ].map((tip, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  fontSize: '0.9rem',
                }}>
                  <span style={{ color: 'var(--color-primary-light)' }}>•</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
