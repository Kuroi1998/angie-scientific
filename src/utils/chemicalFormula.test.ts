import { describe, it, expect } from 'vitest';
import { tokenizeFormula, buildEquationTokens } from './chemicalFormula';

describe('tokenizeFormula', () => {
  it('tokenizes a simple diatomic formula', () => {
    expect(tokenizeFormula('O2')).toEqual([
      { kind: 'symbol', value: 'O' },
      { kind: 'subscript', value: '2' },
    ]);
  });

  it('tokenizes water', () => {
    expect(tokenizeFormula('H2O')).toEqual([
      { kind: 'symbol', value: 'H' },
      { kind: 'subscript', value: '2' },
      { kind: 'symbol', value: 'O' },
    ]);
  });

  it('tokenizes carbon dioxide', () => {
    expect(tokenizeFormula('CO2')).toEqual([
      { kind: 'symbol', value: 'C' },
      { kind: 'symbol', value: 'O' },
      { kind: 'subscript', value: '2' },
    ]);
  });

  it('tokenizes sulfuric acid', () => {
    expect(tokenizeFormula('H2SO4')).toEqual([
      { kind: 'symbol', value: 'H' },
      { kind: 'subscript', value: '2' },
      { kind: 'symbol', value: 'S' },
      { kind: 'symbol', value: 'O' },
      { kind: 'subscript', value: '4' },
    ]);
  });

  it('tokenizes formulas with parentheses', () => {
    expect(tokenizeFormula('Ca(OH)2')).toEqual([
      { kind: 'symbol', value: 'Ca' },
      { kind: 'paren', value: '(' },
      { kind: 'symbol', value: 'O' },
      { kind: 'symbol', value: 'H' },
      { kind: 'paren', value: ')' },
      { kind: 'subscript', value: '2' },
    ]);
  });

  it('tokenizes a formula with a trailing simple ionic charge', () => {
    expect(tokenizeFormula('Na+')).toEqual([
      { kind: 'symbol', value: 'Na' },
      { kind: 'charge', value: '+' },
    ]);
    expect(tokenizeFormula('Cl-')).toEqual([
      { kind: 'symbol', value: 'Cl' },
      { kind: 'charge', value: '-' },
    ]);
  });

  it('tokenizes a formula with a magnitude ionic charge', () => {
    expect(tokenizeFormula('SO4^2-')).toEqual([
      { kind: 'symbol', value: 'S' },
      { kind: 'symbol', value: 'O' },
      { kind: 'subscript', value: '4' },
      { kind: 'charge', value: '2-' },
    ]);
  });

  it('returns an empty array for an empty string', () => {
    expect(tokenizeFormula('')).toEqual([]);
  });
});

describe('buildEquationTokens', () => {
  it('builds a full equation with coefficients, operator and arrow', () => {
    const tokens = buildEquationTokens(
      [{ coefficient: 2, formula: 'H2' }, { coefficient: 1, formula: 'O2' }],
      [{ coefficient: 2, formula: 'H2O' }]
    );

    expect(tokens).toEqual([
      { kind: 'coefficient', value: '2' },
      { kind: 'symbol', value: 'H' },
      { kind: 'subscript', value: '2' },
      { kind: 'operator', value: '+' },
      { kind: 'symbol', value: 'O' },
      { kind: 'subscript', value: '2' },
      { kind: 'arrow' },
      { kind: 'coefficient', value: '2' },
      { kind: 'symbol', value: 'H' },
      { kind: 'subscript', value: '2' },
      { kind: 'symbol', value: 'O' },
    ]);
  });

  it('omits a coefficient of 1', () => {
    const tokens = buildEquationTokens(
      [{ coefficient: 1, formula: 'Na' }],
      [{ coefficient: 1, formula: 'NaCl' }]
    );
    expect(tokens.some(t => t.kind === 'coefficient')).toBe(false);
  });

  it('supports multiple products separated by an operator', () => {
    const tokens = buildEquationTokens(
      [{ coefficient: 2, formula: 'Na' }, { coefficient: 2, formula: 'H2O' }],
      [{ coefficient: 2, formula: 'NaOH' }, { coefficient: 1, formula: 'H2' }]
    );
    const operatorCount = tokens.filter(t => t.kind === 'operator').length;
    expect(operatorCount).toBe(2); // one between reactants, one between products
  });

  it('supports a physical state suffix', () => {
    const tokens = buildEquationTokens(
      [{ coefficient: 1, formula: 'H2O', state: '(l)' }],
      [{ coefficient: 1, formula: 'H2O', state: '(g)' }]
    );
    expect(tokens).toContainEqual({ kind: 'state', value: '(l)' });
    expect(tokens).toContainEqual({ kind: 'state', value: '(g)' });
  });
});
