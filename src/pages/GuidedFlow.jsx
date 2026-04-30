import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProgressTracker from '../components/ProgressTracker';
import votingData from '../data/votingSteps.json';
import { UserCheck, UserPlus, Vote, ArrowRight } from 'lucide-react';

const stateOptions = [
  { key: 'not_registered', label: 'I am NOT registered to vote', icon: UserPlus, color: '#ef4444' },
  { key: 'registered', label: 'I am registered but haven\'t voted yet', icon: UserCheck, color: '#f59e0b' },
  { key: 'ready_to_vote', label: 'I am ready to vote', icon: Vote, color: '#10b981' },
];

export default function GuidedFlow() {
  const { state, dispatch } = useApp();
  const [selectedState, setSelectedState] = useState(state.userState);

  const handleSelect = (key) => {
    setSelectedState(key);
    dispatch({ type: 'SET_USER_STATE', payload: key });
  };

  const currentStep = selectedState ? votingData.states[selectedState]?.currentStep || 0 : null;

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
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{opt.label}</div>
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

      {/* Progress Tracker */}
      {selectedState && (
        <div className="animate-fade-in-up">
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}>
              <div>
                <span className="badge badge-success">{votingData.states[selectedState].label}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Step {currentStep + 1} of {votingData.steps.length}
              </div>
            </div>
            <ProgressTracker steps={votingData.steps} currentStep={currentStep} />
          </div>

          <div className="glass-card" style={{
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
          }}>
            <span style={{ fontSize: '1.2rem' }}>💡</span>
            <span>
              All information is sourced from the Election Commission of India. 
              For official queries, call the Voter Helpline at <strong style={{ color: 'var(--color-text)' }}>1950</strong>.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
