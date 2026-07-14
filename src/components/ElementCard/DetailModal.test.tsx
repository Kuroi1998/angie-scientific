import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DetailModal } from './DetailModal';
import type { ElementType } from '../PeriodicTable/periodicTableTypes';

vi.mock('../../hooks/useLanguage', () => ({
  useLanguage: () => ({
    language: 'fr',
    t: (key: string) => ({
      'element.affinity': 'Affinite',
      'element.atomic': 'Atomique',
      'element.atomicRadius': 'Rayon atomique',
      'element.boilingPoint': 'Ebullition',
      'element.config': 'Configuration',
      'element.density': 'Densite',
      'element.discovery': 'Decouverte',
      'element.electronegativity': 'Electronegativite',
      'element.general': 'General',
      'element.history': 'Histoire',
      'element.ionization': 'Ionisation',
      'element.meltingPoint': 'Fusion',
      'element.quantum': 'Quantique',
      'element.state': 'Etat',
      'element.uses': 'Usages',
    }[key] ?? key),
  }),
}));

vi.mock('../useUserProgress', () => ({
  useUserProgress: () => ({
    profile: { learningLevel: 'discovery', mascotEnabled: false },
  }),
}));

vi.mock('../../features/angie/state/useAngie', () => ({
  useAngie: () => ({ showMessage: vi.fn() }),
}));

afterEach(() => cleanup());

const hydrogen: ElementType = {
  ab: 1400,
  ar: 53,
  bp: 20.28,
  cat: 'reactive-nonmetal',
  config: '1s1',
  crystal: 'Hexagonal',
  density: 0.00008988,
  descES: 'Gas ligero',
  descFR: 'Gaz leger et tres abondant.',
  ea: 73,
  en: 2.2,
  historyES: 'Descubierto en laboratorio.',
  historyFR: 'Identifie par Cavendish.',
  ie: 1312,
  ir: 25,
  mass: 1.008,
  mp: 14.01,
  n: 1,
  nameES: 'Hidrogeno',
  nameFR: 'Hydrogene',
  s: 'H',
  shells: [1],
  state: 'gas',
  usesES: 'Combustible',
  usesFR: 'Carburants et etoiles.',
};

describe('DetailModal', () => {
  it('renders an accessible element sheet and closes with Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<DetailModal element={hydrogen} onClose={onClose} />);

    expect(screen.getByRole('dialog', { name: /Hydrogene/ })).toBeInTheDocument();
    expect(screen.getByText('Gaz leger et tres abondant.')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('switches detail sections with design-system tabs', async () => {
    const user = userEvent.setup();
    render(<DetailModal element={hydrogen} onClose={vi.fn()} />);

    await user.click(screen.getByRole('tab', { name: 'Atomique' }));
    expect(screen.getByText('Configuration')).toBeInTheDocument();
    expect(screen.getByText('1s1')).toBeInTheDocument();
  });
});
