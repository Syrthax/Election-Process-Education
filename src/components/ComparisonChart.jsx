// Pure CSS/SVG bar chart for candidate comparison; no external chart lib needed.
export default function ComparisonChart({ candidates }) {
  if (!candidates || candidates.length < 2) return null;

  const parseAmount = (str) => {
    if (!str) return 0;
    const num = str.replace(/[₹,\s]/g, '');
    if (num.includes('Cr')) return parseFloat(num) * 10000000;
    if (num.includes('L')) return parseFloat(num) * 100000;
    return parseFloat(num) || 0;
  };

  const colors = ['#6366f1', '#10b981', '#f59e0b'];

  const assetValues = candidates.map(c => parseAmount(c.totalAssets));
  const liabilityValues = candidates.map(c => parseAmount(c.totalLiabilities));
  const maxAsset = Math.max(...assetValues);
  const maxLiability = Math.max(...liabilityValues);

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h4 style={{
        fontSize: '0.9rem',
        fontWeight: 700,
        marginBottom: '1rem',
        color: 'var(--color-text)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        📊 Visual Comparison
      </h4>

      {/* Assets Chart */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.75rem',
        }}>
          Total Assets
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {candidates.map((c, i) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 100,
                fontSize: '0.8rem',
                fontWeight: 600,
                color: colors[i],
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flexShrink: 0,
              }}>
                {c.name.split(' ')[0]}
              </div>
              <div style={{
                flex: 1,
                height: 28,
                background: 'var(--color-surface)',
                borderRadius: 6,
                overflow: 'hidden',
                position: 'relative',
              }}>
                <div style={{
                  height: '100%',
                  width: `${maxAsset > 0 ? (assetValues[i] / maxAsset) * 100 : 0}%`,
                  background: `${colors[i]}33`,
                  borderRight: `3px solid ${colors[i]}`,
                  borderRadius: 6,
                  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 8,
                  minWidth: 'fit-content',
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: colors[i],
                    whiteSpace: 'nowrap',
                  }}>
                    {c.totalAssets}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Liabilities Chart */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.75rem',
        }}>
          Total Liabilities
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {candidates.map((c, i) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 100,
                fontSize: '0.8rem',
                fontWeight: 600,
                color: colors[i],
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flexShrink: 0,
              }}>
                {c.name.split(' ')[0]}
              </div>
              <div style={{
                flex: 1,
                height: 28,
                background: 'var(--color-surface)',
                borderRadius: 6,
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${maxLiability > 0 ? (liabilityValues[i] / maxLiability) * 100 : 0}%`,
                  background: `${colors[i]}22`,
                  borderRight: `3px solid ${colors[i]}66`,
                  borderRadius: 6,
                  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 8,
                  minWidth: 'fit-content',
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: `${colors[i]}cc`,
                    whiteSpace: 'nowrap',
                  }}>
                    {c.totalLiabilities}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Age comparison - dot plot */}
      <div>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.75rem',
        }}>
          Age
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}>
          {candidates.map((c, i) => (
            <div key={c.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 8,
              background: `${colors[i]}11`,
              border: `1px solid ${colors[i]}22`,
            }}>
              <div style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: colors[i],
              }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: colors[i] }}>
                {c.name.split(' ')[0]}
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)' }}>
                {c.age} yrs
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: '1rem',
        fontSize: '0.7rem',
        color: 'var(--color-text-muted)',
        fontStyle: 'italic',
      }}>
        Chart data from Election Commission of India — Affidavit filings
      </div>
    </div>
  );
}
