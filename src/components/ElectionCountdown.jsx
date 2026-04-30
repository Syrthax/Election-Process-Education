import { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

// Next Indian General Election phase date (configurable)
const ELECTION_DATE = new Date('2026-05-15T07:00:00+05:30');

export default function ElectionCountdown() {
  const { t } = useI18n();
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function getTimeLeft() {
    const now = new Date();
    const diff = ELECTION_DATE - now;
    if (diff <= 0) return null;

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  if (!timeLeft) {
    return (
      <div className="glass-card" style={{
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
      }}>
        <Zap size={20} style={{ color: 'var(--color-success)' }} />
        <span style={{ fontWeight: 700, color: 'var(--color-success)' }}>
          {t('countdown.passed')}
        </span>
      </div>
    );
  }

  const units = [
    { value: timeLeft.days, label: t('countdown.days') },
    { value: timeLeft.hours, label: t('countdown.hours') },
    { value: timeLeft.minutes, label: t('countdown.minutes') },
    { value: timeLeft.seconds, label: t('countdown.seconds') },
  ];

  return (
    <div className="glass-card" style={{
      padding: '1.25rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      flexWrap: 'wrap',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
      }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: 'rgba(99, 102, 241, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Clock size={18} style={{ color: 'var(--color-primary-light)' }} />
        </div>
        <span style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--color-text-muted)',
        }}>
          {t('countdown.title')}
        </span>
      </div>

      <div style={{
        display: 'flex',
        gap: 8,
        marginLeft: 'auto',
      }}>
        {units.map((unit, i) => (
          <div key={i} style={{
            textAlign: 'center',
            minWidth: 52,
          }}>
            <div style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color: 'var(--color-text)',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
              padding: '8px 10px',
              borderRadius: 8,
              background: 'var(--color-surface)',
              border: '1px solid var(--glass-border)',
            }}>
              {String(unit.value).padStart(2, '0')}
            </div>
            <div style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              marginTop: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
