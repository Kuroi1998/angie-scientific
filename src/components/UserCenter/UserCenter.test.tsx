import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '../../hooks/useLanguage';
import { UserCenter } from './UserCenter';
import type { UserCenterSection } from './userCenterData';

const themeState = vi.hoisted(() => ({
  availableThemes: [],
  resolvedTheme: 'light',
  setTheme: vi.fn(),
  theme: 'light',
}));

const userState = vi.hoisted(() => ({
  addDiscoveredElement: vi.fn(),
  addExperience: vi.fn(),
  addSuccessfulReaction: vi.fn(),
  equipTheme: vi.fn(),
  loading: false,
  profile: {
    activeTheme: 'light',
    globalSoundEnabled: true,
    id: 'u1',
    learningLevel: 'discovery',
    mascotEnabled: true,
    mascotSoundEnabled: true,
    reducedMotion: false,
    username: 'Ada',
  },
  progress: {
    completedQuests: ['halogens'],
    discoveredElements: ['H', 'He', 'O'],
    experiencePoints: 620,
    solvedRiddles: ['r1'],
    successfulReactions: ['H2O'],
    unlockedBadges: ['b1'],
    unlockedThemes: ['light', 'dark', 'system', 'high-contrast'],
    userId: 'u1',
  },
  saveProfile: vi.fn(),
  solveRiddle: vi.fn(),
  unlockBadge: vi.fn(),
  unlockTheme: vi.fn(),
}));

vi.mock('../useUserProgress', () => ({
  useUserProgress: () => userState,
}));

vi.mock('../../theme/hooks/useTheme', () => ({
  useTheme: () => themeState,
}));

afterEach(cleanup);

beforeEach(() => {
  vi.clearAllMocks();
});

function renderCenter(initialSection: UserCenterSection = 'profile') {
  render(
    <LanguageProvider>
      <UserCenter initialSection={initialSection} />
    </LanguageProvider>,
  );
}

describe('UserCenter', () => {
  it('renders profile metrics and saves profile edits', async () => {
    const user = userEvent.setup();
    renderCenter();

    expect(screen.getByText(/Profil et progression de Ada/i)).toBeInTheDocument();
    await user.clear(screen.getByLabelText('Nom du profil'));
    await user.type(screen.getByLabelText('Nom du profil'), 'Marie');
    await user.click(screen.getByRole('button', { name: /Enregistrer/i }));

    expect(userState.saveProfile).toHaveBeenCalledWith({
      learningLevel: 'discovery',
      username: 'Marie',
    });
  });

  it('toggles audio preferences', async () => {
    const user = userEvent.setup();
    renderCenter('preferences');

    await user.click(screen.getByRole('switch', { name: /Effets sonores globaux/i }));
    expect(userState.saveProfile).toHaveBeenCalledWith({ globalSoundEnabled: false });
  });

  it('opens the theme section and equips an unlocked theme', async () => {
    const user = userEvent.setup();
    renderCenter();

    await user.click(screen.getByRole('tab', { name: /Thèmes/i }));
    const highContrastCard = screen.getByText('Contraste Renforcé').closest('article')!;
    await user.click(within(highContrastCard).getByRole('button', { name: /Équiper/i }));

    expect(themeState.setTheme).toHaveBeenCalledWith('high-contrast');
  });
});
