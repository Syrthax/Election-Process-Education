import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import NeutralityBanner from './NeutralityBanner';

export default function Layout() {
  return (
    <>
      <Navbar />
      <NeutralityBanner />
      <main style={{ flex: 1, padding: '0 1.5rem 3rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <Outlet />
      </main>
      <footer style={{
        padding: '2rem 1.5rem',
        textAlign: 'center',
        borderTop: '1px solid var(--glass-border)',
        color: 'var(--color-text-muted)',
        fontSize: '0.85rem',
      }}>
        <p>Built for PromptWars Hackathon • Data sourced from Election Commission of India</p>
        <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>
          This system is strictly neutral and does not endorse any candidate or party.
        </p>
      </footer>
    </>
  );
}
