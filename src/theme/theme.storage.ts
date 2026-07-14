import type { ThemeId } from './theme.types';
import { THEME_STORAGE_KEY, DEFAULT_THEME_ID, THEMES } from './theme.constants';

export const getStoredTheme = (): ThemeId => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && THEMES[stored]) {
      return stored as ThemeId;
    }
  } catch (e) {
    console.error('Failed to read theme from storage', e);
  }
  return DEFAULT_THEME_ID as ThemeId;
};

export const setStoredTheme = (theme: ThemeId): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {
    console.error('Failed to save theme to storage', e);
  }
};
