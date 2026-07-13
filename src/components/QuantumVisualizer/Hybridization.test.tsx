import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithLanguage } from '../../testUtils';
import { Hybridization } from './Hybridization';

afterEach(cleanup);

describe('Hybridization', () => {
  it('mounts without crashing (regression test for the addColorStop(var(--...)) crash)', () => {
    renderWithLanguage(<Hybridization />);
    expect(screen.getByRole('button', { name: 'SP2' })).toBeInTheDocument();
  });

  it('switches between sp, sp2 and sp3 without crashing', async () => {
    const user = userEvent.setup();
    renderWithLanguage(<Hybridization />);

    await user.click(screen.getByRole('button', { name: 'SP' }));
    expect(screen.getByText('180°')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'SP3' }));
    expect(screen.getByText('109.5°')).toBeInTheDocument();
  });

  it('canvas exposes an accessible label reflecting the active hybridization', () => {
    const { container } = renderWithLanguage(<Hybridization />);
    const canvas = container.querySelector('canvas');
    expect(canvas?.getAttribute('role')).toBe('img');
    expect(canvas?.getAttribute('aria-label')).toBeTruthy();
  });
});
