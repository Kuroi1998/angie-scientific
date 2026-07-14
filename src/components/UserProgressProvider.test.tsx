import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../theme/ThemeProvider';
import { useTheme } from '../theme/hooks/useTheme';
import { UserProgressProvider } from './UserProgressProvider';

const apiState = vi.hoisted(() => ({
  profile: {
    id: 'u1',
    username: 'u1',
    activeTheme: 'dark',
    learningLevel: 'discovery' as const,
    mascotEnabled: true,
    mascotSoundEnabled: true,
    globalSoundEnabled: true,
    reducedMotion: false,
  },
  progress: {
    userId: 'u1',
    experiencePoints: 0,
    unlockedBadges: [],
    discoveredElements: [],
    successfulReactions: [],
    solvedRiddles: [],
    completedQuests: [],
  },
  updateProfile: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../api/progress', () => ({
  getUserId: () => 'u1',
  fetchUserData: async () => ({ profile: apiState.profile, progress: apiState.progress }),
  updateProfile: (userId: string, updates: unknown) => apiState.updateProfile(userId, updates),
  updateProgress: vi.fn().mockResolvedValue(undefined),
  syncWithCloud: vi.fn().mockResolvedValue(true),
}));

function mockMatchMedia() {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  );
}

function ThemeProbe() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={() => setTheme('scientific-night')}>set-scientific-night</button>
    </div>
  );
}

describe('UserProgressProvider theme sync', () => {
  beforeEach(() => {
    localStorage.clear();
    mockMatchMedia();
    apiState.updateProfile.mockClear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('reconciles the applied theme to the profile activeTheme once it loads', async () => {
    render(
      <ThemeProvider>
        <UserProgressProvider>
          <ThemeProbe />
        </UserProgressProvider>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('theme').textContent).toBe('dark');
    });
  });

  it('persists a theme change made via setTheme back to the profile', async () => {
    render(
      <ThemeProvider>
        <UserProgressProvider>
          <ThemeProbe />
        </UserProgressProvider>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('theme').textContent).toBe('dark');
    });

    act(() => {
      screen.getByText('set-scientific-night').click();
    });

    await waitFor(() => {
      expect(apiState.updateProfile).toHaveBeenCalledWith('u1', { activeTheme: 'scientific-night' });
    });
  });
});
