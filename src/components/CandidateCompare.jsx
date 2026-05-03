import { X } from 'lucide-react';
import { useApp } from '../context/useApp';
import ComparisonChart from './ComparisonChart';

export default function CandidateCompare({ candidates }) {
  const { state, dispatch } = useApp();

  const compareItems = state.compareList
    .map(id => candidates.find(c => c.id === id))
    .filter(Boolean);

  if (compareItems.length < 2) return null;

  const fields = [
    { key: 'party', label: 'Party' },
    { key: 'age', label: 'Age', format: v => `${v} years` },
    { key: 'education', label: 'Education' },
    { key: 'profession', label: 'Profession' },
    { key: 'criminalCases', label: 'Criminal Cases', format: v => v === 0 ? 'None' : `${v}` },
    { key: 'totalAssets', label: 'Total Assets' },
    { key: 'totalLiabilities', label: 'Liabilities' },
  ];

  return (
    <div className="glass-card animate-fade-in-up" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
          📊 Side-by-Side Comparison
        </h3>
        <button
          onClick={() => dispatch({ type: 'CLEAR_COMPARE' })}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
        >
          <X size={14} /> Clear
        </button>
      </div>

      <div style={{
        fontSize: '0.75rem',
        color: 'var(--color-info)',
        marginBottom: '1rem',
        padding: '8px 12px',
        background: 'rgba(59, 130, 246, 0.08)',
        borderRadius: 8,
      }}>
        ⚖️ This is a factual comparison only. No rankings or recommendations are implied.
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.85rem',
        }}>
          <thead>
            <tr>
              <th style={{
                textAlign: 'left',
                padding: '10px 12px',
                borderBottom: '1px solid var(--glass-border)',
                color: 'var(--color-text-muted)',
                fontWeight: 600,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Field
              </th>
              {compareItems.map(c => (
                <th key={c.id} style={{
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderBottom: '1px solid var(--glass-border)',
                  fontWeight: 700,
                  color: 'var(--color-primary-light)',
                }}>
                  {c.name}
                  <div style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--color-text-muted)', marginTop: 2 }}>
                    {c.partyAbbr}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map(field => (
              <tr key={field.key}>
                <td style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid var(--glass-border)',
                  color: 'var(--color-text-muted)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                }}>
                  {field.label}
                </td>
                {compareItems.map(c => (
                  <td key={c.id} style={{
                    padding: '10px 12px',
                    borderBottom: '1px solid var(--glass-border)',
                    color: 'var(--color-text)',
                  }}>
                    {field.format ? field.format(c[field.key]) : c[field.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visual Charts */}
      <ComparisonChart candidates={compareItems} />

      <div style={{
        marginTop: '1rem',
        fontSize: '0.7rem',
        color: 'var(--color-text-muted)',
        fontStyle: 'italic',
      }}>
        Source: Election Commission of India — Affidavit Data
      </div>
    </div>
  );
}
