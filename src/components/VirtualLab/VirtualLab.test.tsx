import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithLanguage } from '../../testUtils';
import { VirtualLab } from './VirtualLab';

afterEach(cleanup);

beforeEach(() => {
  window.localStorage.clear();
});

describe('VirtualLab', () => {
  it('mounts without crashing and shows the start button', () => {
    renderWithLanguage(<VirtualLab />);
    expect(screen.getByRole('button', { name: /LANCER|INICIAR/i })).toBeInTheDocument();
  });

  it('announces progress and completion via the aria-live status region, and persists completion', async () => {
    const user = userEvent.setup();
    renderWithLanguage(<VirtualLab />);

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('');

    await user.click(screen.getByRole('button', { name: /LANCER|INICIAR/i }));
    expect(status).toHaveTextContent(/en cours|en curso/i);

    await waitFor(() => expect(status).toHaveTextContent(/terminee|terminée|completado/i), { timeout: 3000 });

    await waitFor(() => {
      const stored = window.localStorage.getItem('angieScientific:v1:virtualLabCompletedExperiments');
      expect(stored).toContain('h2o');
    });
  });
});
