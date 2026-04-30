import { useApp } from '../context/AppContext';
import timelineData from '../data/timeline.json';
import ChecklistItem from '../components/ChecklistItem';
import { Calendar, CheckCircle2, Clock, AlertCircle, Flag } from 'lucide-react';

const typeConfig = {
  milestone: { icon: Flag, color: '#6366f1', label: 'Milestone' },
  deadline: { icon: AlertCircle, color: '#ef4444', label: 'Deadline' },
  voting: { icon: CheckCircle2, color: '#10b981', label: 'Voting Day' },
};

export default function Timeline() {
  const { state, dispatch } = useApp();

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  const completedCount = Object.values(state.checklist).filter(Boolean).length;
  const totalChecklist = timelineData.checklist.length;
  const progress = totalChecklist > 0 ? Math.round((completedCount / totalChecklist) * 100) : 0;

  return (
    <div className="animate-fade-in-up">
      <div className="page-header" style={{ paddingTop: '1.5rem' }}>
        <h1>
          <span className="gradient-text">Election</span> Timeline & Checklist
        </h1>
        <p>Track election milestones and prepare with your personal checklist.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '1.5rem',
        alignItems: 'start',
      }}>
        {/* Timeline */}
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={20} style={{ color: 'var(--color-primary-light)' }} />
            {timelineData.electionName} Timeline
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {timelineData.events.map((event, index) => {
              const config = typeConfig[event.type] || typeConfig.milestone;
              const Icon = config.icon;

              return (
                <div key={event.id} style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '12px',
                  borderRadius: 'var(--radius)',
                  transition: 'all 0.2s ease',
                  opacity: event.completed ? 0.7 : 1,
                }}>
                  {/* Timeline line */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0,
                  }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: event.completed ? `${config.color}33` : `${config.color}22`,
                      border: `2px solid ${config.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={14} color={config.color} />
                    </div>
                    {index < timelineData.events.length - 1 && (
                      <div style={{
                        width: 2,
                        flex: 1,
                        minHeight: 20,
                        background: 'var(--color-surface-lighter)',
                      }} />
                    )}
                  </div>

                  <div style={{ flex: 1, paddingBottom: 8 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 2,
                    }}>
                      <span style={{
                        fontSize: '0.7rem',
                        color: config.color,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>
                        {formatDate(event.date)}
                      </span>
                      {event.completed && (
                        <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                          Completed
                        </span>
                      )}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 2 }}>{event.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{event.description}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: '0.75rem',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            fontStyle: 'italic',
          }}>
            Source: Election Commission of India
          </div>
        </div>

        {/* Checklist */}
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={20} style={{ color: 'var(--color-success)' }} />
            Your Preparation Checklist
          </h2>

          {/* Progress */}
          <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Progress</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {completedCount}/{totalChecklist}
              </span>
            </div>
            <div style={{
              height: 8,
              borderRadius: 4,
              background: 'var(--color-surface-lighter)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: progress === 100 ? 'var(--color-success)' : 'var(--gradient-primary)',
                borderRadius: 4,
                transition: 'width 0.5s ease',
              }} />
            </div>
            {progress === 100 && (
              <div style={{
                marginTop: 8,
                fontSize: '0.85rem',
                color: 'var(--color-success)',
                fontWeight: 600,
              }}>
                ✅ You're fully prepared!
              </div>
            )}
          </div>

          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {timelineData.checklist.map(item => (
              <ChecklistItem
                key={item.id}
                item={item}
                checked={!!state.checklist[item.id]}
                onToggle={() => dispatch({ type: 'TOGGLE_CHECKLIST', payload: item.id })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
