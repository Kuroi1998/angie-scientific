// Structured representation of a chemical equation, used to render formulas
// (subscripts, coefficients, ionic charges, reaction arrow) as safe JSX
// instead of building an HTML string and injecting it with
// dangerouslySetInnerHTML.

export type ChemicalToken =
  | { kind: 'coefficient'; value: string }
  | { kind: 'symbol'; value: string }
  | { kind: 'subscript'; value: string }
  | { kind: 'paren'; value: '(' | ')' }
  | { kind: 'charge'; value: string }
  | { kind: 'operator'; value: string }
  | { kind: 'arrow' }
  | { kind: 'state'; value: string };

export interface EquationSpecies {
  /** Stoichiometric coefficient. Omitted from rendering when it equals 1. */
  coefficient: number;
  /** Chemical formula, e.g. "H2O", "NaCl", "Al2O3", optionally with a trailing ionic charge like "SO4^2-". */
  formula: string;
  /** Optional physical state suffix, e.g. "(s)", "(l)", "(g)", "(aq)". */
  state?: string;
}

const CHARGE_SUFFIX_PATTERN = /\^?(\d*[+-])$/;
const FORMULA_UNIT_PATTERN = /([A-Z][a-z]?|\(|\))(\d*)/g;

/** Splits a formula string (e.g. "H2O", "Al2O3", "SO4^2-") into safe-to-render tokens. */
export function tokenizeFormula(formula: string): ChemicalToken[] {
  if (!formula) return [];

  let body = formula;
  let charge: string | null = null;
  const chargeMatch = body.match(CHARGE_SUFFIX_PATTERN);
  if (chargeMatch) {
    charge = chargeMatch[1];
    body = body.slice(0, body.length - chargeMatch[0].length);
  }

  const tokens: ChemicalToken[] = [];
  FORMULA_UNIT_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = FORMULA_UNIT_PATTERN.exec(body)) !== null) {
    const [, unit, subscript] = match;
    if (unit === '(' || unit === ')') {
      tokens.push({ kind: 'paren', value: unit });
    } else {
      tokens.push({ kind: 'symbol', value: unit });
    }
    if (subscript) {
      tokens.push({ kind: 'subscript', value: subscript });
    }
  }

  if (charge) {
    tokens.push({ kind: 'charge', value: charge });
  }

  return tokens;
}

function speciesToTokens(species: EquationSpecies): ChemicalToken[] {
  const tokens: ChemicalToken[] = [];
  if (species.coefficient > 1) {
    tokens.push({ kind: 'coefficient', value: String(species.coefficient) });
  }
  tokens.push(...tokenizeFormula(species.formula));
  if (species.state) {
    tokens.push({ kind: 'state', value: species.state });
  }
  return tokens;
}

/** Builds the full token stream for "reactants -> products", including "+" separators and the arrow. */
export function buildEquationTokens(
  reactants: EquationSpecies[],
  products: EquationSpecies[]
): ChemicalToken[] {
  const tokens: ChemicalToken[] = [];

  reactants.forEach((species, i) => {
    if (i > 0) tokens.push({ kind: 'operator', value: '+' });
    tokens.push(...speciesToTokens(species));
  });

  tokens.push({ kind: 'arrow' });

  products.forEach((species, i) => {
    if (i > 0) tokens.push({ kind: 'operator', value: '+' });
    tokens.push(...speciesToTokens(species));
  });

  return tokens;
}
