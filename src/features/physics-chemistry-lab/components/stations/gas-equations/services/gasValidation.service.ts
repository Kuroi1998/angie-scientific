import type { GasCalculationResult, GasModelsComparison } from '../types/gas.types';
import { R_L_BAR } from '../utils/gasUnitConversions';

export function calculateCompressibilityZ(p: number, v: number, n: number, t: number): number {
  if (n <= 0 || t <= 0) return 1;
  return (p * v) / (n * R_L_BAR * t);
}

export function compareGasModels(
  ideal: GasCalculationResult,
  vdw: GasCalculationResult,
  z: number
): GasModelsComparison {
  let absoluteDivergence = 0;
  let relativeDivergence = 0;
  let divergenceLevel: GasModelsComparison['divergenceLevel'] = 'none';

  if (ideal.isValid && vdw.isValid && ideal.value !== 0) {
    absoluteDivergence = Math.abs(ideal.value - vdw.value);
    relativeDivergence = (absoluteDivergence / Math.abs(ideal.value)) * 100;

    if (relativeDivergence < 0.5) {
      divergenceLevel = 'low';
    } else if (relativeDivergence < 2) {
      divergenceLevel = 'moderate';
    } else if (relativeDivergence < 5) {
      divergenceLevel = 'high';
    } else {
      divergenceLevel = 'critical';
    }
  }

  return {
    idealGas: ideal,
    vanDerWaals: vdw,
    absoluteDivergence,
    relativeDivergence,
    compressibilityFactorZ: z,
    divergenceLevel
  };
}
