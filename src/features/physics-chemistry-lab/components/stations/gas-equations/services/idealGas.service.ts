import { R_L_BAR } from '../utils/gasUnitConversions';
import type { GasCalculationResult } from '../types/gas.types';

export function calculateIdealPressure(v: number, t: number, n: number): GasCalculationResult {
  if (v <= 0 || t < 0 || n < 0) return { value: 0, unit: 'bar', isFinite: false, isValid: false, errorReason: 'Paramètres physiques invalides.' };
  const p = (n * R_L_BAR * t) / v;
  return { value: p, unit: 'bar', isFinite: Number.isFinite(p), isValid: true };
}

export function calculateIdealVolume(p: number, t: number, n: number): GasCalculationResult {
  if (p <= 0 || t < 0 || n < 0) return { value: 0, unit: 'L', isFinite: false, isValid: false, errorReason: 'Paramètres physiques invalides.' };
  const v = (n * R_L_BAR * t) / p;
  return { value: v, unit: 'L', isFinite: Number.isFinite(v), isValid: true };
}

export function calculateIdealTemperature(p: number, v: number, n: number): GasCalculationResult {
  if (p <= 0 || v <= 0 || n <= 0) return { value: 0, unit: 'K', isFinite: false, isValid: false, errorReason: 'Paramètres physiques invalides.' };
  const t = (p * v) / (n * R_L_BAR);
  return { value: t, unit: 'K', isFinite: Number.isFinite(t), isValid: true };
}

export function calculateIdealMoles(p: number, v: number, t: number): GasCalculationResult {
  if (p <= 0 || v <= 0 || t <= 0) return { value: 0, unit: 'mol', isFinite: false, isValid: false, errorReason: 'Paramètres physiques invalides.' };
  const n = (p * v) / (R_L_BAR * t);
  return { value: n, unit: 'mol', isFinite: Number.isFinite(n), isValid: true };
}
