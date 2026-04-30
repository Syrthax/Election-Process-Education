import { useState } from 'react';
import scenarioData from '../data/scenarios.json';
import { MapPin, CreditCard, UserCheck, Globe, AlertTriangle, Accessibility, ArrowRight, ChevronDown, ChevronUp, Info, AlertCircle, CheckCircle, ExternalLink, Phone } from 'lucide-react';

const iconMap = {
  MapPin, CreditCard, UserCheck, Globe, AlertTriangle, Accessibility,
};

const stepTypeConfig = {
  action: { icon: ArrowRight, color: '#818cf8', bg: 'rgba(99, 102, 241, 0.08)', border: 'rgba(99, 102, 241, 0.12)' },
  info: { icon: Info, color: '#60a5fa', bg: 'rgba(59, 130, 246, 0.08)', border: 'rgba(59, 130, 246, 0.12)' },
  warning: { icon: AlertCircle, color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.12)' },
  success: { icon: CheckCircle, color: '#34d399', bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.12)' },
};

const scenarioColors = [
  { gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', glow: 'rgba(99, 102, 241, 0.15)' },
  { gradient: 'linear-gradient(135deg, #f59e0b, #f97316)', glow: 'rgba(245, 158, 11, 0.15)' },
  { gradient: 'linear-gradient(135deg, #10b981, #059669)', glow: 'rgba(16, 185, 129, 0.15)' },
  { gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', glow: 'rgba(59, 130, 246, 0.15)' },
  { gradient: 'linear-gradient(135deg, #ef4444, #dc2626)', glow: 'rgba(239, 68, 68, 0.15)' },
  { gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', glow: 'rgba(139, 92, 246, 0.15)' },
];

export default function ScenarioAssistant() {
  const [expandedId, setExpandedId] = useState(null);

  const toggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="page-header" style={{ paddingTop: '1.5rem' }}>
        <h1>
          <span className="gradient-text">Scenario</span> Assistant
        </h1>
        <p>Select your situation below to get step-by-step guidance from official sources.</p>
      </div>

      {/* Quick help bar */}
      <div className="glass-card" style={{
        padding: '1rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem' }}>
          <Phone size={18} style={{ color: 'var(--color-success)' }} />
          <span style={{ color: 'var(--color-text-muted)' }}>
            Need immediate help? Call Voter Helpline: 
          </span>
          <strong style={{ color: 'var(--color-text)', fontSize: '1.1rem' }}>1950</strong>
        </div>
        <a
          href="https://voters.eci.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.8rem' }}
        >
          <ExternalLink size={14} />
          voters.eci.gov.in
        </a>
      </div>

      <div className="stagger-children" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}>
        {scenarioData.scenarios.map((scenario, index) => {
          const Icon = iconMap[scenario.icon] || AlertTriangle;
          const isExpanded = expandedId === scenario.id;
          const colors = scenarioColors[index % scenarioColors.length];

          return (
            <div key={scenario.id} className="glass-card" style={{
              overflow: 'hidden',
              border: isExpanded ? '1px solid rgba(99, 102, 241, 0.3)' : undefined,
              boxShadow: isExpanded ? `0 4px 24px ${colors.glow}` : undefined,
            }}>
              <button
                onClick={() => toggle(scenario.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '1.25rem 1.5rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'inherit',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: colors.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 4px 12px ${colors.glow}`,
                }}>
                  <Icon size={22} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 2 }}>
                    {scenario.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {scenario.description}
                  </div>
                </div>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: isExpanded ? 'rgba(99, 102, 241, 0.1)' : 'var(--color-surface-lighter)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}>
                  {isExpanded ? (
                    <ChevronUp size={18} style={{ color: 'var(--color-primary-light)' }} />
                  ) : (
                    <ChevronDown size={18} style={{ color: 'var(--color-text-muted)' }} />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="animate-fade-in" style={{
                  padding: '0 1.5rem 1.5rem',
                  borderTop: '1px solid var(--glass-border)',
                }}>
                  {/* Step counter */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '1rem 0 0.75rem',
                    fontSize: '0.8rem',
                    color: 'var(--color-text-muted)',
                    fontWeight: 600,
                  }}>
                    {scenario.steps.length} steps to resolve
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}>
                    {scenario.steps.map((step, i) => {
                      const config = stepTypeConfig[step.type] || stepTypeConfig.info;
                      const StepIcon = config.icon;

                      return (
                        <div key={i} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 12,
                          padding: '12px 16px',
                          borderRadius: 10,
                          background: config.bg,
                          border: `1px solid ${config.border}`,
                          transition: 'all 0.2s ease',
                        }}>
                          <div style={{
                            width: 24,
                            height: 24,
                            borderRadius: 6,
                            background: `${config.color}22`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: 1,
                          }}>
                            <StepIcon size={13} style={{ color: config.color }} />
                          </div>
                          <span style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
                            {step.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{
                    marginTop: '1rem',
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: 'var(--color-surface-light)',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    fontStyle: 'italic',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    <Info size={12} style={{ flexShrink: 0 }} />
                    Source: {scenario.source}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
