import type { Language } from '../../hooks/useLanguage';
import type { Emotion } from '../../features/angie/state/angie.types';
import type { ElementType } from '../PeriodicTable/periodicTableTypes';
import {
  getCategoryLabel,
  getElementName,
  getStateLabel,
} from '../PeriodicTable/periodicTableModel';

export type ElementDetailTab =
  | 'general'
  | 'superpowers'
  | 'atomic'
  | 'quantum'
  | 'bonds'
  | 'history';

export interface ElementDetailTexts {
  category: string;
  desc: string;
  history: string;
  name: string;
  state: string;
  uses: string;
}

export const nobleGasSymbols = ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn', 'Og'];

export function getElementDetailTexts(
  element: ElementType,
  language: Language | null,
): ElementDetailTexts {
  return {
    category: getCategoryLabel(element.cat, language),
    desc: language === 'es' ? element.descES : element.descFR,
    history: language === 'es' ? element.historyES : element.historyFR,
    name: getElementName(element, language),
    state: getStateLabel(element.state, language),
    uses: language === 'es' ? element.usesES : element.usesFR,
  };
}

export function formatElementValue(value: number | string | null, unit = '') {
  if (value === null || value === undefined || value === '') return 'N/A';
  return unit ? `${value} ${unit}` : String(value);
}

export function getElementDetailTabs(
  element: ElementType,
  language: Language | null,
  t: (key: string) => string,
) {
  const tabs = [
    { id: 'general', label: t('element.general') },
    { id: 'superpowers', label: language === 'es' ? 'Superpoderes' : 'Super-pouvoirs' },
    { id: 'atomic', label: t('element.atomic') },
    { id: 'quantum', label: t('element.quantum') },
    { id: 'history', label: t('element.history') },
  ] satisfies { id: ElementDetailTab; label: string }[];

  if (nobleGasSymbols.includes(element.s)) return tabs;
  return [
    ...tabs.slice(0, 4),
    { id: 'bonds', label: language === 'es' ? 'Enlaces' : 'Liaisons' },
    tabs[4],
  ] satisfies { id: ElementDetailTab; label: string }[];
}

export function getFactEmotion(category: string): Emotion {
  if (category === 'surprising') return 'surprised';
  if (category === 'safety') return 'worried';
  if (category === 'reaction') return 'curious';
  if (category === 'discovery') return 'thinking';
  return 'happy';
}
