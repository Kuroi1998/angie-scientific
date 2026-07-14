import type { CSSProperties } from 'react';
import type { ElementType, PeriodicFilters } from './periodicTableTypes';

export const categoryMeta = [
  { id: 'alkali-metal', color: '#e45757', labelFr: 'Alcalins', labelEs: 'Alcalinos' },
  { id: 'alkaline-earth', color: '#df8c3f', labelFr: 'Alcalino-terreux', labelEs: 'Alcalinoterreos' },
  { id: 'transition-metal', color: '#d6a73c', labelFr: 'Transition', labelEs: 'Transicion' },
  { id: 'lanthanide', color: '#9d7ce7', labelFr: 'Lanthanides', labelEs: 'Lantanidos' },
  { id: 'actinide', color: '#d66aa3', labelFr: 'Actinides', labelEs: 'Actinidos' },
  { id: 'post-transition-metal', color: '#7c96d8', labelFr: 'Post-transition', labelEs: 'Postransicion' },
  { id: 'metalloid', color: '#3ba982', labelFr: 'Metalloides', labelEs: 'Metaloides' },
  { id: 'reactive-nonmetal', color: '#1aa6bd', labelFr: 'Non-metaux', labelEs: 'No metales' },
  { id: 'noble-gas', color: '#48a5e6', labelFr: 'Gaz nobles', labelEs: 'Gases nobles' },
  { id: 'unknown', color: '#8f9aa3', labelFr: 'Inconnus', labelEs: 'Desconocidos' },
];

export const stateOptions = [
  { id: 'all', labelFr: 'Tous les etats', labelEs: 'Todos los estados' },
  { id: 'solid', labelFr: 'Solide', labelEs: 'Solido' },
  { id: 'liquid', labelFr: 'Liquide', labelEs: 'Liquido' },
  { id: 'gas', labelFr: 'Gaz', labelEs: 'Gas' },
  { id: 'synthetic', labelFr: 'Synthetique', labelEs: 'Sintetico' },
];

export function getElementName(element: ElementType, language: string | null) {
  return language === 'es' ? element.nameES : element.nameFR;
}

export function getCategoryLabel(category: string, language: string | null) {
  const match = categoryMeta.find((item) => item.id === category);
  if (!match) return category;
  return language === 'es' ? match.labelEs : match.labelFr;
}

export function getCategoryColor(category: string) {
  return categoryMeta.find((item) => item.id === category)?.color ?? '#8f9aa3';
}

export function getStateLabel(state: string, language: string | null) {
  const match = stateOptions.find((item) => item.id === state);
  if (!match) return state;
  return language === 'es' ? match.labelEs : match.labelFr;
}

export function matchesElementFilters(
  element: ElementType,
  filters: PeriodicFilters,
  language: string | null,
) {
  const query = filters.query.trim().toLowerCase();
  if (query) {
    const name = getElementName(element, language).toLowerCase();
    const found = element.s.toLowerCase().includes(query)
      || name.includes(query)
      || String(element.n) === query;
    if (!found) return false;
  }
  if (filters.category !== 'all' && element.cat !== filters.category) return false;
  if (filters.state !== 'all' && element.state !== filters.state) return false;
  return true;
}

export function getGridPosition(n: number): CSSProperties {
  if (n === 1) return { gridRow: 1, gridColumn: 1 };
  if (n === 2) return { gridRow: 1, gridColumn: 18 };
  if (n >= 3 && n <= 4) return { gridRow: 2, gridColumn: n - 2 };
  if (n >= 5 && n <= 10) return { gridRow: 2, gridColumn: n + 8 };
  if (n >= 11 && n <= 12) return { gridRow: 3, gridColumn: n - 10 };
  if (n >= 13 && n <= 18) return { gridRow: 3, gridColumn: n };
  if (n >= 19 && n <= 36) return { gridRow: 4, gridColumn: n - 18 };
  if (n >= 37 && n <= 54) return { gridRow: 5, gridColumn: n - 36 };
  if (n >= 55 && n <= 56) return { gridRow: 6, gridColumn: n - 54 };
  if (n === 57) return { gridRow: 6, gridColumn: 3 };
  if (n >= 58 && n <= 71) return { gridRow: 9, gridColumn: n - 54 };
  if (n >= 72 && n <= 86) return { gridRow: 6, gridColumn: n - 68 };
  if (n >= 87 && n <= 88) return { gridRow: 7, gridColumn: n - 86 };
  if (n === 89) return { gridRow: 7, gridColumn: 3 };
  if (n >= 90 && n <= 103) return { gridRow: 10, gridColumn: n - 86 };
  if (n >= 104 && n <= 118) return { gridRow: 7, gridColumn: n - 100 };
  return {};
}

export function percent(value: number | null, max: number) {
  if (value === null || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, (value / max) * 100));
}
