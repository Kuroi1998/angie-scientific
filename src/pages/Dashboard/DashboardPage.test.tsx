import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { UserProfile, UserProgress } from '../../data/educational/models';
import { DashboardContent } from './DashboardPage';

const profile: UserProfile = {
  activeTheme: 'default',
  globalSoundEnabled: true,
  id: 'ada',
  learningLevel: 'discovery',
  mascotEnabled: true,
  mascotSoundEnabled: true,
  reducedMotion: false,
  username: 'Ada',
};

const progress: UserProgress = {
  completedQuests: ['q1'],
  discoveredElements: ['H', 'He', 'Li', 'Be', 'B', 'C'],
  experiencePoints: 620,
  solvedRiddles: ['r1'],
  successfulReactions: ['H2O'],
  unlockedBadges: ['b1', 'b2'],
  userId: 'ada',
};

afterEach(() => {
  cleanup();
});

describe('DashboardContent', () => {
  it('renders progress and recent activity', () => {
    render(
      <DashboardContent
        onNavigate={vi.fn()}
        profile={profile}
        progress={progress}
      />,
    );

    expect(screen.getByText('Bienvenue, Ada')).toBeInTheDocument();
    expect(screen.getByText('620 XP')).toBeInTheDocument();
    expect(screen.getByText('6/118')).toBeInTheDocument();
    expect(screen.getByText('Niveau 3 vers 4')).toBeInTheDocument();
    expect(screen.getByText('b2')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('navigates from primary recommendations', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(
      <DashboardContent
        onNavigate={onNavigate}
        profile={profile}
        progress={progress}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Explorer les elements' }));
    await user.click(screen.getByRole('button', { name: 'Lancer un quiz' }));
    await user.click(screen.getByRole('button', { name: 'Preparer une reaction' }));

    expect(onNavigate).toHaveBeenCalledWith('table');
    expect(onNavigate).toHaveBeenCalledWith('quiz');
    expect(onNavigate).toHaveBeenCalledWith('fusion');
  });

  it('shows an empty state when no rewards exist yet', () => {
    render(
      <DashboardContent
        onNavigate={vi.fn()}
        profile={profile}
        progress={{
          ...progress,
          discoveredElements: [],
          unlockedBadges: [],
        }}
      />,
    );

    expect(screen.getByText('Aucune recompense recente')).toBeInTheDocument();
  });
});
