import type { KineticsState, KineticsResult } from '../types/kinetics.types';
import { reactionDatabase } from '../data/reactionDatabase';

export const R = 8.314; // J/(mol.K)

export function calculateKinetics(state: KineticsState): KineticsResult {
  const reaction = reactionDatabase[state.reactionId];
  if (!reaction) throw new Error('Reaction not found');

  const { concA, concB, concC, concD, temperature, catalystEaReduction } = state;

  // Activation energies (convert kJ/mol to J/mol)
  const eaForward = Math.max(1, reaction.activationEnergyForward - catalystEaReduction) * 1000;
  // Ea_reverse = Ea_forward - ΔH
  const eaReverse = Math.max(1, (reaction.activationEnergyForward - catalystEaReduction - reaction.enthalpy)) * 1000;

  // Rate constants using Arrhenius: k = A * exp(-Ea / RT)
  // We scale A down slightly for visual purposes in the simulator
  const A = reaction.preExponentialFactor;
  const RT = R * temperature;
  const kf = A * Math.exp(-eaForward / RT);
  const kr = A * Math.exp(-eaReverse / RT);

  // Calculate rates based on reaction type
  let vf = 0;
  let vr = 0;
  let Q = 0;

  if (reaction.type === 'A_TO_B') {
    vf = kf * concA;
    vr = kr * concB; // Here B is stored in concC for visualization simplicity? Actually let's use concB.
    Q = concA > 0 ? concB / concA : Infinity;
  } else if (reaction.type === 'A_B_TO_C') {
    vf = kf * concA * concB;
    vr = kr * concC;
    Q = (concA * concB) > 0 ? concC / (concA * concB) : Infinity;
  } else if (reaction.type === 'A_B_TO_C_D') {
    vf = kf * concA * concB;
    vr = kr * concC * concD;
    Q = (concA * concB) > 0 ? (concC * concD) / (concA * concB) : Infinity;
  }

  const K = kr > 0 ? kf / kr : Infinity;
  
  // We consider it at equilibrium if vf and vr are very close AND non-zero
  const isAtEquilibrium = vf > 0 && vr > 0 && Math.abs(vf - vr) < (0.01 * Math.max(vf, vr));

  return { kf, kr, vf, vr, K, Q, isAtEquilibrium };
}
