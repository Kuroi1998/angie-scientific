import type { SubstanceParams } from '../types/phase.types';

export const substancesDatabase: Record<string, SubstanceParams> = {
  water: {
    id: 'water',
    name: 'Eau (H₂O)',
    color: '#18b8c8', // Cyan
    tripleT: 273.16,
    tripleP: 0.006,
    criticalT: 647.1,
    criticalP: 220.6,
    minT: 200,
    maxT: 800,
    minP: 0.001,
    maxP: 1000,
    // L_vap ~ 40.65 kJ/mol, R = 8.314 J/mol.K => 40650/8.314 = 4889 K
    latentHeatVaporizationOverR: 4889,
    // L_sub ~ 51 kJ/mol => 51000/8.314 = 6134 K
    latentHeatSublimationOverR: 6134,
    // Negative slope for water: ice is less dense than water
    fusionSlope: -130 // bar/K (approx for visual representation)
  },
  co2: {
    id: 'co2',
    name: 'Dioxyde de Carbone (CO₂)',
    color: '#8f9bb3', // Greyish
    tripleT: 216.6,
    tripleP: 5.18,
    criticalT: 304.2,
    criticalP: 73.8,
    minT: 150,
    maxT: 400,
    minP: 0.1,
    maxP: 1000,
    // L_vap ~ 16.7 kJ/mol => 2008 K
    latentHeatVaporizationOverR: 2008,
    // L_sub ~ 25.2 kJ/mol => 3031 K
    latentHeatSublimationOverR: 3031,
    fusionSlope: 40 // bar/K (positive)
  },
  iodine: {
    id: 'iodine',
    name: 'Iode (I₂)',
    color: '#b142af', // Purple
    tripleT: 386.8,
    tripleP: 0.12, // Sublimes easily at 1 atm!
    criticalT: 819.0,
    criticalP: 116.0,
    minT: 250,
    maxT: 900,
    minP: 0.001,
    maxP: 200,
    latentHeatVaporizationOverR: 5040,
    latentHeatSublimationOverR: 7490,
    fusionSlope: 30 // bar/K
  },
  nitrogen: {
    id: 'nitrogen',
    name: 'Azote (N₂)',
    color: '#39a76d', // Greenish
    tripleT: 63.15,
    tripleP: 0.125,
    criticalT: 126.2,
    criticalP: 33.9,
    minT: 40,
    maxT: 200,
    minP: 0.01,
    maxP: 100,
    latentHeatVaporizationOverR: 670, // L_vap = 5.56 kJ/mol
    latentHeatSublimationOverR: 830,  // L_sub = 6.9 kJ/mol
    fusionSlope: 25
  }
};

export const substanceKeys = Object.keys(substancesDatabase);
