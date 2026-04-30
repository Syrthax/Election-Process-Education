import { Check } from 'lucide-react';

export default function ProgressTracker({ steps, currentStep }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const status = isCompleted ? 'completed' : isActive ? 'active' : '';

        return (
          <div key={step.id} className={`progress-step ${status}`}>
            <div className="step-number">
              {isCompleted ? <Check size={16} color="white" /> : step.id}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: 700,
                fontSize: '0.95rem',
                color: isActive ? 'var(--color-primary-light)' : isCompleted ? 'var(--color-success)' : 'var(--color-text)',
                marginBottom: '2px',
              }}>
                {step.title}
                {isActive && (
                  <span style={{
                    marginLeft: 8,
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: 100,
                    background: 'rgba(99, 102, 241, 0.2)',
                    color: 'var(--color-primary-light)',
                    fontWeight: 600,
                  }}>
                    YOU ARE HERE
                  </span>
                )}
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: 'var(--color-text-muted)',
              }}>
                {step.description}
              </div>
              {isActive && step.details && (
                <div style={{
                  marginTop: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}>
                  {step.details.map((detail, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                      fontSize: '0.85rem',
                      color: 'var(--color-text)',
                    }}>
                      <span style={{ color: 'var(--color-primary-light)', flexShrink: 0 }}>•</span>
                      {detail}
                    </div>
                  ))}
                  {step.action && (
                    <div style={{
                      marginTop: 8,
                      padding: '8px 14px',
                      background: 'rgba(99, 102, 241, 0.1)',
                      borderRadius: 8,
                      fontSize: '0.85rem',
                      color: 'var(--color-primary-light)',
                      fontWeight: 600,
                    }}>
                      → {step.action}
                    </div>
                  )}
                  {step.source && (
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-text-muted)',
                      fontStyle: 'italic',
                      marginTop: 4,
                    }}>
                      Source: {step.source}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
