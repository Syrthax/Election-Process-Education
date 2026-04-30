import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="animate-fade-in"
      style={{
        position: 'fixed',
        bottom: 96,
        left: 24,
        width: 44,
        height: 44,
        borderRadius: 12,
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--glass-border)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 90,
        transition: 'all 0.3s ease',
        color: 'var(--color-text-muted)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <ChevronUp size={20} />
    </button>
  );
}
