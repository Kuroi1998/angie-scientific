export interface QuickElement {
  name: string;
  symbol: string;
}

export const quickElements: QuickElement[] = [
  { symbol: 'H', name: 'Hydrogen' },
  { symbol: 'Li', name: 'Lithium' },
  { symbol: 'C', name: 'Carbon' },
  { symbol: 'N', name: 'Nitrogen' },
  { symbol: 'O', name: 'Oxygen' },
  { symbol: 'F', name: 'Fluorine' },
  { symbol: 'Na', name: 'Sodium' },
  { symbol: 'Mg', name: 'Magnesium' },
  { symbol: 'Al', name: 'Aluminum' },
  { symbol: 'S', name: 'Sulfur' },
  { symbol: 'Cl', name: 'Chlorine' },
  { symbol: 'K', name: 'Potassium' },
  { symbol: 'Ca', name: 'Calcium' },
  { symbol: 'Fe', name: 'Iron' },
  { symbol: 'Cu', name: 'Copper' },
  { symbol: 'Zn', name: 'Zinc' },
  { symbol: 'I', name: 'Iodine' },
];

export function getProductMessage(product: string | undefined, language: string | null) {
  const isFrench = language === 'fr';
  if (product === 'H2O') {
    return isFrench
      ? "Bravo ! Tu as cree de l'eau."
      : 'Bravo. Has creado agua.';
  }
  if (product === 'NaCl') {
    return isFrench
      ? "Super ! Le NaCl est le sel de table."
      : 'Muy bien. NaCl es sal de mesa.';
  }
  if (product === 'CO2') {
    return isFrench
      ? 'Le dioxyde de carbone explique les bulles des boissons gazeuses.'
      : 'El CO2 explica las burbujas de las bebidas gaseosas.';
  }
  return isFrench ? 'Reaction reussie.' : 'Reaccion exitosa.';
}

