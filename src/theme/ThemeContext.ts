import { createContext } from 'react';
import type { ThemeContextState } from './theme.types';
import { THEMES, DEFAULT_THEME_ID } from './theme.constants';

export const ThemeContext = createContext<ThemeContextState>({
  theme: DEFAULT_THEME_ID as any,
  resolvedTheme: 'light',
  setTheme: () => {},
  availableThemes: Object.values(THEMES),
});
