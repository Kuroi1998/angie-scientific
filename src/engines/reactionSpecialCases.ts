import elementsData from './data/elements.json';
import type { ReactionElement, ReactionResult } from './reactionTypes';

const elements = elementsData as ReactionElement[];

export const predictSpecialReaction = (s1: string, s2: string): ReactionResult | null => {
  const isSodiumWater = (s1 === 'Na' && s2 === 'H2O') || (s1 === 'H2O' && s2 === 'Na');
  if (!isSodiumWater) return null;

  const sodium = elements.find((element) => element.s === 'Na');
  if (!sodium) return null;

  return {
    reactants: [
      { symbol: 'Na', coef: 2, molarMass: sodium.mass },
      { symbol: 'H2O', coef: 2, molarMass: 18.015 }
    ],
    products: [
      { symbol: 'NaOH', name: 'Soude Caustique / Soda Caustica (NaOH)', coef: 2, molarMass: 39.997 },
      { symbol: 'H2', name: 'Dihydrogene / Dihidrogeno (H2)', coef: 1, molarMass: 2.016 }
    ],
    dH: -368.6,
    dS: -15.4,
    dG: -364.0,
    stable: true,
    type: 'exothermic',
    mechanismFR: [
      "Etape 1 : Le sodium metallique cede ses electrons de valence a l'eau.",
      "Etape 2 : Reduction des protons de l'eau en atomes d'hydrogene radicaux.",
      'Etape 3 : Association rapide des radicaux pour degager du dihydrogene gazeux.',
      'Etape 4 : Les ions hydroxyde formes restent en solution avec les ions sodium.'
    ],
    mechanismES: [
      'Paso 1: El sodio metalico cede sus electrones de valencia al agua.',
      'Paso 2: Reduccion de los protones del agua a atomos de hidrogeno radicales.',
      'Paso 3: Asociacion rapida de radicales para liberar dihidrogeno gaseoso.',
      'Paso 4: Los iones hidroxido formados permanecen en solucion con los iones sodio.'
    ],
    intermediates: ['H radical', 'Na+', 'OH-'],
    catalystFR: 'Aucun requis : la reaction est extremement exothermique a temperature ambiante.',
    catalystES: 'Ninguno requerido: la reaccion es extremadamente exotermica a temperatura ambiente.',
    cascadeFR: "L'hydroxyde de sodium produit peut etre neutralise par un acide fort comme HCl.",
    cascadeES: 'El hidroxido de sodio producido puede neutralizarse con un acido fuerte como HCl.'
  };
};
