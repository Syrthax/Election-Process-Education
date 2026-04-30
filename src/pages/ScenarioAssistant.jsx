import { useState } from 'react';
import scenarioData from '../data/scenarios.json';
import { MapPin, CreditCard, UserCheck, Globe, AlertTriangle, Accessibility, ArrowRight, ChevronDown, ChevronUp, Info, AlertCircle, CheckCircle } from 'lucide-react';

const iconMap = {
  MapPin, CreditCard, UserCheck, Globe, AlertTriangle, Accessibility,
};

const stepTypeConfig = {
  action: { icon: ArrowRight, color: 'var(--color-primary-light)', bg: 'rgba(99, 102, 241, 0.08)' },
  info: { icon: Info, color: 'var(--color-info)', bg: 'rgba(59, 130, 246, 0.08)' },
  warning: { icon: AlertCircle, color: 'var(--color-warning)', bg: 'rgba(245, 158, 11, 0.08)' },
  success: { icon: CheckCircle, color: 'var(--color-success)', bg: 'rgba(16, 185, 129, 0.08)' },
};

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
        <p>Common voting situations and step-by-step solutions.</p>
      </div>

      <div className="stagger-children" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}>
        {scenarioData.scenarios.map(scenario => {
          const Icon = iconMap[scenario.icon] || AlertTriangle;
          const isExpanded = expandedId === scenario.id;

          return (
            <div key={scenario.id} className="glass-card" style={{
              overflow: 'hidden',
              border: isExpanded ? '1px solid rgba(99, 102, 241, 0.3)' : undefined,
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
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'rgba(99, 102, 241, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={22} style={{ color: 'var(--color-primary-light)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 2 }}>
                    {scenario.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {scenario.description}
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp size={20} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                ) : (
                  <ChevronDown size={20} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                )}
              </button>

              {isExpanded && (
                <div className="animate-fade-in" style={{
                  padding: '0 1.5rem 1.5rem',
                  borderTop: '1px solid var(--glass-border)',
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    marginTop: '1rem',
                  }}>
                    {scenario.steps.map((step, i) => {
                      const config = stepTypeConfig[step.type] || stepTypeConfig.info;
                      const StepIcon = config.icon;

                      return (
                        <div key={i} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 12,
                          padding: '10px 14px',
                          borderRadius: 8,
                          background: config.bg,
                        }}>
                          <StepIcon size={16} style={{ color: config.color, flexShrink: 0, marginTop: 2 }} />
                          <span style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
                            {step.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{
                    marginTop: '1rem',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    fontStyle: 'italic',
                  }}>
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
