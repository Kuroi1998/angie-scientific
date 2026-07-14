export type ReactionType = 'A_TO_B' | 'A_B_TO_C' | 'A_B_TO_C_D';

export interface ReactionDefinition {
  id: string;
  name: string;
  type: ReactionType;
  description: string;
  
  // Thermodynamic parameters
  activationEnergyForward: number; // Ea_f in kJ/mol
  enthalpy: number; // ΔH in kJ/mol. (Ea_r = Ea_f - ΔH)
  preExponentialFactor: number; // A in Arrhenius equation
  
  // Colors for visualization
  colorA: string;
  colorB?: string;
  colorC?: string;
  colorD?: string;
}

export interface KineticsState {
  reactionId: string;
  temperature: number; // K
  
  // Concentrations
  concA: number; // mol/L
  concB: number;
  concC: number;
  concD: number;
  
  // Catalyst effect (reduces Ea by this amount, kJ/mol)
  catalystEaReduction: number; 

  // Simulation controls
  isPaused: boolean;
  simulationSpeed: number; // 0.1 to 5x
}

export interface KineticsResult {
  kf: number; // Forward rate constant
  kr: number; // Reverse rate constant
  vf: number; // Forward rate
  vr: number; // Reverse rate
  K: number;  // Equilibrium constant
  Q: number;  // Reaction quotient
  isAtEquilibrium: boolean;
}

export interface ConcentrationPoint {
  time: number;
  a: number;
  b: number;
  c: number;
  d: number;
}
