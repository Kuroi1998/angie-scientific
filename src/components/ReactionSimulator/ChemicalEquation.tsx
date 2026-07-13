import React from 'react';
import type { ChemicalToken, EquationSpecies } from '../../utils/chemicalFormula';
import { buildEquationTokens } from '../../utils/chemicalFormula';

interface ChemicalEquationProps {
  reactants: EquationSpecies[];
  products: EquationSpecies[];
}

/** Renders a balanced chemical equation as safe JSX (no dangerouslySetInnerHTML). */
export const ChemicalEquation: React.FC<ChemicalEquationProps> = ({ reactants, products }) => {
  const tokens = buildEquationTokens(reactants, products);

  return React.createElement('span', null,
    tokens.map((token: ChemicalToken, i: number) => {
      switch (token.kind) {
        case 'coefficient':
          return React.createElement('span', { key: i }, token.value);
        case 'symbol':
          return React.createElement('span', { key: i }, token.value);
        case 'subscript':
          return React.createElement('sub', { key: i }, token.value);
        case 'charge':
          return React.createElement('sup', { key: i }, token.value);
        case 'paren':
          return React.createElement('span', { key: i }, token.value);
        case 'state':
          return React.createElement('span', { key: i, style: { fontSize: '0.7em' } }, ` ${token.value}`);
        case 'operator':
          return React.createElement('span', { key: i }, ` ${token.value} `);
        case 'arrow':
          return React.createElement('span', { key: i }, ' ➔ ');
        default:
          return null;
      }
    })
  );
};
