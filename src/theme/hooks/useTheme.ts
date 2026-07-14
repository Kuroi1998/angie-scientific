import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';
import type { ThemeContextState } from '../theme.types';

export const useTheme = (): ThemeContextState => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
