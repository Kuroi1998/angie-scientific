import type { KineticsState, KineticsResult, ReactionType } from '../types/kinetics.types';

// Advances the simulation by dt seconds
export function advanceSimulationStep(
  state: KineticsState,
  result: KineticsResult,
  dt: number,
  reactionType: ReactionType
): Partial<KineticsState> {
  const { vf, vr } = result;
  
  // To avoid instability with Euler method when rates are very high,
  // we do sub-stepping if the change is too large relative to concentrations.
  
  let currentA = state.concA;
  let currentB = state.concB;
  let currentC = state.concC;
  let currentD = state.concD;

  // We recompute vf and vr internally for sub-steps to be accurate
  // but for simplicity and performance in this educational sim, 
  // we can just use the provided vf and vr scaled down if we assume they are constant over dt.
  // Actually, let's use a very simple bounded Euler to prevent negative concentrations.

  const delta = (vf - vr) * dt;

  if (reactionType === 'A_TO_B') {
    // A -> B
    const actualDelta = Math.min(Math.max(delta, -currentB), currentA);
    currentA -= actualDelta;
    currentB += actualDelta;
  } else if (reactionType === 'A_B_TO_C') {
    // A + B -> C
    const maxForward = Math.min(currentA, currentB);
    const maxReverse = currentC;
    const actualDelta = Math.min(Math.max(delta, -maxReverse), maxForward);
    
    currentA -= actualDelta;
    currentB -= actualDelta;
    currentC += actualDelta;
  } else if (reactionType === 'A_B_TO_C_D') {
    // A + B -> C + D
    const maxForward = Math.min(currentA, currentB);
    const maxReverse = Math.min(currentC, currentD);
    const actualDelta = Math.min(Math.max(delta, -maxReverse), maxForward);
    
    currentA -= actualDelta;
    currentB -= actualDelta;
    currentC += actualDelta;
    currentD += actualDelta;
  }

  return {
    concA: Math.max(0, currentA),
    concB: Math.max(0, currentB),
    concC: Math.max(0, currentC),
    concD: Math.max(0, currentD),
  };
}
