import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from './ThemeProvider';
import { useTheme } from './hooks/useTheme';
import { THEME_STORAGE_KEY } from './theme.constants';

class MockMediaQueryList {
  matches: boolean;
  private listeners: Array<(e: MediaQueryListEvent) => void> = [];

  constructor(matches: boolean) {
    this.matches = matches;
  }

  addEventListener(_type: 'change', handler: (e: MediaQueryListEvent) => void) {
    this.listeners.push(handler);
  }

  removeEventListener(_type: 'change', handler: (e: MediaQueryListEvent) => void) {
    this.listeners = this.listeners.filter((l) => l !== handler);
  }

  emit(matches: boolean) {
    this.matches = matches;
    this.listeners.forEach((l) => l({ matches } as MediaQueryListEvent));
  }
}

let mockMql: MockMediaQueryList;

function mockMatchMedia(initialMatches: boolean) {
  mockMql = new MockMediaQueryList(initialMatches);
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mockMql));
}

function Probe() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button onClick={() => setTheme('dark')}>set-dark</button>
      <button onClick={() => setTheme('system')}>set-system</button>
      <button onClick={() => setTheme('scientific-night')}>set-scientific-night</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('resolves an explicit light theme and writes it to data-theme', async () => {
    mockMatchMedia(false);
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByText('set-dark'));

    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('resolves "system" to the OS preference and never writes "system" to data-theme', async () => {
    mockMatchMedia(true); // OS prefers dark
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByText('set-system'));

    expect(screen.getByTestId('theme').textContent).toBe('system');
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('keeps a concrete premium theme id in data-theme instead of collapsing to resolvedTheme', async () => {
    mockMatchMedia(false);
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByText('set-scientific-night'));

    expect(document.documentElement.getAttribute('data-theme')).toBe('scientific-night');
  });

  it('updates resolvedTheme when the OS preference changes while on "system"', async () => {
    mockMatchMedia(false);
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByText('set-system'));
    expect(screen.getByTestId('resolved').textContent).toBe('light');

    act(() => {
      mockMql.emit(true);
    });

    await waitFor(() => {
      expect(screen.getByTestId('resolved').textContent).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  it('persists theme changes to localStorage', async () => {
    mockMatchMedia(false);
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByText('set-dark'));

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('syncs theme across tabs via the storage event', async () => {
    mockMatchMedia(false);
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', { key: THEME_STORAGE_KEY, newValue: 'dark' }),
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('theme').textContent).toBe('dark');
    });
  });

  it('falls back to the default theme for an invalid stored value without throwing', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'not-a-real-theme');
    mockMatchMedia(false);

    expect(() =>
      render(
        <ThemeProvider>
          <Probe />
        </ThemeProvider>,
      ),
    ).not.toThrow();

    expect(screen.getByTestId('theme').textContent).toBe('system');
  });
});
