/**
 * Read-only snapshot of results the real scientific engines already
 * computed. The intent engine only ever reads from here — it never
 * recomputes a scientific value itself, so Angie can't invent numbers.
 */
export interface FusionScientificContext {
  reactant1: string | null;
  reactant2: string | null;
  productSymbol: string | null;
  stable: boolean;
  dH: number | null;
  reactionType: string | null;
  updatedAt: number;
}

export interface GasEquationsScientificContext {
  gasLawId: string;
  variableSymbol: string;
  resultValue: number | null;
  unit: string;
  isValid: boolean;
  updatedAt: number;
}

interface ScientificContextStore {
  fusion: FusionScientificContext | null;
  gasEquations: GasEquationsScientificContext | null;
}

const store: ScientificContextStore = { fusion: null, gasEquations: null };

export function publishFusionContext(context: FusionScientificContext): void {
  store.fusion = context;
}

export function publishGasEquationsContext(context: GasEquationsScientificContext): void {
  store.gasEquations = context;
}

export function getScientificContext(): ScientificContextStore {
  return store;
}
