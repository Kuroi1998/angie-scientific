import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import i18n from '../i18n';
import { LanguageProvider, useLanguage } from './useLanguage';

afterEach(cleanup);

beforeEach(async () => {
  window.localStorage.clear();
  await i18n.changeLanguage('fr');
});

function LanguageProbe() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <span data-testid="translated">{t('routes.table.label', { ns: 'navigation' })}</span>
      <button onClick={() => setLanguage('es')}>ES</button>
      <button onClick={() => setLanguage('fr')}>FR</button>
    </div>
  );
}

describe('useLanguage / LanguageProvider', () => {
  it('defaults to the French fallback language', () => {
    render(<LanguageProvider><LanguageProbe /></LanguageProvider>);
    expect(screen.getByTestId('lang')).toHaveTextContent('fr');
    expect(screen.getByTestId('translated')).toHaveTextContent(/Tableau/);
  });

  it('switching language updates translations and persists the selected language', async () => {
    const user = userEvent.setup();
    render(<LanguageProvider><LanguageProbe /></LanguageProvider>);

    await user.click(screen.getByRole('button', { name: 'ES' }));

    await waitFor(() => {
      expect(screen.getByTestId('lang')).toHaveTextContent('es');
      expect(screen.getByTestId('translated')).toHaveTextContent(/Tabla/);
    });
    expect(window.localStorage.getItem('language')).toBe('es');
  });

  it('can switch back to French', async () => {
    const user = userEvent.setup();
    await i18n.changeLanguage('es');
    render(<LanguageProvider><LanguageProbe /></LanguageProvider>);

    await user.click(screen.getByRole('button', { name: 'FR' }));

    await waitFor(() => {
      expect(screen.getByTestId('lang')).toHaveTextContent('fr');
      expect(screen.getByTestId('translated')).toHaveTextContent(/Tableau/);
    });
  });

  it('works without a custom provider because i18next is initialized globally', () => {
    function Bare() {
      const { language } = useLanguage();
      return <span data-testid="bare-lang">{language}</span>;
    }

    render(<Bare />);
    expect(screen.getByTestId('bare-lang')).toHaveTextContent('fr');
  });
});
