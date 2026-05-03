import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import NeutralityBanner from './NeutralityBanner';
import QueryGuard from './QueryGuard';
import PageTransition from './PageTransition';
import ScrollToTop from './ScrollEffects';
import BackToTop from './BackToTop';

export default function Layout() {
  const location = useLocation();

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <ScrollToTop />
      <Navbar />
      <NeutralityBanner />
      <main
        id="main-content"
        tabIndex={-1}
        style={{ flex: 1, padding: '0 1.5rem 3rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}
      >
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </main>
      <QueryGuard />
      <BackToTop />
      <footer style={{
        padding: '2rem 1.5rem',
        textAlign: 'center',
        borderTop: '1px solid var(--glass-border)',
        color: 'var(--color-text-muted)',
        fontSize: '0.85rem',
      }}>
        <p>Built for Google for Developers · PromptWars Virtual · Hack2Skill • Data sourced from Election Commission of India</p>
        <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>
          This system is strictly neutral and does not endorse any candidate or party.
        </p>
      </footer>
    </>
  );
}
