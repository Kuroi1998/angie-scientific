import type { PhaseState, SubstanceParams } from '../types/phase.types';

// Returns the sublimation pressure at temperature T
export function getSublimationPressure(T: number, sub: SubstanceParams): number {
  if (T >= sub.tripleT) return Infinity; // Does not exist above triple point
  return sub.tripleP * Math.exp(sub.latentHeatSublimationOverR * (1 / sub.tripleT - 1 / T));
}

// Returns the vaporization pressure at temperature T
export function getVaporizationPressure(T: number, sub: SubstanceParams): number {
  if (T < sub.tripleT) return 0; // Does not exist below triple point
  if (T > sub.criticalT) return Infinity; // Supercritical fluid above
  return sub.tripleP * Math.exp(sub.latentHeatVaporizationOverR * (1 / sub.tripleT - 1 / T));
}

// Returns the melting pressure at temperature T
export function getFusionPressure(T: number, sub: SubstanceParams): number {
  // Approximate linear relationship for solid-liquid boundary
  if (sub.fusionSlope > 0 && T < sub.tripleT) return 0;
  if (sub.fusionSlope < 0 && T > sub.tripleT) return 0; 
  return sub.tripleP + sub.fusionSlope * (T - sub.tripleT);
}

// Determines the phase at given P and T
export function determinePhase(T: number, P: number, sub: SubstanceParams): PhaseState {
  if (T >= sub.criticalT && P >= sub.criticalP) return 'supercritical';

  if (T < sub.tripleT) {
    const P_sub = getSublimationPressure(T, sub);
    return P > P_sub ? 'solid' : 'gas';
  }

  const P_vap = getVaporizationPressure(T, sub);
  
  // For fusion, it's easier to check T against fusion temperature at pressure P
  const T_fusion = sub.tripleT + (P - sub.tripleP) / sub.fusionSlope;
  
  if (T < T_fusion) return 'solid';
  if (P > P_vap) return 'liquid';
  
  return 'gas';
}

export function phaseToFrenchLabel(phase: PhaseState): string {
  switch (phase) {
    case 'solid': return 'Solide';
    case 'liquid': return 'Liquide';
    case 'gas': return 'Gaz';
    case 'supercritical': return 'Supercritique';
  }
}
