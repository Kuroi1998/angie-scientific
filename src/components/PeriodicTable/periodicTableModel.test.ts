import { describe, expect, it } from 'vitest';
import {
  getGridPosition,
  matchesElementFilters,
} from './periodicTableModel';
import type { ElementType } from './periodicTableTypes';

const hydrogen: ElementType = {
  ab: 1400,
  ar: 53,
  bp: 20.28,
  cat: 'reactive-nonmetal',
  config: '1s1',
  crystal: 'Hexagonal',
  density: 0.00008988,
  descES: 'Hidrogeno',
  descFR: 'Hydrogene',
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

describe('periodicTableModel', () => {
  it('places key element ranges in the periodic grid', () => {
    expect(getGridPosition(1)).toEqual({ gridRow: 1, gridColumn: 1 });
    expect(getGridPosition(2)).toEqual({ gridRow: 1, gridColumn: 18 });
    expect(getGridPosition(58)).toEqual({ gridRow: 9, gridColumn: 4 });
    expect(getGridPosition(118)).toEqual({ gridRow: 7, gridColumn: 18 });
  });

  it('matches search, category and physical state filters', () => {
    expect(matchesElementFilters(
      hydrogen,
      { category: 'all', query: 'H', state: 'all' },
      'fr',
    )).toBe(true);
    expect(matchesElementFilters(
      hydrogen,
      { category: 'noble-gas', query: '', state: 'all' },
      'fr',
    )).toBe(false);
    expect(matchesElementFilters(
      hydrogen,
      { category: 'all', query: '', state: 'solid' },
      'fr',
    )).toBe(false);
  });
});
