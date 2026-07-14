import type { UserProfile, UserProgress } from '../../data/educational/models';
import { ELEMENT_TOTAL, XP_PER_LEVEL } from '../../pages/Dashboard/dashboardModel';

export interface UserMetrics {
  badgeCount: number;
  discoveredCount: number;
  elementPercent: number;
  level: number;
  nextLevelXp: number;
  questCount: number;
  reactionCount: number;
  riddleCount: number;
  username: string;
  xp: number;
  xpInLevel: number;
}

export function getUserMetrics(
  profile: UserProfile | null,
  progress: UserProgress | null,
): UserMetrics {
  const xp = progress?.experiencePoints ?? 0;
  const xpInLevel = xp % XP_PER_LEVEL;
  const discoveredCount = progress?.discoveredElements.length ?? 0;
  return {
    badgeCount: progress?.unlockedBadges.length ?? 0,
    discoveredCount,
    elementPercent: (discoveredCount / ELEMENT_TOTAL) * 100,
    level: Math.floor(xp / XP_PER_LEVEL) + 1,
    nextLevelXp: XP_PER_LEVEL - xpInLevel,
    questCount: progress?.completedQuests.length ?? 0,
    reactionCount: progress?.successfulReactions.length ?? 0,
    riddleCount: progress?.solvedRiddles.length ?? 0,
    username: profile?.username ?? 'Scientist',
    xp,
    xpInLevel,
  };
}

export function latestItems(items: string[] | undefined, max = 6) {
  return [...(items ?? [])].slice(-max).reverse();
}
