import type { TabType } from '../../../app/appTypes';

export interface AngieSituation {
  currentTab: TabType;
  language: 'fr' | 'es';
  theme: string;
  learningLevel: string | undefined;
  discoveredElementsCount: number;
  successfulReactionsCount: number;
  solvedRiddlesCount: number;
  unlockedBadgesCount: number;
  completedQuestsCount: number;
  experiencePoints: number;
  isFirstVisit: boolean;
  sessionStartedAt: number;
  mascotEnabled: boolean;
  reducedMotion: boolean;
}
