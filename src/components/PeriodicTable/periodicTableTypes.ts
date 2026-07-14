export interface ElementType {
  n: number;
  s: string;
  nameFR: string;
  nameES: string;
  cat: string;
  mass: number;
  en: number | null;
  config: string;
  shells: number[];
  state: 'solid' | 'liquid' | 'gas' | 'synthetic';
  density: number | null;
  mp: number | null;
  bp: number | null;
  ar: number | null;
  ir: number | null;
  ie: number | null;
  ea: number | null;
  crystal: string;
  ab: number | null;
  usesFR: string;
  usesES: string;
  historyFR: string;
  historyES: string;
  descFR: string;
  descES: string;
}

export interface PeriodicFilters {
  category: string;
  query: string;
  state: string;
}

export type PeriodicMode = 'explore' | 'quiz';
