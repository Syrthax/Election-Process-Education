import { Shield } from 'lucide-react';

export default function NeutralityBanner() {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '1rem auto 0',
      padding: '0 1.5rem',
    }}>
      <div className="neutrality-banner">
        <Shield size={16} style={{ flexShrink: 0 }} />
        <span>
          <strong>Neutrality Guarantee:</strong> This system provides only factual, verifiable information. 
          It does not recommend, rank, or express opinions about any candidate or party.
        </span>
      </div>
    </div>
  );
}
