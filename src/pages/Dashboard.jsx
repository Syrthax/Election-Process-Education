import { Link } from 'react-router-dom';
import { ListChecks, Users, Calendar, MapPin, HelpCircle, ArrowRight, Vote, Shield, BarChart3 } from 'lucide-react';

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
  { label: 'Common Scenarios', value: '6', icon: HelpCircle },
];

export default function Dashboard() {
  return (
    <div className="animate-fade-in-up">
      {/* Hero */}
      <section style={{
        textAlign: 'center',
        padding: '3rem 0 2rem',
      }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: 'var(--gradient-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
        }}>
          <Vote size={36} color="white" />
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          marginBottom: '1rem',
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
        }}>
          A structured, neutral civic guidance system that helps you navigate 
          the election process — from registration to casting your vote.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
        margin: '1rem 0 3rem',
      }}>
        {stats.map(stat => (
          <div key={stat.label} className="glass-card" style={{
            padding: '1.25rem 2rem',
            textAlign: 'center',
            minWidth: '160px',
          }}>
            <stat.icon size={20} style={{ color: 'var(--color-primary-light)', marginBottom: 8 }} />
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)' }}>{stat.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Features Grid */}
      <section>
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
                width: 44,
                height: 44,
                borderRadius: 12,
                background: feature.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                <feature.icon size={22} color="white" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {feature.title}
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', flex: 1 }}>
                {feature.description}
              </p>
              <div style={{
                marginTop: '1rem',
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

      {/* Trust Section */}
      <section className="glass-card" style={{
        margin: '3rem 0 0',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <Shield size={32} style={{ color: 'var(--color-info)', marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Built on Neutrality & Trust
        </h3>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
          Every piece of information in this system is sourced from the Election Commission of India 
          and official government data. We never recommend, rank, or express opinions about candidates 
          or political parties.
        </p>
        <div style={{
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          marginTop: '1.5rem',
          flexWrap: 'wrap',
        }}>
          {['Factual Data Only', 'No Recommendations', 'ECI Sourced', 'Open & Transparent'].map(tag => (
            <span key={tag} className="badge badge-primary" style={{ fontSize: '0.8rem' }}>{tag}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
