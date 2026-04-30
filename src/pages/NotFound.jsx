import { Link } from 'react-router-dom';
import { Home, Vote, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '2rem',
    }}>
      {/* Big 404 */}
      <div style={{
        fontSize: 'clamp(5rem, 15vw, 10rem)',
        fontWeight: 900,
        lineHeight: 1,
        background: 'var(--gradient-primary)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        opacity: 0.3,
        userSelect: 'none',
        letterSpacing: '-0.05em',
      }}>
        404
      </div>

      <div style={{
        width: 64,
        height: 64,
        borderRadius: 18,
        background: 'rgba(99, 102, 241, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '-2rem 0 1.5rem',
      }}>
        <Search size={32} style={{ color: 'var(--color-primary-light)' }} />
      </div>

      <h1 style={{
        fontSize: '1.5rem',
        fontWeight: 800,
        marginBottom: '0.75rem',
        letterSpacing: '-0.02em',
      }}>
        Page Not Found
      </h1>
      <p style={{
        color: 'var(--color-text-muted)',
        maxWidth: 400,
        marginBottom: '2rem',
        fontSize: '0.95rem',
        lineHeight: 1.6,
      }}>
        The page you're looking for doesn't exist. Let's get you back to navigating the election process.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn-primary">
          <Home size={18} />
          Go Home
        </Link>
        <Link to="/guided-flow" className="btn-secondary">
          <Vote size={18} />
          Start Voting Guide
        </Link>
      </div>
    </div>
  );
}
