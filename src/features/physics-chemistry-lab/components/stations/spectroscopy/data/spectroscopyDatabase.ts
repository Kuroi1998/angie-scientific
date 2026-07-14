import type { EmissionElement, AbsorptionMolecule } from '../types/spectroscopy.types';

export const emissionDatabase: Record<string, EmissionElement> = {
  h: {
    id: 'h',
    name: 'Hydrogène',
    symbol: 'H',
    description: "Série de Balmer, la signature la plus célèbre de l'univers.",
    lines: [
      { wl: 656.3, color: '#ff0000', intensity: 1.0 }, // H-alpha
      { wl: 486.1, color: '#00ffff', intensity: 0.8 }, // H-beta
      { wl: 434.0, color: '#0000ff', intensity: 0.6 }, // H-gamma
      { wl: 410.2, color: '#7f00ff', intensity: 0.4 }  // H-delta
    ]
  },
  he: {
    id: 'he',
    name: 'Hélium',
    symbol: 'He',
    description: "Découvert d'abord dans le Soleil grâce à sa raie jaune à 587.6 nm.",
    lines: [
      { wl: 706.5, color: '#ff0000', intensity: 0.5 },
      { wl: 667.8, color: '#ff0000', intensity: 0.7 },
      { wl: 587.6, color: '#ffcc00', intensity: 1.0 }, // D3 line
      { wl: 501.5, color: '#00ff66', intensity: 0.8 },
      { wl: 447.1, color: '#0066ff', intensity: 0.7 },
      { wl: 402.6, color: '#6600ff', intensity: 0.4 }
    ]
  },
  ne: {
    id: 'ne',
    name: 'Néon',
    symbol: 'Ne',
    description: "Gaz noble responsable de la lueur rouge-orange intense des tubes néon.",
    lines: [
      { wl: 703.2, color: '#ff0000', intensity: 0.8 },
      { wl: 692.9, color: '#ff0000', intensity: 0.9 },
      { wl: 650.6, color: '#ff0000', intensity: 1.0 },
      { wl: 640.2, color: '#ff0000', intensity: 1.0 },
      { wl: 614.3, color: '#ff5500', intensity: 0.9 },
      { wl: 585.2, color: '#ffaa00', intensity: 0.8 },
      { wl: 540.1, color: '#00ff00', intensity: 0.4 }
    ]
  },
  hg: {
    id: 'hg',
    name: 'Mercure',
    symbol: 'Hg',
    description: "Utilisé dans les lampes fluorescentes. Ses raies ultraviolettes invisibles excitent le luminophore.",
    lines: [
      { wl: 579.0, color: '#ffaa00', intensity: 0.9 }, // Yellow doublet
      { wl: 577.0, color: '#ffaa00', intensity: 0.9 },
      { wl: 546.1, color: '#00ff00', intensity: 1.0 }, // Strong green
      { wl: 435.8, color: '#0000ff', intensity: 0.9 }, // Blue
      { wl: 404.7, color: '#6600ff', intensity: 0.6 }  // Violet
    ]
  },
  na: {
    id: 'na',
    name: 'Sodium',
    symbol: 'Na',
    description: "Célèbre pour son doublet jaune très intense (raies D1 et D2).",
    lines: [
      { wl: 589.0, color: '#ffaa00', intensity: 1.0 },
      { wl: 589.6, color: '#ffaa00', intensity: 1.0 }
    ]
  }
};

export const absorptionDatabase: Record<string, AbsorptionMolecule> = {
  h2o: {
    id: 'h2o',
    name: 'Vapeur d\'eau',
    formula: 'H₂O',
    description: "Molécule non linéaire. Possède 3 modes de vibration actifs en IR.",
    dips: [
      { wavenumber: 3756, transmittance: 0.1, width: 60, vibrationType: 'Élongation asymétrique (ν₃)' },
      { wavenumber: 3657, transmittance: 0.2, width: 50, vibrationType: 'Élongation symétrique (ν₁)' },
      { wavenumber: 1595, transmittance: 0.15, width: 80, vibrationType: 'Déformation angulaire (ν₂)' }
    ]
  },
  co2: {
    id: 'co2',
    name: 'Dioxyde de carbone',
    formula: 'CO₂',
    description: "Molécule linéaire. Son élongation symétrique est inactive en IR (règle de sélection).",
    dips: [
      { wavenumber: 2349, transmittance: 0.05, width: 40, vibrationType: 'Élongation asymétrique (ν₃)' },
      { wavenumber: 667, transmittance: 0.1, width: 30, vibrationType: 'Déformation angulaire (ν₂)' }
    ]
  },
  ch4: {
    id: 'ch4',
    name: 'Méthane',
    formula: 'CH₄',
    description: "Gaz à effet de serre puissant absorbant fortement dans l'infrarouge.",
    dips: [
      { wavenumber: 3019, transmittance: 0.15, width: 60, vibrationType: 'Élongation asymétrique' },
      { wavenumber: 1306, transmittance: 0.2, width: 50, vibrationType: 'Déformation (Parapluie)' }
    ]
  }
};

export const emissionKeys = Object.keys(emissionDatabase);
export const absorptionKeys = Object.keys(absorptionDatabase);
