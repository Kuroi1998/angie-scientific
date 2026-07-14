import type { ReactionDefinition } from '../types/kinetics.types';

export const reactionDatabase: Record<string, ReactionDefinition> = {
  isomerization: {
    id: 'isomerization',
    name: 'Isomérisation simple (A ⇌ B)',
    type: 'A_TO_B',
    description: 'Une réaction d\'isomérisation (changement de structure) exothermique.',
    activationEnergyForward: 40, // kJ/mol
    enthalpy: -15, // kJ/mol
    preExponentialFactor: 1e5,
    colorA: 'var(--as-accent-cyan)',
    colorB: 'var(--as-accent-magenta)'
  },
  synthesis: {
    id: 'synthesis',
    name: 'Synthèse (A + B ⇌ C)',
    type: 'A_B_TO_C',
    description: 'Une réaction de synthèse typique (exothermique) où deux réactifs forment un produit.',
    activationEnergyForward: 50,
    enthalpy: -25,
    preExponentialFactor: 5e4,
    colorA: 'var(--as-accent-cyan)',
    colorB: 'var(--as-accent-yellow)',
    colorC: 'var(--as-accent-green)'
  },
  substitution: {
    id: 'substitution',
    name: 'Substitution (A + B ⇌ C + D)',
    type: 'A_B_TO_C_D',
    description: 'Une réaction de substitution endothermique (nécessite de la chaleur pour se produire).',
    activationEnergyForward: 60,
    enthalpy: 20, // Endothermic
    preExponentialFactor: 8e4,
    colorA: 'var(--as-accent-cyan)',
    colorB: 'var(--as-accent-yellow)',
    colorC: 'var(--as-accent-green)',
    colorD: 'var(--as-accent-magenta)'
  }
};

export const reactionKeys = Object.keys(reactionDatabase);
