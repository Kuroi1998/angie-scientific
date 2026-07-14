import React, { useState, useEffect, useMemo } from 'react';
import { ThemeContext } from './ThemeContext';
import type { ThemeId } from './theme.types';
import { THEMES } from './theme.constants';
import { getStoredTheme, setStoredTheme } from './theme.storage';
import { getSystemTheme, applyThemeAttribute } from './theme.utils';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeId>(getStoredTheme);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(getSystemTheme);

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    // Add event listener (compat for older browsers with addListener)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Compute resolved theme
  const resolvedTheme = useMemo<'light' | 'dark'>(() => {
    const config = THEMES[theme];
    if (!config) return 'light';
    
    if (config.type === 'auto') {
      return systemTheme;
    }
    return config.type as 'light' | 'dark';
  }, [theme, systemTheme]);

  // Apply theme to DOM
  useEffect(() => {
    applyThemeAttribute(theme, resolvedTheme);
    
    // Dispatch a custom event so non-React code (like canvas charts) can listen to theme changes
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme, resolvedTheme } }));
  }, [theme, resolvedTheme]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'angie-scientific-theme' && e.newValue) {
        setThemeState(e.newValue as ThemeId);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
    setStoredTheme(newTheme);
  };

  const contextValue = useMemo(() => ({
    theme,
    resolvedTheme,
    setTheme,
    availableThemes: Object.values(THEMES)
  }), [theme, resolvedTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
