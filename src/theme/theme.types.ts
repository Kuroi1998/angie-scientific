export type ThemeId = 
  | 'light'
  | 'dark'
  | 'system'
  | 'scientific-night'
  | 'laboratory'
  | 'high-contrast';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  type: 'light' | 'dark' | 'auto';
  isPremium?: boolean;
}

export interface ThemeContextState {
  theme: ThemeId;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeId) => void;
  availableThemes: ThemeConfig[];
}
