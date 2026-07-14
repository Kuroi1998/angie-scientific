import { describe, it, expect } from 'vitest';
import { determinePhase, getVaporizationPressure } from '../services/phaseCalculator.service';
import { substancesDatabase } from '../data/substancesDatabase';

describe('Phase Calculator Service', () => {
  const water = substancesDatabase.water;

  it('calculates vaporization pressure correctly for water at 100°C (373.15K)', () => {
    // Should be close to 1 atm (1.013 bar)
    const pVap = getVaporizationPressure(373.15, water);
    // Since we use simplified Clausius-Clapeyron, it won't be exactly 1.013, but should be close.
    // L_vap/R = 4889, T_triple = 273.16, P_triple = 0.006
    expect(pVap).toBeGreaterThan(0.5);
    expect(pVap).toBeLessThan(2.0);
  });

  it('determines phase correctly for water', () => {
    // 298.15 K, 1 atm -> Liquid
    expect(determinePhase(298.15, 1.013, water)).toBe('liquid');
    
    // 298.15 K, 0.001 atm -> Gas
    expect(determinePhase(298.15, 0.001, water)).toBe('gas');
    
    // 250 K, 1 atm -> Solid
    expect(determinePhase(250.0, 1.013, water)).toBe('solid');
    
    // Supercritical
    expect(determinePhase(700, 300, water)).toBe('supercritical');
  });

  it('handles sublimation for iodine correctly', () => {
    const iodine = substancesDatabase.iodine;
    // At standard temp 298.15K, 1atm -> Solid
    expect(determinePhase(298.15, 1.013, iodine)).toBe('solid');
    
    // At very low pressure, it should be gas
    expect(determinePhase(298.15, 0.0001, iodine)).toBe('gas');
  });
});
