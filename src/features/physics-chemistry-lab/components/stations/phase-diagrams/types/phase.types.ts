export type PhaseState = 'solid' | 'liquid' | 'gas' | 'supercritical';

export interface SubstanceParams {
  id: string;
  name: string;
  color: string; // Used for molecular visualization
  
  // Thermodynamic points
  tripleT: number; // K
  tripleP: number; // bar
  criticalT: number; // K
  criticalP: number; // bar
  
  // Display limits
  minT: number;
  maxT: number;
  minP: number; // For log scale, should be > 0
  maxP: number;
  
  // Clausius-Clapeyron parameters (simplified)
  // P = P_triple * exp( (L / R) * (1/T_triple - 1/T) )
  // We store the precomputed constant (L/R) for each transition
  latentHeatSublimationOverR: number; // (L_sub / R) in Kelvin
  latentHeatVaporizationOverR: number; // (L_vap / R) in Kelvin
  
  // Solid-Liquid boundary is often approximated linearly: P = P_triple + slope * (T - T_triple)
  // For water, slope is negative. For others, positive.
  fusionSlope: number; // bar/K
}
