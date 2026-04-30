import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('VoteWise Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '2rem',
          textAlign: 'center',
        }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: 'rgba(239, 68, 68, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}>
            <AlertTriangle size={36} style={{ color: 'var(--color-danger)' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Something went wrong
          </h2>
          <p style={{
            color: 'var(--color-text-muted)',
            maxWidth: 400,
            marginBottom: '1.5rem',
            fontSize: '0.95rem',
          }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            <RefreshCw size={18} />
            Refresh Page
          </button>
          {this.state.error && (
            <details style={{
              marginTop: '2rem',
              padding: '1rem',
              borderRadius: 'var(--radius)',
              background: 'var(--color-surface-light)',
              maxWidth: 500,
              width: '100%',
              textAlign: 'left',
            }}>
              <summary style={{ cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                Error details
              </summary>
              <pre style={{
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                color: 'var(--color-danger)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
