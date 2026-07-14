import type { GasDefinition, GasKey } from '../types/gas.types';

export const gasDatabase: Record<GasKey, GasDefinition> = {
  he: {
    key: 'he',
    name: 'Hélium',
    formula: 'He',
    molarMass: 4.0026,
    family: 'Gaz noble',
    color: '#F48FB1',
    a: 0.0346,
    b: 0.0238,
    criticalT: 5.19,
    criticalP: 2.27,
    description: 'Gaz inerte très léger, très proche du gaz parfait à température ambiante.'
  },
  n2: {
    key: 'n2',
    name: 'Azote',
    formula: 'N₂',
    molarMass: 28.014,
    family: 'Diatomique',
    color: '#81D4FA',
    a: 1.370,
    b: 0.0387,
    criticalT: 126.19,
    criticalP: 33.9,
    description: 'Composant principal de l\'air, s\'écarte peu du modèle idéal à température ambiante.'
  },
  co2: {
    key: 'co2',
    name: 'Dioxyde de carbone',
    formula: 'CO₂',
    molarMass: 44.01,
    family: 'Polyatomique',
    color: '#80CBC4',
    a: 3.640,
    b: 0.04267,
    criticalT: 304.13,
    criticalP: 73.8,
    description: 'S\'écarte significativement du gaz parfait à cause de ses interactions intermoléculaires importantes.'
  },
  o2: {
    key: 'o2',
    name: 'Oxygène',
    formula: 'O₂',
    molarMass: 31.999,
    family: 'Diatomique',
    color: '#90CAF9',
    a: 1.382,
    b: 0.03186,
    criticalT: 154.58,
    criticalP: 50.43,
    description: 'Gaz essentiel à la respiration.'
  },
  ch4: {
    key: 'ch4',
    name: 'Méthane',
    formula: 'CH₄',
    molarMass: 16.04,
    family: 'Hydrocarbure',
    color: '#A5D6A7',
    a: 2.303,
    b: 0.04306,
    criticalT: 190.56,
    criticalP: 45.99,
    description: 'Principal composant du gaz naturel.'
  },
  h2o: {
    key: 'h2o',
    name: 'Vapeur d\'eau',
    formula: 'H₂O',
    molarMass: 18.015,
    family: 'Polyatomique',
    color: '#4FC3F7',
    a: 5.536,
    b: 0.03049,
    criticalT: 647.10,
    criticalP: 220.64,
    description: 'Très fortement non-idéal en raison des liaisons hydrogène intenses.'
  },
  ar: {
    key: 'ar',
    name: 'Argon',
    formula: 'Ar',
    molarMass: 39.948,
    family: 'Gaz noble',
    color: '#B39DDB',
    a: 1.355,
    b: 0.03201,
    criticalT: 150.87,
    criticalP: 48.98,
    description: 'Gaz inerte commun.'
  }
};

export const gasKeys = Object.keys(gasDatabase) as GasKey[];
