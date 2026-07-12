import { describe, it, expect } from 'vitest';
import { predictReaction } from './chemistryEngine';
import { evaluateWavefunction } from './quantumPhysics';

describe('Chemistry Engine Tests', () => {
  it('should balance H and O fusion reaction', () => {
    const rx = predictReaction('H', 'O');
    expect(rx).not.toBeNull();
    if (rx) {
      expect(rx.products[0].symbol).toBe('H2O');
      expect(rx.dH).toBeLessThan(0); // Exothermic
      expect(rx.stable).toBe(true);  // Spontaneous
    }
  });

  it('should balance Na and Cl reaction', () => {
    const rx = predictReaction('Na', 'Cl');
    expect(rx).not.toBeNull();
    if (rx) {
      expect(rx.products[0].symbol).toBe('NaCl');
      expect(rx.dH).toBeLessThan(0);
      expect(rx.stable).toBe(true);
    }
  });

  it('should dynamically predict Mg and Cl reaction using ionic valences', () => {
    const rx = predictReaction('Mg', 'Cl');
    expect(rx).not.toBeNull();
    if (rx) {
      expect(rx.products[0].symbol).toBe('MgCl2');
      expect(rx.stable).toBe(true);
    }
  });
});

describe('Quantum Physics Wavefunction Tests', () => {
  it('should calculate 1s orbital values as positive and decaying', () => {
    const psi0 = evaluateWavefunction(1, 0, 0, 0, 0); // r = 0
    const psi1 = evaluateWavefunction(1, 0, 0, 10, 0); // r = 10
    const psi2 = evaluateWavefunction(1, 0, 0, 40, 0); // r = 40

    expect(psi0).toBeGreaterThan(0);
    expect(psi0).toBeGreaterThan(psi1);
    expect(psi1).toBeGreaterThan(psi2);
  });

  it('should calculate 2pz orbital with phase signs on opposite lobes', () => {
    const psiTop = evaluateWavefunction(2, 1, 0, 0, 10);  // positive lobe (y > 0)
    const psiBottom = evaluateWavefunction(2, 1, 0, 0, -10); // negative lobe (y < 0)

    expect(psiTop).toBeGreaterThan(0);
    expect(psiBottom).toBeLessThan(0);
    expect(Math.abs(psiTop - (-psiBottom))).toBeLessThan(0.001); // symmetric amplitudes
  });
});
