import { Award, Sparkles, Target, Trophy } from 'lucide-react';

export interface Quest {
  desc: string;
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  title: string;
}

export const quests: Quest[] = [
  {
    id: 'halogens',
    level: 'beginner',
    title: 'Trouver 3 halogenes',
    desc: 'Explorer trois elements de la colonne 17 dans la grille.',
    points: 100,
  },
  {
    id: 'h2o_combustion',
    level: 'beginner',
    title: "Equilibrer l'equation de l'eau",
    desc: 'Initier la fusion chimique entre H et O.',
    points: 150,
  },
  {
    id: 'limiting_reactant',
    level: 'intermediate',
    title: 'Trouver le reactif limitant',
    desc: 'Comparer les rapports dans le calculateur stoechiometrique.',
    points: 200,
  },
  {
    id: 'cascade_synthesis',
    level: 'advanced',
    title: 'Synthese multi-etapes',
    desc: "Lancer Sodium + Eau apres avoir produit de l'eau.",
    points: 350,
  },
  {
    id: 'vsepr_prediction',
    level: 'advanced',
    title: 'Predire une geometrie VSEPR',
    desc: 'Identifier une geometrie avec quatre ligands.',
    points: 300,
  },
];

export const achievementBadges = [
  { icon: Target, min: 100, name: 'Apprenti chimiste' },
  { icon: Award, min: 250, name: 'Maitre des equilibres' },
  { icon: Trophy, min: 500, name: 'Strategie quantique' },
  { icon: Sparkles, min: 800, name: 'Commandeur scientifique' },
];

export function levelTone(level: Quest['level']) {
  if (level === 'beginner') return 'success' as const;
  if (level === 'intermediate') return 'warning' as const;
  return 'error' as const;
}

export function isStringArray(raw: unknown): raw is string[] {
  return Array.isArray(raw) && raw.every((item) => typeof item === 'string');
}

