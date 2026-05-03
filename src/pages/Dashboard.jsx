import { Link } from 'react-router-dom';
import { ListChecks, Users, Calendar, MapPin, HelpCircle, ArrowRight, Vote, Shield, BarChart3, Sparkles, CheckCircle } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';

const features = [
  {
    to: '/guided-flow',
    icon: ListChecks,
    title: 'Voting Guide',
    description: 'Step-by-step guidance from registration to casting your vote',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  },
  {
    to: '/candidates',
    icon: Users,
    title: 'Candidate Explorer',
    description: 'Browse and compare candidates with official affidavit data',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },
  {
    to: '/timeline',
    icon: Calendar,
    title: 'Timeline & Checklist',
    description: 'Election deadlines and your personal preparation checklist',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
  },
  {
    to: '/polling-booth',
    icon: MapPin,
    title: 'Find Polling Booth',
    description: 'Locate your nearest polling station with directions',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  },
  {
    to: '/scenarios',
    icon: HelpCircle,
    title: 'Scenario Help',
    description: 'Lost voter ID? Moved cities? Get step-by-step solutions',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  },
];

const stats = [
  { label: 'States Covered', value: '6', icon: MapPin },
  { label: 'Constituencies', value: '6', icon: BarChart3 },
  { label: 'Candidates', value: '19', icon: Users },
  { label: 'Scenarios', value: '6', icon: HelpCircle },
];

const principles = [
  { icon: Shield, text: 'Factual Data Only', description: 'All data from Election Commission' },
  { icon: CheckCircle, text: 'No Recommendations', description: 'We never suggest candidates' },
  { icon: Sparkles, text: 'Open & Transparent', description: 'Sources cited everywhere' },
];

export default function Dashboard() {
  return (
    <div>
      {/* Hero */}
      <section style={{
        textAlign: 'center',
        padding: '3rem 0 2rem',
        position: 'relative',
      }}>
        {/* Background glow effect */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          width: 80,
          height: 80,
          borderRadius: 22,
          background: 'var(--gradient-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
          position: 'relative',
        }}>
          <Vote size={40} color="white" />
          {/* Animated ring */}
          <div style={{
            position: 'absolute',
            inset: -4,
            borderRadius: 26,
            border: '2px solid rgba(99, 102, 241, 0.3)',
            animation: 'pulse-glow 3s ease-in-out infinite',
          }} />
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.25rem)',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          marginBottom: '1rem',
          position: 'relative',
        }}>
          <span className="gradient-text">Your Guide to</span>
          <br />
          <span style={{ color: 'var(--color-text)' }}>Indian Elections</span>
        </h1>
        <p style={{
          color: 'var(--color-text-muted)',
          fontSize: '1.1rem',
          maxWidth: '600px',
          margin: '0 auto 2rem',
          lineHeight: 1.7,
          position: 'relative',
        }}>
          A structured, neutral civic guidance system that helps you navigate 
          the election process — from registration to casting your vote.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
          <Link to="/guided-flow" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
            <ListChecks size={20} />
            Start Voting Guide
          </Link>
          <Link to="/candidates" className="btn-secondary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
            <Users size={20} />
            Explore Candidates
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '1rem',
        margin: '1rem 0 3rem',
      }}>
        {stats.map(stat => (
          <div key={stat.label} className="glass-card" style={{
            padding: '1.25rem 1.5rem',
            textAlign: 'center',
          }}>
            <stat.icon size={20} style={{ color: 'var(--color-primary-light)', marginBottom: 8 }} />
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)' }}>
              <AnimatedCounter target={stat.value} duration={1200} />
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Features Grid */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          marginBottom: '1.5rem',
          textAlign: 'center',
          letterSpacing: '-0.02em',
        }}>
          What would you like to do?
        </h2>
        <div className="stagger-children" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
        }}>
          {features.map(feature => (
            <Link
              key={feature.to}
              to={feature.to}
              className="glass-card"
              style={{
                padding: '1.5rem',
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: feature.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: `0 4px 12px ${feature.color}33`,
              }}>
                <feature.icon size={24} color="white" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {feature.title}
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', flex: 1, lineHeight: 1.5 }}>
                {feature.description}
              </p>
              <div style={{
                marginTop: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: feature.color,
                fontSize: '0.85rem',
                fontWeight: 600,
              }}>
                Explore <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Principles Section */}
      <section className="glass-card" style={{
        padding: '2.5rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background accent */}
        <div style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: 'rgba(59, 130, 246, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
        }}>
          <Shield size={28} style={{ color: 'var(--color-info)' }} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Built on Neutrality & Trust
        </h3>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '550px', margin: '0 auto 2rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Every piece of information is sourced from the Election Commission of India 
          and official government data.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          position: 'relative',
        }}>
          {principles.map(p => (
            <div key={p.text} style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius)',
              background: 'rgba(99, 102, 241, 0.04)',
              border: '1px solid rgba(99, 102, 241, 0.08)',
            }}>
              <p.icon size={24} style={{ color: 'var(--color-primary-light)', marginBottom: 10 }} />
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{p.text}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{p.description}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
