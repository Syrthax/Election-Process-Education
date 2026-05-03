import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { I18nProvider } from '../I18nContext';
import { useI18n } from '../useI18n';

function Probe({ k, vars }) {
  const { language, t, switchLanguage } = useI18n();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <span data-testid="text">{t(k, vars)}</span>
      <button onClick={() => switchLanguage('hi')}>switch hi</button>
      <button onClick={() => switchLanguage('en')}>switch en</button>
    </div>
  );
}

describe('I18nProvider', () => {
  beforeEach(() => {
    try { window.localStorage.removeItem('votewise-lang'); } catch { /* ignore */ }
  });

  it('returns the translated string for the active language', () => {
    render(
      <I18nProvider>
        <Probe k="nav.findBooth" />
      </I18nProvider>
    );
    expect(screen.getByTestId('lang')).toHaveTextContent('en');
    expect(screen.getByTestId('text')).toHaveTextContent('Find Booth');
  });

  it('falls back to English when key missing in target language', () => {
    render(
      <I18nProvider>
        <Probe k="nav.findBooth" />
      </I18nProvider>
    );
    act(() => {
      screen.getByText('switch hi').click();
    });
    expect(screen.getByTestId('lang')).toHaveTextContent('hi');
  });

  it('returns the key itself when no translation exists', () => {
    render(
      <I18nProvider>
        <Probe k="nonsense.unknown.key" />
      </I18nProvider>
    );
    expect(screen.getByTestId('text')).toHaveTextContent('nonsense.unknown.key');
  });

  it('persists language to localStorage', () => {
    render(
      <I18nProvider>
        <Probe k="nav.findBooth" />
      </I18nProvider>
    );
    act(() => screen.getByText('switch hi').click());
    expect(window.localStorage.getItem('votewise-lang')).toBe('hi');
  });
});

describe('useI18n outside provider', () => {
  it('throws a clear error', () => {
    const orig = console.error;
    console.error = () => {};
    expect(() => render(<Probe k="nav.findBooth" />)).toThrow(/within I18nProvider/);
    console.error = orig;
  });
});
