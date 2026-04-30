import { Check, Square } from 'lucide-react';

export default function ChecklistItem({ item, checked, onToggle }) {
  const priorityColors = {
    high: 'var(--color-danger)',
    medium: 'var(--color-warning)',
    low: 'var(--color-text-muted)',
  };

  return (
    <button
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        padding: '14px 16px',
        background: checked ? 'rgba(16, 185, 129, 0.06)' : 'transparent',
        border: '1px solid',
        borderColor: checked ? 'rgba(16, 185, 129, 0.2)' : 'var(--glass-border)',
        borderRadius: 'var(--radius)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s ease',
        color: 'inherit',
        fontFamily: 'inherit',
      }}
    >
      <div style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        border: checked ? 'none' : '2px solid var(--color-surface-lighter)',
        background: checked ? 'var(--color-success)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.2s ease',
      }}>
        {checked && <Check size={14} color="white" />}
      </div>
      <span style={{
        flex: 1,
        fontSize: '0.9rem',
        fontWeight: 500,
        textDecoration: checked ? 'line-through' : 'none',
        color: checked ? 'var(--color-text-muted)' : 'var(--color-text)',
        transition: 'all 0.2s ease',
      }}>
        {item.text}
      </span>
      <span style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: priorityColors[item.priority] || priorityColors.low,
        flexShrink: 0,
      }} title={`${item.priority} priority`} />
      {item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-primary-light)',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Link →
        </a>
      )}
    </button>
  );
}
