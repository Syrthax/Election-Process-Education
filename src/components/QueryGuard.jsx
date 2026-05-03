import { useState } from 'react';
import { Shield, X, MessageCircle, Send } from 'lucide-react';
import { checkNeutrality, sanitizeOutput } from '../utils/neutrality';
import { askFeatherless, isFeatherlessConfigured } from '../utils/featherless';

export default function QueryGuard() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isThinking) return;

    const guard = checkNeutrality(trimmed);
    const id = Date.now();

    if (guard.isAdvisory) {
      setHistory(prev => [...prev, {
        id,
        query: trimmed,
        isAdvisory: true,
        response: guard.response,
        source: 'guard',
      }]);
      setQuery('');
      return;
    }

    setQuery('');
    setIsThinking(true);
    setHistory(prev => [...prev, {
      id,
      query: trimmed,
      isAdvisory: false,
      response: '',
      source: 'pending',
    }]);

    let answer;
    let source = 'local';
    try {
      if (isFeatherlessConfigured()) {
        const llmHistory = history.slice(-6).flatMap(h => ([
          { role: 'user', content: h.query },
          { role: 'assistant', content: h.response },
        ]));
        answer = sanitizeOutput(await askFeatherless(trimmed, llmHistory));
        source = 'featherless';
      } else {
        answer = getInformationalResponse(trimmed);
      }
    } catch (err) {
      answer = getInformationalResponse(trimmed) +
        '\n\n(Note: live AI assistant is unavailable right now — showing a fallback answer.)';
      source = 'local';
    }

    setHistory(prev => prev.map(h => h.id === id ? { ...h, response: answer, source } : h));
    setIsThinking(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--gradient-primary)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          transform: isOpen ? 'rotate(90deg)' : 'none',
        }}
        aria-label="Ask a question"
      >
        {isOpen ? <X size={24} color="white" /> : <MessageCircle size={24} color="white" />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="animate-fade-in-up" style={{
          position: 'fixed',
          bottom: 96,
          right: 24,
          width: 380,
          maxWidth: 'calc(100vw - 48px)',
          maxHeight: '500px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--color-surface)',
          border: '1px solid var(--glass-border)',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5)',
        }}>
          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <Shield size={20} color="white" />
            <div>
              <div style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>Ask VoteWise</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>Neutral, fact-based answers only</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            minHeight: 200,
          }}>
            {/* Welcome message */}
            <div style={{
              padding: '10px 14px',
              borderRadius: '12px 12px 12px 4px',
              background: 'var(--color-surface-light)',
              fontSize: '0.85rem',
              color: 'var(--color-text-muted)',
              maxWidth: '90%',
            }}>
              👋 Hi! I'm VoteWise. Ask me anything about voting in India — what documents to carry, where to go, when polls open, how to register, EVM/VVPAT, accessibility, NRI voting, and more. I will not recommend candidates or parties.
              {isFeatherlessConfigured()
                ? ' (Powered by Featherless AI · Gemma)'
                : ' (Offline keyword mode — set VITE_FEATHERLESS_API_KEY to enable the live AI assistant.)'}
            </div>

            {history.map(entry => (
              <div key={entry.id}>
                {/* User message */}
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '12px 12px 4px 12px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  fontSize: '0.85rem',
                  color: 'var(--color-primary-light)',
                  maxWidth: '90%',
                  marginLeft: 'auto',
                  marginBottom: '0.5rem',
                }}>
                  {entry.query}
                </div>

                {/* Response */}
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '12px 12px 12px 4px',
                  background: entry.isAdvisory ? 'rgba(245, 158, 11, 0.1)' : 'var(--color-surface-light)',
                  border: entry.isAdvisory ? '1px solid rgba(245, 158, 11, 0.2)' : 'none',
                  fontSize: '0.85rem',
                  color: entry.isAdvisory ? 'var(--color-warning)' : 'var(--color-text-muted)',
                  maxWidth: '90%',
                }}>
                  {entry.isAdvisory && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginBottom: 6,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--color-warning)',
                    }}>
                      <Shield size={12} />
                      NEUTRALITY GUARD ACTIVATED
                    </div>
                  )}
                  {entry.response || (
                    <span style={{ opacity: 0.7, fontStyle: 'italic' }}>Thinking…</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} style={{
            padding: '0.75rem 1rem',
            borderTop: '1px solid var(--glass-border)',
            display: 'flex',
            gap: 8,
          }}>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              disabled={isThinking}
              placeholder={isThinking ? 'Waiting for answer…' : 'Ask about elections...'}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid var(--glass-border)',
                background: 'var(--color-surface-light)',
                color: 'var(--color-text)',
                fontSize: '0.85rem',
                fontFamily: 'inherit',
              }}
            />
            <button type="submit" disabled={isThinking} style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: 'var(--gradient-primary)',
              border: 'none',
              cursor: isThinking ? 'not-allowed' : 'pointer',
              opacity: isThinking ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Send size={16} color="white" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function getInformationalResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('register') || q.includes('registration')) {
    return 'You can register to vote online at voters.eci.gov.in by filling Form 6. You\'ll need proof of age and address. Processing takes 2-4 weeks. Visit the Voting Guide page for step-by-step instructions.';
  }
  if (q.includes('voter id') || q.includes('epic') || q.includes('voter card')) {
    return 'Your Voter ID (EPIC) is issued by the Election Commission after registration. You can download the e-EPIC digitally from voters.eci.gov.in. If lost, apply for a duplicate using Form 001.';
  }
  if (q.includes('polling') || q.includes('booth') || q.includes('station')) {
    return 'Find your assigned polling station at voters.eci.gov.in using your EPIC number. You can also use the Voter Helpline App or call 1950. Check our Find Booth page for map-based search.';
  }
  if (q.includes('eligible') || q.includes('age') || q.includes('qualify')) {
    return 'To vote in Indian elections, you must be an Indian citizen aged 18+ on January 1st of the qualifying year, and a resident of the constituency. Check the Scenario Assistant for detailed eligibility info.';
  }
  if (q.includes('evm') || q.includes('how to vote') || q.includes('voting process')) {
    return 'On election day: queue at your polling station, show your ID, get ink-marked, enter the booth, press the button next to your candidate on the EVM, verify on VVPAT (7 seconds), and exit. See the Voting Guide for full details.';
  }
  if (q.includes('nri') || q.includes('overseas') || q.includes('abroad')) {
    return 'NRIs can register using Form 6A at voters.eci.gov.in with their Indian passport. You must be physically present to vote — no postal ballot for NRIs in general elections yet. Check the Scenario Assistant for more.';
  }
  if (q.includes('candidate') || q.includes('compare')) {
    return 'Visit the Candidate Explorer page to browse candidates by state and constituency. You can compare up to 3 candidates side-by-side using official affidavit data from the Election Commission.';
  }
  if (q.includes('deadline') || q.includes('date') || q.includes('when')) {
    return 'Check the Timeline page for all election dates, phases, and deadlines. Registration deadlines are typically announced 2-3 months before elections.';
  }

  return 'I can help with: voter registration, finding your polling booth, understanding the voting process, eligibility checks, candidate information, and election deadlines. Try asking about any of these topics, or explore the pages above!';
}
