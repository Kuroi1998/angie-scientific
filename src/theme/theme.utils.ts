export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyThemeAttribute = (theme: string, resolvedTheme: 'light' | 'dark') => {
  if (typeof document !== 'undefined') {
    const appliedTheme = theme === 'system' ? resolvedTheme : theme;
    document.documentElement.setAttribute('data-theme', appliedTheme);
  }
};
