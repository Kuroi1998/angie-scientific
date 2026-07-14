import type { ThemeConfig } from './theme.types';

export const THEMES: Record<string, ThemeConfig> = {
  system: {
    id: 'system',
    name: 'Système',
    description: 'Suit les paramètres de votre appareil',
    type: 'auto'
  },
  light: {
    id: 'light',
    name: 'Clair',
    description: 'Interface claire par défaut',
    type: 'light'
  },
  dark: {
    id: 'dark',
    name: 'Sombre',
    description: 'Interface sombre par défaut',
    type: 'dark'
  },
  'scientific-night': {
    id: 'scientific-night',
    name: 'Nuit Scientifique',
    description: 'Thème sombre optimisé pour les laboratoires de nuit',
    type: 'dark',
    isPremium: true
  },
  laboratory: {
    id: 'laboratory',
    name: 'Laboratoire',
    description: 'Tons gris clinique pour un environnement stérile',
    type: 'light',
    isPremium: true
  },
  'high-contrast': {
    id: 'high-contrast',
    name: 'Contraste Renforcé',
    description: 'Ultra visible pour une meilleure accessibilité',
    type: 'dark',
    isPremium: true
  }
};

export const DEFAULT_THEME_ID = 'system';
export const THEME_STORAGE_KEY = 'angie-scientific-theme';
