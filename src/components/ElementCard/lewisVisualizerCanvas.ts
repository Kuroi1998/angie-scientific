export { drawLewisStructure } from './lewis2dCanvas';
export { drawVseprStructure } from './vseprCanvas';

export const NO_BOND_ELEMENTS = ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn', 'Og'];

export const getRecommendedBondConfig = (centralSymbol: string) => {
  const compactCenters = ['H', 'He', 'Ne', 'Ar', 'Kr', 'Xe'];
  return compactCenters.includes(centralSymbol)
    ? { ligand: 'O', count: 2 }
    : { ligand: 'H', count: 4 };
};
