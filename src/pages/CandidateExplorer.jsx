import { useState, useMemo } from 'react';
import { useApp } from '../context/useApp';
import candidateData from '../data/candidates.json';
import CandidateCard from '../components/CandidateCard';
import CandidateCompare from '../components/CandidateCompare';
import { useDebouncedValue } from '../components/useDebouncedValue';
import { Search, Filter } from 'lucide-react';

export default function CandidateExplorer() {
  const { state } = useApp();
  const [selectedState, setSelectedState] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, 200);

  const states = useMemo(() =>
    [...new Set(candidateData.constituencies.map(c => c.state))],
    []
  );

  const constituencies = useMemo(() =>
    candidateData.constituencies
      .filter(c => !selectedState || c.state === selectedState)
      .map(c => c.name),
    [selectedState]
  );

  const filteredConstituency = useMemo(() => {
    if (!selectedConstituency) return null;
    return candidateData.constituencies.find(
      c => c.name === selectedConstituency && (!selectedState || c.state === selectedState)
    );
  }, [selectedState, selectedConstituency]);

  const allCandidates = useMemo(() => {
    if (filteredConstituency) return filteredConstituency.candidates;
    if (selectedState) {
      return candidateData.constituencies
        .filter(c => c.state === selectedState)
        .flatMap(c => c.candidates);
    }
    return candidateData.constituencies.flatMap(c => c.candidates);
  }, [filteredConstituency, selectedState]);

  const displayCandidates = useMemo(() => {
    if (!debouncedSearch) return allCandidates;
    const q = debouncedSearch.toLowerCase();
    return allCandidates.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.party.toLowerCase().includes(q) ||
      c.partyAbbr.toLowerCase().includes(q)
    );
  }, [allCandidates, debouncedSearch]);

  return (
    <div className="animate-fade-in-up">
      <div className="page-header" style={{ paddingTop: '1.5rem' }}>
        <h1>
          <span className="gradient-text">Candidate</span> Explorer
        </h1>
        <p>Browse candidates by constituency. Compare them side-by-side using official affidavit data.</p>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'end',
        }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
              State
            </label>
            <select
              value={selectedState}
              onChange={e => { setSelectedState(e.target.value); setSelectedConstituency(''); }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid var(--glass-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              <option value="">All States</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
              Constituency
            </label>
            <select
              value={selectedConstituency}
              onChange={e => setSelectedConstituency(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid var(--glass-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              <option value="">All Constituencies</option>
              {constituencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
              Search
            </label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search candidates or parties..."
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: 8,
                  border: '1px solid var(--glass-border)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Compare panel */}
      {state.compareList.length >= 2 && (
        <CandidateCompare candidates={allCandidates} />
      )}

      {/* Compare hint */}
      {state.compareList.length === 1 && (
        <div className="glass-card animate-fade-in" style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: '0.85rem',
          color: 'var(--color-primary-light)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
        }}>
          <Filter size={16} />
          Select 1 more candidate to compare (max 3)
        </div>
      )}

      {/* Results count */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
      }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          {displayCandidates.length} candidate{displayCandidates.length !== 1 ? 's' : ''} found
        </span>
        {filteredConstituency && (
          <span className="badge badge-primary">
            {filteredConstituency.state} — {filteredConstituency.name}
          </span>
        )}
      </div>

      {/* Candidate Grid */}
      <div className="stagger-children" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1rem',
      }}>
        {displayCandidates.map(candidate => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>

      {displayCandidates.length === 0 && (
        <div className="glass-card" style={{
          padding: '3rem',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
        }}>
          <Search size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>No candidates found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
