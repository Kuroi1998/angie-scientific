import type { ReactionDraft, ReactionElement } from './reactionTypes';

const DEFAULT_CATALYST_FR = 'Aucun requis (thermiquement spontane)';
const DEFAULT_CATALYST_ES = 'Ninguno requerido (termicamente espontaneo)';
const DEFAULT_CASCADE_FR = 'Aucune reaction en cascade directe identifiee.';
const DEFAULT_CASCADE_ES = 'No se identifico ninguna reaccion en cascada directa.';

export const createReactionDraft = (partial: Partial<ReactionDraft>): ReactionDraft => ({
  prodSym: '',
  prodName: '',
  c1: 1,
  c2: 1,
  cp: 1,
  mechanismFR: [],
  mechanismES: [],
  intermediates: [],
  catalystFR: DEFAULT_CATALYST_FR,
  catalystES: DEFAULT_CATALYST_ES,
  cascadeFR: DEFAULT_CASCADE_FR,
  cascadeES: DEFAULT_CASCADE_ES,
  ...partial
});

export const getValence = (symbol: string, category: string): number => {
  if (['F', 'Cl', 'Br', 'I'].includes(symbol)) return -1;
  if (['O', 'S', 'Se'].includes(symbol)) return -2;
  if (['N', 'P'].includes(symbol)) return -3;
  if (category === 'alkali-metal' || symbol === 'H' || symbol === 'Ag') return 1;
  if (category === 'alkaline-earth' || symbol === 'Zn' || symbol === 'Cu' || symbol === 'Hg') return 2;
  if (symbol === 'Al' || symbol === 'Fe') return 3;
  if (symbol === 'C' || symbol === 'Si') return 4;
  return 1;
};

export const isDiatomic = (symbol: string) => {
  return ['H', 'N', 'O', 'F', 'Cl', 'Br', 'I'].includes(symbol);
};

export const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;

export const orderReactants = (el1: ReactionElement, el2: ReactionElement) => {
  const en1 = el1.en || 1;
  const en2 = el2.en || 1;
  return en1 <= en2 ? [el1, el2] as const : [el2, el1] as const;
};

export const createGenericMechanism = (sym1: string, sym2: string, prodSym: string) => ({
  intermediates: [`Ion ${sym1} charge`, `Ion ${sym2} charge`],
  mechanismFR: [
    `Etape 1 : Dissociation ou activation thermique des reactifs ${sym1} et ${sym2}.`,
    "Etape 2 : Transfert ou partage electronique favorise par la difference d'electronegativite.",
    `Etape 3 : Formation du produit de synthese stable ${prodSym}.`
  ],
  mechanismES: [
    `Paso 1: Disociacion o activacion termica de los reactivos ${sym1} y ${sym2}.`,
    'Paso 2: Transferencia o comparticion electronica favorecida por la diferencia de electronegatividad.',
    `Paso 3: Formacion del producto de sintesis estable ${prodSym}.`
  ]
});
