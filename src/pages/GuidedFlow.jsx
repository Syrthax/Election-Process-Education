import { useState } from 'react';
import { useApp } from '../context/useApp';
import votingData from '../data/votingSteps.json';
import { UserCheck, UserPlus, Vote, ArrowRight, ArrowLeft, ChevronRight, ExternalLink } from 'lucide-react';

const stateOptions = [
  { key: 'not_registered', label: 'I am NOT registered to vote', icon: UserPlus, color: '#ef4444', description: 'Start from the beginning' },
  { key: 'registered', label: 'I am registered but haven\'t voted yet', icon: UserCheck, color: '#f59e0b', description: 'Jump to preparation steps' },
  { key: 'ready_to_vote', label: 'I am ready to vote', icon: Vote, color: '#10b981', description: 'See election day guide' },
];

export default function GuidedFlow() {
  const { state, dispatch } = useApp();
  const [selectedState, setSelectedState] = useState(state.userState);
  const [activeStep, setActiveStep] = useState(null);

  const handleSelect = (key) => {
    setSelectedState(key);
    dispatch({ type: 'SET_USER_STATE', payload: key });
    setActiveStep(votingData.states[key]?.currentStep || 0);
  };

  const currentStep = activeStep !== null ? activeStep : (selectedState ? votingData.states[selectedState]?.currentStep || 0 : null);
  const currentStepData = currentStep !== null ? votingData.steps[currentStep] : null;

  const canGoBack = currentStep > 0;
  const canGoForward = currentStep < votingData.steps.length - 1;

  return (
    <div className="animate-fade-in-up">
      <div className="page-header" style={{ paddingTop: '1.5rem' }}>
        <h1>
          <span className="gradient-text">Step-by-Step</span> Voting Guide
        </h1>
        <p>Tell us where you are in the process, and we'll guide you through the rest.</p>
      </div>

      {/* State Selection */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {stateOptions.map(opt => (
          <button
            key={opt.key}
            onClick={() => handleSelect(opt.key)}
            className="glass-card"
            style={{
              padding: '1.5rem',
              cursor: 'pointer',
              border: selectedState === opt.key
                ? `2px solid ${opt.color}`
                : '1px solid var(--glass-border)',
              background: selectedState === opt.key
                ? `${opt.color}11`
                : 'var(--glass-bg)',
              textAlign: 'left',
              color: 'inherit',
              fontFamily: 'inherit',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `${opt.color}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem',
            }}>
              <opt.icon size={20} color={opt.color} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{opt.label}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{opt.description}</div>
            {selectedState === opt.key && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 8,
                fontSize: '0.8rem',
                color: opt.color,
                fontWeight: 600,
              }}>
                Selected <ArrowRight size={14} />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Progress Tracker + Detail View */}
      {selectedState && (
        <div className="animate-fade-in-up" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1fr) 2fr',
          gap: '1.5rem',
          alignItems: 'start',
        }}>
          {/* Left: Step list */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}>
              <span className="badge badge-success">{votingData.states[selectedState].label}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {currentStep + 1}/{votingData.steps.length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {votingData.steps.map((step, index) => {
                const isCompleted = index < (votingData.states[selectedState]?.currentStep || 0);
                const isActive = index === currentStep;

                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(index)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: 'none',
                      background: isActive
                        ? 'rgba(99, 102, 241, 0.1)'
                        : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: 'inherit',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s ease',
                      width: '100%',
                    }}
                  >
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: isCompleted
                        ? 'var(--color-success)'
                        : isActive
                          ? 'var(--color-primary)'
                          : 'var(--color-surface-lighter)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      flexShrink: 0,
                      color: 'white',
                    }}>
                      {isCompleted ? '✓' : step.id}
                    </div>
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive
                        ? 'var(--color-primary-light)'
                        : isCompleted
                          ? 'var(--color-text-muted)'
                          : 'var(--color-text)',
                      textDecoration: isCompleted ? 'line-through' : 'none',
                    }}>
                      {step.title}
                    </span>
                    {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto', color: 'var(--color-primary-light)' }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Step detail */}
          <div>
            {currentStepData && (
              <div className="glass-card animate-fade-in" key={currentStep} style={{ padding: '2rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: '1.5rem',
                }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: 'var(--gradient-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    color: 'white',
                  }}>
                    {currentStepData.id}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 2, letterSpacing: '-0.02em' }}>
                      {currentStepData.title}
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                      {currentStepData.description}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  marginBottom: '1.5rem',
                }}>
                  {currentStepData.details.map((detail, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: '12px 16px',
                      borderRadius: 10,
                      background: 'rgba(99, 102, 241, 0.05)',
                      border: '1px solid rgba(99, 102, 241, 0.08)',
                    }}>
                      <div style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background: 'rgba(99, 102, 241, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: 'var(--color-primary-light)',
                        flexShrink: 0,
                      }}>
                        {i + 1}
                      </div>
                      <span style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action */}
                {currentStepData.action && (
                  <div style={{
                    padding: '14px 18px',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.15)',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: '1rem',
                  }}>
                    <ExternalLink size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-success)', fontWeight: 600 }}>
                      {currentStepData.action}
                    </span>
                  </div>
                )}

                {/* Source */}
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                  fontStyle: 'italic',
                  marginBottom: '1.5rem',
                }}>
                  Source: {currentStepData.source}
                </div>

                {/* Navigation */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--glass-border)',
                }}>
                  <button
                    onClick={() => canGoBack && setActiveStep(currentStep - 1)}
                    disabled={!canGoBack}
                    className="btn-secondary"
                    style={{
                      opacity: canGoBack ? 1 : 0.3,
                      padding: '10px 20px',
                      fontSize: '0.85rem',
                    }}
                  >
                    <ArrowLeft size={16} />
                    Previous
                  </button>
                  <button
                    onClick={() => canGoForward && setActiveStep(currentStep + 1)}
                    disabled={!canGoForward}
                    className="btn-primary"
                    style={{
                      opacity: canGoForward ? 1 : 0.3,
                      padding: '10px 20px',
                      fontSize: '0.85rem',
                    }}
                  >
                    Next Step
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Info callout */}
            <div className="glass-card" style={{
              padding: '1rem 1.25rem',
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: '0.85rem',
              color: 'var(--color-text-muted)',
            }}>
              <span style={{ fontSize: '1.2rem' }}>💡</span>
              <span>
                All information sourced from the Election Commission of India. 
                For official queries, call Voter Helpline: <strong style={{ color: 'var(--color-text)' }}>1950</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Responsive override for small screens */}
      <style>{`
        @media (max-width: 768px) {
          .animate-fade-in-up > div[style*="grid-template-columns: minmax"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
