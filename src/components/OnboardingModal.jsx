import { useState, useEffect } from 'react';
import { Vote, ListChecks, Users, Shield, ArrowRight, X, Sparkles } from 'lucide-react';

const slides = [
  {
    icon: Vote,
    title: 'Welcome to VoteWise',
    description: 'Your structured, neutral guide to Indian elections. We help you navigate every step — from registration to casting your vote.',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  },
  {
    icon: ListChecks,
    title: 'Step-by-Step Guidance',
    description: 'Tell us where you are in the voting process. We\'ll show you exactly what to do next with clear, sourced instructions.',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
  },
  {
    icon: Users,
    title: 'Compare Candidates',
    description: 'Browse candidates by constituency and compare them side-by-side using official affidavit data. Facts only — no opinions.',
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
  },
  {
    icon: Shield,
    title: 'Strictly Neutral',
    description: 'We never recommend, rank, or express opinions about any candidate or party. All data comes from the Election Commission of India.',
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  },
];

export default function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('votewise-onboarded');
    if (!hasSeenOnboarding) {
      // Small delay for smoother appearance
      const timer = setTimeout(() => setIsOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('votewise-onboarded', 'true');
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleClose();
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isOpen) return null;

  const slide = slides[currentSlide];
  const Icon = slide.icon;
  const isLast = currentSlide === slides.length - 1;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      {/* Backdrop */}
      <div
        onClick={handleSkip}
        className="animate-fade-in"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      />

      {/* Modal */}
      <div className="animate-fade-in-up" style={{
        position: 'relative',
        width: '100%',
        maxWidth: 460,
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        background: 'var(--color-surface)',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
      }}>
        {/* Close button */}
        <button
          onClick={handleSkip}
          aria-label="Close onboarding"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1,
          }}
        >
          <X size={16} />
        </button>

        {/* Header with gradient */}
        <div style={{
          padding: '3rem 2rem 2rem',
          background: slide.gradient,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background decoration */}
          <div style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: -20,
            left: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
          }} />

          <div style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            position: 'relative',
          }}>
            <Icon size={36} color="white" />
          </div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'white',
            marginBottom: '0.5rem',
            position: 'relative',
          }}>
            {slide.title}
          </h2>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem 2rem 2rem' }}>
          <p style={{
            color: 'var(--color-text-muted)',
            fontSize: '0.95rem',
            lineHeight: 1.7,
            textAlign: 'center',
            marginBottom: '2rem',
          }}>
            {slide.description}
          </p>

          {/* Progress dots */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginBottom: '1.5rem',
          }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: i === currentSlide ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === currentSlide ? 'var(--color-primary)' : 'var(--color-surface-lighter)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'space-between',
          }}>
            <button
              onClick={handleSkip}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 500,
                padding: '10px 0',
              }}
            >
              Skip
            </button>
            <button onClick={handleNext} className="btn-primary" style={{ flex: 1, maxWidth: 200, justifyContent: 'center' }}>
              {isLast ? (
                <>
                  <Sparkles size={16} />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
