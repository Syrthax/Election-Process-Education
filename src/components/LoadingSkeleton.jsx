export default function LoadingSkeleton({ type = 'card', count = 3 }) {
  if (type === 'card') {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1rem',
      }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="glass-card skeleton-card" style={{ padding: '1.5rem' }}>
            <div className="skeleton-line" style={{ width: 60, height: 24, marginBottom: 16 }} />
            <div className="skeleton-line" style={{ width: '70%', height: 22, marginBottom: 8 }} />
            <div className="skeleton-line" style={{ width: '50%', height: 16, marginBottom: 20 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j}>
                  <div className="skeleton-line" style={{ width: '40%', height: 10, marginBottom: 6 }} />
                  <div className="skeleton-line" style={{ width: '60%', height: 16 }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="glass-card" style={{
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            <div className="skeleton-line" style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton-line" style={{ width: '60%', height: 18, marginBottom: 8 }} />
              <div className="skeleton-line" style={{ width: '40%', height: 14 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'hero') {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <div className="skeleton-line" style={{ width: 72, height: 72, borderRadius: 20, margin: '0 auto 1.5rem' }} />
        <div className="skeleton-line" style={{ width: '50%', height: 40, margin: '0 auto 1rem' }} />
        <div className="skeleton-line" style={{ width: '70%', height: 20, margin: '0 auto 0.5rem' }} />
        <div className="skeleton-line" style={{ width: '60%', height: 20, margin: '0 auto 2rem' }} />
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <div className="skeleton-line" style={{ width: 180, height: 48, borderRadius: 12 }} />
          <div className="skeleton-line" style={{ width: 180, height: 48, borderRadius: 12 }} />
        </div>
      </div>
    );
  }

  return null;
}
