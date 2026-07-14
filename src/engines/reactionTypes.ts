export interface ReactionResult {
  reactants: { symbol: string; coef: number; molarMass: number }[];
  products: { symbol: string; name: string; coef: number; molarMass: number }[];
  dH: number;
  dS: number;
  dG: number;
  stable: boolean;
  type: string;
  mechanismFR: string[];
  mechanismES: string[];
  intermediates: string[];
  catalystFR: string;
  catalystES: string;
  cascadeFR: string;
  cascadeES: string;
}

export interface ReactionDraft {
  prodSym: string;
  prodName: string;
  c1: number;
  c2: number;
  cp: number;
  mechanismFR: string[];
  mechanismES: string[];
  intermediates: string[];
  catalystFR: string;
  catalystES: string;
  cascadeFR: string;
  cascadeES: string;
}

export interface ReactionElement {
  s: string;
  cat: string;
  mass: number;
  en?: number;
  state: string;
  nameFR: string;
  nameES: string;
}
