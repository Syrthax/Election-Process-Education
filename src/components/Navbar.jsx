import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Vote, Menu, X, Home, ListChecks, Users, Calendar, MapPin, HelpCircle } from 'lucide-react';

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/guided-flow', label: 'Voting Guide', icon: ListChecks },
  { to: '/candidates', label: 'Candidates', icon: Users },
  { to: '/timeline', label: 'Timeline', icon: Calendar },
  { to: '/polling-booth', label: 'Find Booth', icon: MapPin },
  { to: '/scenarios', label: 'Help', icon: HelpCircle },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--glass-border)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
      }}>
        {/* Logo */}
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Vote size={20} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
            <span className="gradient-text">Vote</span>
            <span style={{ color: 'var(--color-text)' }}>Wise</span>
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <div style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }} className="desktop-nav">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: isActive ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                transition: 'all 0.2s ease',
              })}
            >
              <link.icon size={16} />
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-toggle"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--color-text)',
            cursor: 'pointer',
            padding: 8,
          }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          padding: '0.5rem 1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          borderTop: '1px solid var(--glass-border)',
        }} className="mobile-menu">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isActive ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              })}
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
