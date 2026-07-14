import { describe, it, expect } from 'vitest';
import { calculateIdealPressure, calculateIdealVolume, calculateIdealTemperature } from '../services/idealGas.service';

describe('Ideal Gas Service', () => {
  it('calculates pressure correctly', () => {
    // V = 5, T = 300, n = 1 -> P = (1 * 0.08314 * 300) / 5 = 4.9884
    const res = calculateIdealPressure(5, 300, 1);
    expect(res.isValid).toBe(true);
    expect(res.value).toBeCloseTo(4.9884, 4);
  });

  it('calculates volume correctly', () => {
    // P = 5, T = 300, n = 1 -> V = (1 * 0.08314 * 300) / 5 = 4.9884
    const res = calculateIdealVolume(5, 300, 1);
    expect(res.isValid).toBe(true);
    expect(res.value).toBeCloseTo(4.9884, 4);
  });

  it('calculates temperature correctly', () => {
    // P = 5, V = 5, n = 1 -> T = 25 / 0.08314 = 300.6976
    const res = calculateIdealTemperature(5, 5, 1);
    expect(res.isValid).toBe(true);
    expect(res.value).toBeCloseTo(300.6976, 4);
  });

  it('returns invalid on negative volume', () => {
    const res = calculateIdealPressure(-5, 300, 1);
    expect(res.isValid).toBe(false);
  });
});
