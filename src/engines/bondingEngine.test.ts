import { describe, it, expect } from 'vitest';
import { predictVsepr, getBondDetails } from './bondingEngine';

describe('Bonding Engine Tests', () => {
  it('should resolve CO2 (C with 2 Oxygen ligands) as Linear with sp hybridization', () => {
    const res = predictVsepr('C', 'O', 2);
    expect(res.stericNumber).toBe(2);
    expect(res.lonePairs).toBe(0);
    expect(res.geometryFR).toBe('Linéaire');
    expect(res.hybridization).toBe('sp');
    expect(res.bondAngle).toBe('180°');
  });

  it('should resolve H2O (O with 2 Hydrogen ligands) as Bent with sp3 hybridization', () => {
    const res = predictVsepr('O', 'H', 2);
    expect(res.stericNumber).toBe(4);
    expect(res.lonePairs).toBe(2);
    expect(res.geometryFR).toBe('Coudée');
    expect(res.hybridization).toBe('sp³');
    expect(res.bondAngle).toBe('104.5°');
  });

  it('should resolve CH4 (C with 4 Hydrogen ligands) as Tetrahedral with sp3 hybridization', () => {
    const res = predictVsepr('C', 'H', 4);
    expect(res.stericNumber).toBe(4);
    expect(res.lonePairs).toBe(0);
    expect(res.geometryFR).toBe('Tétraédrique');
    expect(res.hybridization).toBe('sp³');
    expect(res.bondAngle).toBe('109.5°');
  });

  it('should identify Na-Cl as Ionic bond with high electronegativity difference', () => {
    const res = getBondDetails('Na', 'Cl');
    expect(res.typeFR).toBe('Ionique');
    expect(res.polarityDiff).toBeGreaterThanOrEqual(1.7);
    expect(res.energy).toBeGreaterThan(300);
  });

  it('should identify H-O as Polar Covalent bond', () => {
    const res = getBondDetails('H', 'O');
    expect(res.typeFR).toBe('Covalente Polaire');
    expect(res.polarityDiff).toBeLessThan(1.7);
    expect(res.polarityDiff).toBeGreaterThanOrEqual(0.4);
  });
});
