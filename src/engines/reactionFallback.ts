import { createReactionDraft, gcd, getValence, isDiatomic } from './reactionHelpers';
import type { ReactionDraft, ReactionElement } from './reactionTypes';

export const buildFallbackReaction = (r1: ReactionElement, r2: ReactionElement): ReactionDraft => {
  const sym1 = r1.s;
  const sym2 = r2.s;
  const valence1 = Math.abs(getValence(sym1, r1.cat));
  const valence2 = Math.abs(getValence(sym2, r2.cat));
  const common = gcd(valence1, valence2);
  const sub1 = valence2 / common;
  const sub2 = valence1 / common;
  const prodSym = `${sym1}${sub1 > 1 ? sub1 : ''}${sym2}${sub2 > 1 ? sub2 : ''}`;

  const coefficients = balanceFallbackCoefficients(sym1, sym2, sub1, sub2);

  return createReactionDraft({
    prodSym,
    prodName: `Compose de ${r1.nameFR}-${r2.nameFR} / Compuesto de ${r1.nameES}-${r2.nameES}`,
    ...coefficients
  });
};

const balanceFallbackCoefficients = (sym1: string, sym2: string, sub1: number, sub2: number) => {
  const d1 = isDiatomic(sym1);
  const d2 = isDiatomic(sym2);
  let rc1 = sub1;
  let rc2 = sub2;
  let rcp = 1;

  if (d1) {
    rc2 *= 2;
    rcp *= 2;
  } else {
    rc1 *= 2;
  }

  if (d2) {
    rc1 *= 2;
    rcp *= 2;
  } else {
    rc2 *= 2;
  }

  const common = gcd(gcd(rc1, rc2), rcp);
  const cp = rcp / common;

  return {
    c1: d1 ? (sub1 * cp) / 2 : sub1 * cp,
    c2: d2 ? (sub2 * cp) / 2 : sub2 * cp,
    cp
  };
};
