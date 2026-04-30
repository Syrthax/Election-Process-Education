import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Keyboard, X } from 'lucide-react';

const shortcuts = [
  { keys: ['g', 'h'], description: 'Go to Home', action: '/' },
  { keys: ['g', 'v'], description: 'Go to Voting Guide', action: '/guided-flow' },
  { keys: ['g', 'c'], description: 'Go to Candidates', action: '/candidates' },
  { keys: ['g', 't'], description: 'Go to Timeline', action: '/timeline' },
  { keys: ['g', 'b'], description: 'Go to Find Booth', action: '/polling-booth' },
  { keys: ['g', 's'], description: 'Go to Scenarios', action: '/scenarios' },
  { keys: ['?'], description: 'Show this help', action: 'help' },
  { keys: ['Esc'], description: 'Close dialog', action: 'close' },
];

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingKey, setPendingKey] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    const handleKeyDown = (e) => {
      // Don't trigger if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

      if (e.key === 'Escape') {
        setIsOpen(false);
        setPendingKey(null);
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        return;
      }

      if (pendingKey === 'g') {
        clearTimeout(timer);
        const route = {
          h: '/',
          v: '/guided-flow',
          c: '/candidates',
          t: '/timeline',
          b: '/polling-booth',
          s: '/scenarios',
        }[e.key];

        if (route) {
          navigate(route);
          setIsOpen(false);
        }
        setPendingKey(null);
        return;
      }

      if (e.key === 'g') {
        setPendingKey('g');
        timer = setTimeout(() => setPendingKey(null), 1000);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [pendingKey, navigate]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div
        onClick={() => setIsOpen(false)}
        className="animate-fade-in"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
        }}
      />

      <div className="glass-card animate-fade-in-up" style={{
        position: 'relative',
        width: '100%',
        maxWidth: 420,
        padding: '2rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Keyboard size={20} style={{ color: 'var(--color-primary-light)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close shortcuts"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'var(--color-surface-lighter)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-muted)',
            }}
          >
            <X size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {shortcuts.map((shortcut, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: i < shortcuts.length - 1 ? '1px solid var(--glass-border)' : 'none',
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {shortcut.description}
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                {shortcut.keys.map((key, j) => (
                  <span key={j}>
                    <kbd style={{
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-surface-lighter)',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      minWidth: 24,
                      textAlign: 'center',
                      display: 'inline-block',
                    }}>
                      {key}
                    </kbd>
                    {j < shortcut.keys.length - 1 && (
                      <span style={{ margin: '0 2px', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>+</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '1rem',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          textAlign: 'center',
        }}>
          Press <kbd style={{
            padding: '2px 6px',
            borderRadius: 4,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-lighter)',
            fontSize: '0.7rem',
            fontFamily: 'monospace',
          }}>?</kbd> to toggle this panel
        </div>
      </div>
    </div>
  );
}
