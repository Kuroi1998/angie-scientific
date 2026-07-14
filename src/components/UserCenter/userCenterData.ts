import type { Badge as UserBadge, LearningLevel } from '../../data/educational/models';
import { DEFAULT_THEME_ID, THEMES } from '../../theme/theme.constants';
import type { ThemeId } from '../../theme/theme.types';

export type UserCenterSection = 'profile' | 'preferences' | 'progress' | 'album' | 'themes';

export interface ThemeOption {
  color: string;
  cost: number;
  description: string;
  id: string;
  name: string;
}

export const defaultUnlockedThemes = ['light', 'dark', 'system', 'high-contrast'];

// Preview swatch + XP cost per theme id — id/name/description stay sourced from
// THEMES (theme.constants.ts) so the Theme Store never drifts out of sync with it.
const themeStoreMeta: Record<ThemeId, { color: string; cost: number }> = {
  dark: { color: '#080b12', cost: 0 },
  'high-contrast': { color: '#000000', cost: 0 },
  laboratory: { color: '#f5f8fa', cost: 500 },
  light: { color: '#f0f4f8', cost: 0 },
  'scientific-night': { color: '#0a1128', cost: 500 },
  system: { color: 'linear-gradient(135deg, #f0f4f8 50%, #080b12 50%)', cost: 0 },
};

export const themeOptions: ThemeOption[] = Object.values(THEMES).map((theme) => ({
  color: themeStoreMeta[theme.id].color,
  cost: themeStoreMeta[theme.id].cost,
  description: theme.description,
  id: theme.id,
  name: theme.name,
}));

export { DEFAULT_THEME_ID };

export const learningLevelOptions: { label: string; value: LearningLevel }[] = [
  { label: 'Decouverte', value: 'discovery' },
  { label: 'Intermediaire', value: 'intermediate' },
  { label: 'Scientifique', value: 'scientific' },
];

export const badgeCatalog: UserBadge[] = [
  {
    conditionCount: 5,
    conditionType: 'elements_discovered',
    descriptionEs: 'Descubrio 5 elementos',
    descriptionFr: 'A decouvert 5 elements',
    iconName: 'Star',
    id: 'b1',
    nameEs: 'Aprendiz',
    nameFr: 'Apprenti chimiste',
    rarity: 'common',
  },
  {
    conditionCount: 1,
    conditionTarget: 'H2O',
    conditionType: 'specific_reaction',
    descriptionEs: 'Sintetizo H2O',
    descriptionFr: 'A synthetise H2O',
    iconName: 'Flame',
    id: 'b4',
    nameEs: 'Senor del agua',
    nameFr: "Maitre de l'eau",
    rarity: 'rare',
  },
  {
    conditionCount: 5,
    conditionType: 'riddles_solved',
    descriptionEs: 'Resolvio 5 acertijos',
    descriptionFr: 'A resolu 5 devinettes',
    iconName: 'HelpCircle',
    id: 'b6',
    nameEs: 'Detective atomico',
    nameFr: 'Detective atomique',
    rarity: 'epic',
  },
];

export function rarityTone(rarity: UserBadge['rarity']) {
  if (rarity === 'legendary' || rarity === 'epic') return 'warning';
  if (rarity === 'rare') return 'info';
  return 'neutral';
}
