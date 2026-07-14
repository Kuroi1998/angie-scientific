import { describe, it, expect, beforeEach } from 'vitest';
import { getStoredTheme, setStoredTheme } from './theme.storage';
import { DEFAULT_THEME_ID, THEME_STORAGE_KEY } from './theme.constants';

describe('theme.storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns the default theme when nothing is stored', () => {
    expect(getStoredTheme()).toBe(DEFAULT_THEME_ID);
  });

  it('returns a validly stored theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    expect(getStoredTheme()).toBe('dark');
  });

  it('falls back to the default theme for an unknown stored value', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'not-a-real-theme');
    expect(getStoredTheme()).toBe(DEFAULT_THEME_ID);
  });

  it('persists a theme choice to localStorage', () => {
    setStoredTheme('scientific-night');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('scientific-night');
  });
});
