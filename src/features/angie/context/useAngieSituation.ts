import { useMemo, useRef } from 'react';
import type { TabType } from '../../../app/appTypes';
import { useLanguage } from '../../../hooks/useLanguage';
import { useTheme } from '../../../theme/hooks/useTheme';
import { useUserProgress } from '../../../components/useUserProgress';
import type { AngieSituation } from './situation.types';

export const useAngieSituation = (currentTab: TabType): AngieSituation => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { profile, progress } = useUserProgress();
  const sessionStartedAtRef = useRef(Date.now());

  return useMemo<AngieSituation>(() => ({
    currentTab,
    language: language === 'es' ? 'es' : 'fr',
    theme,
    learningLevel: profile?.learningLevel,
    discoveredElementsCount: progress?.discoveredElements.length ?? 0,
    successfulReactionsCount: progress?.successfulReactions.length ?? 0,
    solvedRiddlesCount: progress?.solvedRiddles.length ?? 0,
    unlockedBadgesCount: progress?.unlockedBadges.length ?? 0,
    completedQuestsCount: progress?.completedQuests.length ?? 0,
    experiencePoints: progress?.experiencePoints ?? 0,
    isFirstVisit: (progress?.discoveredElements.length ?? 0) === 0 && (progress?.experiencePoints ?? 0) === 0,
    sessionStartedAt: sessionStartedAtRef.current,
    mascotEnabled: profile?.mascotEnabled !== false,
    reducedMotion: profile?.reducedMotion === true,
  }), [currentTab, language, theme, profile, progress]);
};
