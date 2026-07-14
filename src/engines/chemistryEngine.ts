import elementsData from './data/elements.json';
import { buildFallbackReaction } from './reactionFallback';
import { createGenericMechanism, isDiatomic, orderReactants } from './reactionHelpers';
import { getKnownReactionDraft } from './reactionRules';
import { predictSpecialReaction } from './reactionSpecialCases';
import { thermoDb } from './thermoDb';
import type { ReactionDraft, ReactionElement, ReactionResult } from './reactionTypes';

export type { ReactionResult } from './reactionTypes';

const elements = elementsData as ReactionElement[];

export const predictReaction = (s1: string, s2: string): ReactionResult | null => {
  const specialReaction = predictSpecialReaction(s1, s2);
  if (specialReaction) return specialReaction;

  const el1 = elements.find((element) => element.s === s1);
  const el2 = elements.find((element) => element.s === s2);
  if (!el1 || !el2) return null;

  const [r1, r2] = orderReactants(el1, el2);
  const draft = getKnownReactionDraft(r1.s, r2.s) ?? buildFallbackReaction(r1, r2);
  const enrichedDraft = withMechanismFallback(draft, r1.s, r2.s);
  const { dH, dS, dG } = calculateThermodynamics(enrichedDraft, r1, r2);

  return {
    reactants: [
      { symbol: reactantSymbol(r1.s), coef: enrichedDraft.c1, molarMass: reactantMolarMass(r1) },
      { symbol: reactantSymbol(r2.s), coef: enrichedDraft.c2, molarMass: reactantMolarMass(r2) }
    ],
    products: [
      {
        symbol: enrichedDraft.prodSym,
        name: enrichedDraft.prodName,
        coef: enrichedDraft.cp,
        molarMass: productMolarMass(enrichedDraft, r1, r2)
      }
    ],
    dH: roundTenth(dH),
    dS: roundTenth(dS),
    dG: roundTenth(dG),
    stable: dG < 0,
    type: dH < 0 ? 'exothermic' : 'endothermic',
    mechanismFR: enrichedDraft.mechanismFR,
    mechanismES: enrichedDraft.mechanismES,
    intermediates: enrichedDraft.intermediates,
    catalystFR: enrichedDraft.catalystFR,
    catalystES: enrichedDraft.catalystES,
    cascadeFR: enrichedDraft.cascadeFR,
    cascadeES: enrichedDraft.cascadeES
  };
};

const withMechanismFallback = (draft: ReactionDraft, sym1: string, sym2: string): ReactionDraft => {
  if (draft.mechanismFR.length > 0) return draft;
  return {
    ...draft,
    ...createGenericMechanism(sym1, sym2, draft.prodSym)
  };
};

const calculateThermodynamics = (draft: ReactionDraft, r1: ReactionElement, r2: ReactionElement) => {
  const keyR1 = reactantSymbol(r1.s);
  const keyR2 = reactantSymbol(r2.s);
  const tR1 = thermoDb[keyR1] || { Hf: 0, S: 100 };
  const tR2 = thermoDb[keyR2] || { Hf: 0, S: 100 };
  const productThermo = thermoDb[draft.prodSym];

  if (productThermo) {
    const dH = (draft.cp * productThermo.Hf) - (draft.c1 * tR1.Hf + draft.c2 * tR2.Hf);
    const dS = (draft.cp * productThermo.S) - (draft.c1 * tR1.S + draft.c2 * tR2.S);
    return { dH, dS, dG: dH - (298.15 * dS) / 1000 };
  }

  const electronegDiff = Math.abs((r1.en || 1) - (r2.en || 1));
  const estimatedHf = -96.48 * Math.pow(electronegDiff, 2);
  const stateDecrease = (r1.state === 'gas' ? 100 : 0) + (r2.state === 'gas' ? 100 : 0);
  const dH = estimatedHf * draft.cp;
  const dS = (-120 - stateDecrease) * draft.cp;
  return { dH, dS, dG: dH - (298.15 * dS) / 1000 };
};

const reactantSymbol = (symbol: string) => `${symbol}${isDiatomic(symbol) ? '2' : ''}`;

const reactantMolarMass = (element: ReactionElement) => {
  return isDiatomic(element.s) ? element.mass * 2 : element.mass;
};

const productMolarMass = (draft: ReactionDraft, r1: ReactionElement, r2: ReactionElement) => {
  const r1Atoms = draft.c1 * (isDiatomic(r1.s) ? 2 : 1);
  const r2Atoms = draft.c2 * (isDiatomic(r2.s) ? 2 : 1);
  return (r1.mass * r1Atoms) / draft.cp + (r2.mass * r2Atoms) / draft.cp;
};

const roundTenth = (value: number) => Math.round(value * 10) / 10;
