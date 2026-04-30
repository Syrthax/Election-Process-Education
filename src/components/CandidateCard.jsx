import { useApp } from '../context/AppContext';
import { User, Briefcase, GraduationCap, Scale, AlertTriangle, IndianRupee } from 'lucide-react';

export default function CandidateCard({ candidate, showCompare = true }) {
  const { state, dispatch } = useApp();
  const isComparing = state.compareList.includes(candidate.id);

  return (
    <div className="glass-card" style={{ padding: '1.5rem', position: 'relative' }}>
      {/* Party badge */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem',
      }}>
        <span className="badge badge-primary">{candidate.partyAbbr}</span>
        {showCompare && (
          <button
            onClick={() => dispatch({ type: 'TOGGLE_COMPARE', payload: candidate.id })}
            style={{
              padding: '4px 12px',
              borderRadius: 6,
              border: isComparing ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
              background: isComparing ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              color: isComparing ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {isComparing ? '✓ Comparing' : '+ Compare'}
          </button>
        )}
      </div>

      {/* Name */}
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>
        {candidate.name}
      </h3>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
        {candidate.party}
      </p>

      {/* Details grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.75rem',
      }}>
        <InfoItem icon={User} label="Age" value={`${candidate.age} years`} />
        <InfoItem icon={GraduationCap} label="Education" value={candidate.education} />
        <InfoItem icon={Briefcase} label="Profession" value={candidate.profession} />
        <InfoItem
          icon={AlertTriangle}
          label="Criminal Cases"
          value={candidate.criminalCases}
          highlight={candidate.criminalCases > 0}
        />
        <InfoItem icon={IndianRupee} label="Assets" value={candidate.totalAssets} />
        <InfoItem icon={Scale} label="Liabilities" value={candidate.totalLiabilities} />
      </div>

      {/* Source */}
      <div style={{
        marginTop: '1rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--glass-border)',
        fontSize: '0.7rem',
        color: 'var(--color-text-muted)',
        fontStyle: 'italic',
      }}>
        Source: Election Commission of India — Affidavit Data
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, highlight = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <Icon size={14} style={{
        color: highlight ? 'var(--color-warning)' : 'var(--color-text-muted)',
        marginTop: 2,
        flexShrink: 0,
      }} />
      <div>
        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </div>
        <div style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: highlight ? 'var(--color-warning)' : 'var(--color-text)',
        }}>
          {value}
        </div>
      </div>
    </div>
  );
}
