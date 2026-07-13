import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider, useLanguage } from './useLanguage';

afterEach(cleanup);
beforeEach(() => {
  window.localStorage.clear();
});

function LanguageProbe() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{language ?? 'none'}</span>
      <span data-testid="translated">{t('nav.table')}</span>
      <button onClick={() => setLanguage('es')}>ES</button>
      <button onClick={() => setLanguage('fr')}>FR</button>
    </div>
  );
}

describe('useLanguage / LanguageProvider', () => {
  it('defaults to no language selected when nothing is stored', () => {
    render(<LanguageProvider><LanguageProbe /></LanguageProvider>);
    expect(screen.getByTestId('lang')).toHaveTextContent('none');
  });

  it('switching language updates translations and persists across a fresh provider mount', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<LanguageProvider><LanguageProbe /></LanguageProvider>);

    await user.click(screen.getByRole('button', { name: 'ES' }));
    expect(screen.getByTestId('lang')).toHaveTextContent('es');
    unmount();

    render(<LanguageProvider><LanguageProbe /></LanguageProvider>);
    expect(screen.getByTestId('lang')).toHaveTextContent('es');
  });

  it('migrates the legacy "angie_sci_lang" key on first load', () => {
    window.localStorage.setItem('angie_sci_lang', 'es');
    render(<LanguageProvider><LanguageProbe /></LanguageProvider>);
    expect(screen.getByTestId('lang')).toHaveTextContent('es');
    expect(window.localStorage.getItem('angieScientific:v1:language')).toBe('"es"');
  });

  it('ignores a corrupted stored language and falls back to none', () => {
    window.localStorage.setItem('angieScientific:v1:language', '{"bad":"shape"}');
    render(<LanguageProvider><LanguageProbe /></LanguageProvider>);
    expect(screen.getByTestId('lang')).toHaveTextContent('none');
  });

  it('throws a clear error when useLanguage is used outside the provider', () => {
    function Bare() {
      useLanguage();
      return null;
    }
    expect(() => render(<Bare />)).toThrow(/useLanguage must be used within/);
  });
});
