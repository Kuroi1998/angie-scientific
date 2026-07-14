export type GasKey = 'he' | 'n2' | 'co2' | 'o2' | 'ch4' | 'h2o' | 'ar';

export interface GasDefinition {
  key: GasKey;
  name: string;
  formula: string;
  molarMass: number; // g/mol
  family: string;
  color: string;
  // Van der Waals constants
  a: number; // L^2 bar / mol^2
  b: number; // L / mol
  criticalT?: number; // K
  criticalP?: number; // bar
  description: string;
}

export type GasVariable = 'pressure' | 'volume' | 'temperature' | 'moles';

export interface GasState {
  gasKey: GasKey;
  calculatedVariable: GasVariable;
  pressure: number; // bar
  volume: number; // L
  temperature: number; // K
  moles: number; // mol
  particlesMultiplier: number;
  simulationSpeed: number;
}

export interface GasCalculationResult {
  value: number;
  unit: string;
  isFinite: boolean;
  isValid: boolean;
  errorReason?: string;
}

export interface GasModelsComparison {
  idealGas: GasCalculationResult;
  vanDerWaals: GasCalculationResult;
  absoluteDivergence: number;
  relativeDivergence: number; // in percentage
  compressibilityFactorZ: number; // Z = P(vdw) * V / (nRT)
  divergenceLevel: 'none' | 'low' | 'moderate' | 'high' | 'critical';
}
