import type { UserProfile, UserProgress } from '../../data/educational/models';

export const ELEMENT_TOTAL = 118;
export const XP_PER_LEVEL = 250;

export interface DashboardMetrics {
  badgeCount: number;
  discoveredCount: number;
  elementPercent: number;
  level: number;
  nextLevelXp: number;
  questCount: number;
  reactionCount: number;
  solvedRiddleCount: number;
  username: string;
  xp: number;
  xpInLevel: number;
  xpPercent: number;
}

export function getDashboardMetrics(
  profile: UserProfile | null,
  progress: UserProgress | null,
): DashboardMetrics {
  const xp = progress?.experiencePoints ?? 0;
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpInLevel = xp % XP_PER_LEVEL;
  const discoveredCount = progress?.discoveredElements.length ?? 0;
  const elementPercent = (discoveredCount / ELEMENT_TOTAL) * 100;
  return {
    badgeCount: progress?.unlockedBadges.length ?? 0,
    discoveredCount,
    elementPercent,
    level,
    nextLevelXp: XP_PER_LEVEL - xpInLevel,
    questCount: progress?.completedQuests.length ?? 0,
    reactionCount: progress?.successfulReactions.length ?? 0,
    solvedRiddleCount: progress?.solvedRiddles.length ?? 0,
    username: profile?.username ?? 'Scientist',
    xp,
    xpInLevel,
    xpPercent: (xpInLevel / XP_PER_LEVEL) * 100,
  };
}

export function getRecentBadges(progress: UserProgress | null) {
  return (progress?.unlockedBadges ?? []).slice(-3).reverse();
}

export function getRecentDiscoveries(progress: UserProgress | null) {
  return (progress?.discoveredElements ?? []).slice(-6).reverse();
}
