import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { LanguageProvider } from '../../hooks/useLanguage';
import { FusionCore } from './FusionCore';

afterEach(cleanup);

function renderFusionCore() {
  function Wrapper() {
    const [r1, setR1] = React.useState<string | null>(null);
    const [r2, setR2] = React.useState<string | null>(null);
    return (
      <FusionCore
        selectedReactant1={r1}
        selectedReactant2={r2}
        setSelectedReactant1={setR1}
        setSelectedReactant2={setR2}
      />
    );
  }
  return render(
    <LanguageProvider>
      <Wrapper />
    </LanguageProvider>
  );
}

describe('FusionCore', () => {
  it('renders the H + O -> H2O equation as safe JSX with real <sub> subscripts (no dangerouslySetInnerHTML)', async () => {
    const user = userEvent.setup();
    const { container } = renderFusionCore();

    await user.click(screen.getByRole('button', { name: 'H' }));
    await user.click(screen.getByRole('button', { name: 'O' }));

    // No raw HTML injection anywhere in this subtree.
    expect(container.querySelector('[dangerouslySetInnerHTML]')).toBeNull();

    const subs = container.querySelectorAll('sub');
    expect(subs.length).toBeGreaterThan(0);
    expect(screen.getByText('Eau / Agua (H₂O)')).toBeInTheDocument();
  });

  it('renders the Na + H2O special-case cascade equation correctly', async () => {
    const user = userEvent.setup();
    const { container } = renderFusionCore();

    await user.click(screen.getByRole('button', { name: 'Na' }));
    const input = screen.getByPlaceholderText(/Fe, Au, Pb/i);
    await user.type(input, 'H2O{Enter}');

    const subs = container.querySelectorAll('sub');
    expect(subs.length).toBeGreaterThan(0);
  });

  it('clearing a reactant slot resets the displayed reaction', async () => {
    const user = userEvent.setup();
    renderFusionCore();

    await user.click(screen.getByRole('button', { name: 'H' }));
    await user.click(screen.getByRole('button', { name: 'O' }));
    expect(screen.getByText('Eau / Agua (H₂O)')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /1: H/i }));
    expect(screen.queryByText('Eau / Agua (H₂O)')).not.toBeInTheDocument();
  });
});
