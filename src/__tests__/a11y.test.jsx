import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { MemoryRouter } from 'react-router-dom';
import { I18nProvider } from '../i18n/I18nContext';
import { AppProvider } from '../context/AppContext';
import Dashboard from '../pages/Dashboard';
import PollingBooth from '../pages/PollingBooth';
import QueryGuard from '../components/QueryGuard';
import CandidateCard from '../components/CandidateCard';

function withProviders(ui) {
  return (
    <MemoryRouter>
      <I18nProvider>
        <AppProvider>{ui}</AppProvider>
      </I18nProvider>
    </MemoryRouter>
  );
}

const SAMPLE_CANDIDATE = {
  id: 'c-1',
  name: 'Test Candidate',
  party: 'Independent',
  partyAbbr: 'IND',
  age: 45,
  education: 'B.A.',
  profession: 'Social Worker',
  criminalCases: 0,
  totalAssets: '₹2.5 Cr',
  totalLiabilities: '₹10 L',
};

// Rules disabled: jsdom does not compute the same colour contrast as a real
// browser, and the color-contrast rule is unreliable here. We verify it
// manually + via Lighthouse in CI.
const AXE_OPTIONS = {
  rules: { 'color-contrast': { enabled: false } },
};

describe('Accessibility (vitest-axe)', () => {
  it('Dashboard has no axe violations', async () => {
    const { container } = render(withProviders(<Dashboard />));
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });

  it('PollingBooth has no axe violations on initial render', async () => {
    const { container } = render(withProviders(<PollingBooth />));
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });

  it('QueryGuard floating button has no axe violations', async () => {
    const { container } = render(withProviders(<QueryGuard />));
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });

  it('CandidateCard has no axe violations', async () => {
    const { container } = render(withProviders(<CandidateCard candidate={SAMPLE_CANDIDATE} />));
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });
});
