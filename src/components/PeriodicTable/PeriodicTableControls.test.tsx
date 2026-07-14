import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ElementTile } from './ElementTile';
import { PeriodicTableToolbar } from './PeriodicTableToolbar';
import type { ElementType } from './periodicTableTypes';

const element: ElementType = {
  ab: 1400,
  ar: 53,
  bp: 20.28,
  cat: 'reactive-nonmetal',
  config: '1s1',
  crystal: 'Hexagonal',
  density: 0.00008988,
  descES: '',
  descFR: '',
  ea: 73,
  en: 2.2,
  historyES: '',
  historyFR: '',
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
  usesES: '',
  usesFR: '',
};

describe('periodic table controls', () => {
  it('renders an accessible element tile and handles selection', async () => {
    const onClick = vi.fn();
    render(
      <ElementTile
        categoryColor="#18b8c8"
        element={element}
        gridPosition={{ gridColumn: 1, gridRow: 1 }}
        isActive
        isFavorite
        isQuizMode={false}
        isSelected={false}
        name="Hydrogene"
        onBlur={vi.fn()}
        onClick={onClick}
        onFocus={vi.fn()}
        onMouseEnter={vi.fn()}
        onMouseLeave={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: /Hydrogene/ }));
    expect(onClick).toHaveBeenCalled();
    expect(screen.getByText('H')).toBeInTheDocument();
  });

  it('emits filter changes from the toolbar', async () => {
    const onFiltersChange = vi.fn();
    render(
      <PeriodicTableToolbar
        filters={{ category: 'all', query: '', state: 'all' }}
        language="fr"
        onFiltersChange={onFiltersChange}
        resultCount={118}
      />,
    );

    await userEvent.type(screen.getByLabelText('Recherche'), 'He');
    expect(onFiltersChange).toHaveBeenCalledWith({
      category: 'all',
      query: 'H',
      state: 'all',
    });
  });
});
