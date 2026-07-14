import { describe, it, expect } from 'vitest';
import { calculateKinetics, R } from '../services/kineticsCalculator.service';
import type { KineticsState } from '../types/kinetics.types';

describe('Kinetics Calculator Service', () => {
  const mockState: KineticsState = {
    reactionId: 'isomerization', // A -> B, Ea=40, dH=-15, A=1e5
    temperature: 300,
    concA: 2.0,
    concB: 1.0,
    concC: 0.0,
    concD: 0.0,
    catalystEaReduction: 0,
    isPaused: false,
    simulationSpeed: 1
  };

  it('calculates forward and reverse rates correctly', () => {
    const res = calculateKinetics(mockState);
    
    const RT = R * 300;
    const expectedKf = 1e5 * Math.exp(-40000 / RT);
    const expectedKr = 1e5 * Math.exp(-55000 / RT); // 40 - (-15) = 55
    
    expect(res.kf).toBeCloseTo(expectedKf, 5);
    expect(res.kr).toBeCloseTo(expectedKr, 5);
    
    expect(res.vf).toBeCloseTo(expectedKf * 2.0, 5);
    expect(res.vr).toBeCloseTo(expectedKr * 1.0, 5);
  });

  it('calculates Q correctly', () => {
    const res = calculateKinetics(mockState);
    // For A -> B, Q = [B]/[A]
    expect(res.Q).toBe(0.5);
  });

  it('applies catalyst reduction correctly', () => {
    const catalyzedState = { ...mockState, catalystEaReduction: 10 }; // 10 kJ/mol reduction
    const res = calculateKinetics(catalyzedState);
    
    const RT = R * 300;
    const expectedKf = 1e5 * Math.exp(-30000 / RT); // 40 - 10
    const expectedKr = 1e5 * Math.exp(-45000 / RT); // 55 - 10
    
    expect(res.kf).toBeCloseTo(expectedKf, 5);
    expect(res.kr).toBeCloseTo(expectedKr, 5);
  });
});
