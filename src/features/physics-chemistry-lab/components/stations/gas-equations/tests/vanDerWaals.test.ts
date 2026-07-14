import { describe, it, expect } from 'vitest';
import { calculateVdwPressure } from '../services/vanDerWaals.service';

describe('Van der Waals Service', () => {
  const CO2_A = 3.640;
  const CO2_B = 0.04267;

  it('calculates pressure correctly for CO2', () => {
    // V = 5, T = 300, n = 1
    // nb = 0.04267. V-nb = 4.95733
    // Term1 = 1 * 0.08314 * 300 / 4.95733 = 5.0313
    // Term2 = 3.640 / 25 = 0.1456
    // P = 5.0313 - 0.1456 = 4.8857
    const res = calculateVdwPressure(5, 300, 1, CO2_A, CO2_B);
    expect(res.isValid).toBe(true);
    expect(res.value).toBeCloseTo(4.8857, 4);
  });

  it('returns invalid if volume is too small', () => {
    // V = 0.04 (less than nb)
    const res = calculateVdwPressure(0.04, 300, 1, CO2_A, CO2_B);
    expect(res.isValid).toBe(false);
  });
});
