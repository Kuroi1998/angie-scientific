import { R_L_BAR } from '../utils/gasUnitConversions';
import type { GasCalculationResult } from '../types/gas.types';

// Formula: P = (nRT) / (V - nb) - (an^2) / V^2
export function calculateVdwPressure(v: number, t: number, n: number, a: number, b: number): GasCalculationResult {
  if (v <= 0 || t < 0 || n < 0) return { value: 0, unit: 'bar', isFinite: false, isValid: false, errorReason: 'Paramètres physiques invalides.' };
  
  const nb = n * b;
  if (v <= nb) {
    return {
      value: Infinity,
      unit: 'bar',
      isFinite: false,
      isValid: false,
      errorReason: `Volume trop faible. Le volume exclus (nb = ${nb.toFixed(3)} L) est supérieur ou égal au volume total.`
    };
  }

  const term1 = (n * R_L_BAR * t) / (v - nb);
  const term2 = (a * n * n) / (v * v);
  const p = term1 - term2;
  
  if (p < 0) {
    return {
      value: p,
      unit: 'bar',
      isFinite: true,
      isValid: false,
      errorReason: 'Pression négative non physique (attraction trop forte).'
    };
  }
  
  return { value: p, unit: 'bar', isFinite: Number.isFinite(p), isValid: true };
}

// Solving V for VdW is cubic, usually done via Newton-Raphson
// (P + an^2/V^2)(V - nb) = nRT
export function calculateVdwVolume(p: number, t: number, n: number, a: number, b: number): GasCalculationResult {
  if (p <= 0 || t < 0 || n < 0) return { value: 0, unit: 'L', isFinite: false, isValid: false, errorReason: 'Paramètres invalides.' };
  
  // Newton-Raphson method
  const idealV = (n * R_L_BAR * t) / p;
  let v = idealV;
  let maxIters = 100;
  
  while (maxIters-- > 0) {
    const f = (p + (a * n * n) / (v * v)) * (v - n * b) - n * R_L_BAR * t;
    const df = p - (a * n * n) / (v * v) + (2 * a * n * n * n * b) / (v * v * v);
    
    if (Math.abs(df) < 1e-10) break; // Avoid div by zero
    
    const nextV = v - f / df;
    if (Math.abs(nextV - v) < 1e-6) {
      v = nextV;
      break;
    }
    v = nextV;
  }
  
  if (v <= n * b || v < 0 || maxIters <= 0) {
    return { value: 0, unit: 'L', isFinite: false, isValid: false, errorReason: 'Impossible de calculer un volume réel positif (convergence échouée).' };
  }
  
  return { value: v, unit: 'L', isFinite: true, isValid: true };
}

export function calculateVdwTemperature(p: number, v: number, n: number, a: number, b: number): GasCalculationResult {
  if (p <= 0 || v <= 0 || n <= 0) return { value: 0, unit: 'K', isFinite: false, isValid: false, errorReason: 'Paramètres invalides.' };
  
  const nb = n * b;
  if (v <= nb) {
    return { value: 0, unit: 'K', isFinite: false, isValid: false, errorReason: 'Volume trop faible par rapport à nb.' };
  }
  
  const t = ((p + (a * n * n) / (v * v)) * (v - nb)) / (n * R_L_BAR);
  return { value: t, unit: 'K', isFinite: Number.isFinite(t), isValid: true };
}
