import React from 'react';
import {
  Beaker,
  Flame,
  FlaskConical,
  GraduationCap,
  Grid,
  Home,
  Trophy,
  UserCircle,
  Zap,
} from 'lucide-react';
import { useUserProgress } from '../components/useUserProgress';
import type {
  AppRouteItem,
  AppShellLabels,
  AppShellStats,
} from '../layout/AppShell.types';
import type { TabType } from './appTypes';

export function useShellRoutes(_language: string, t: (key: string, options?: any) => string) {
  // @ts-ignore: language parameter kept for backward compatibility with calling components
  const { progress } = useUserProgress();
  return React.useMemo<AppRouteItem<TabType>[]>(() => [
    {
      id: 'home',
      label: t('routes.home.label', { ns: 'navigation' }),
      shortLabel: t('routes.home.shortLabel', { ns: 'navigation' }),
      description: t('routes.home.description', { ns: 'navigation' }),
      icon: Home,
    },
    {
      id: 'profile',
      label: t('routes.profile.label', { ns: 'navigation' }),
      shortLabel: t('routes.profile.shortLabel', { ns: 'navigation' }),
      description: t('routes.profile.description', { ns: 'navigation' }),
      icon: UserCircle,
    },
    {
      id: 'table',
      label: t('routes.table.label', { ns: 'navigation' }),
      shortLabel: t('routes.table.shortLabel', { ns: 'navigation' }),
      description: t('routes.table.description', { ns: 'navigation' }),
      icon: Grid,
    },
    {
      id: 'fusion',
      label: t('routes.fusion.label', { ns: 'navigation' }),
      shortLabel: t('routes.fusion.shortLabel', { ns: 'navigation' }),
      description: t('routes.fusion.description', { ns: 'navigation' }),
      icon: Flame,
    },
    {
      id: 'quantum',
      label: t('routes.quantum.label', { ns: 'navigation' }),
      shortLabel: t('routes.quantum.shortLabel', { ns: 'navigation' }),
      description: t('routes.quantum.description', { ns: 'navigation' }),
      icon: Zap,
    },
    {
      id: 'physchem',
      label: t('routes.physchem.label', { ns: 'navigation' }),
      shortLabel: t('routes.physchem.shortLabel', { ns: 'navigation' }),
      description: t('routes.physchem.description', { ns: 'navigation' }),
      icon: Beaker,
    },
    {
      id: 'virtuallab',
      label: t('routes.virtuallab.label', { ns: 'navigation' }),
      shortLabel: t('routes.virtuallab.shortLabel', { ns: 'navigation' }),
      description: t('routes.virtuallab.description', { ns: 'navigation' }),
      icon: FlaskConical,
    },
    {
      id: 'quests',
      label: t('routes.quests.label', { ns: 'navigation' }),
      shortLabel: t('routes.quests.shortLabel', { ns: 'navigation' }),
      description: t('routes.quests.description', { ns: 'navigation' }),
      icon: Trophy,
      badge: progress?.completedQuests.length
        ? String(progress.completedQuests.length)
        : undefined,
    },
    {
      id: 'quiz',
      label: t('routes.quiz.label', { ns: 'navigation' }),
      shortLabel: t('routes.quiz.shortLabel', { ns: 'navigation' }),
      description: t('routes.quiz.description', { ns: 'navigation' }),
      icon: GraduationCap,
    },
  ], [progress?.completedQuests.length, t]);
}

export function useShellLabels(_language: string, t: (key: string, options?: any) => string): AppShellLabels {
  // @ts-ignore: language parameter kept for backward compatibility
  return React.useMemo(() => ({
    angieAction: t('angieAction', { ns: 'navigation' }),
    appSubtitle: t('welcome.subtitle'), // Uses default 'common' namespace
    appTitle: 'Angie Scientific',
    breadcrumbsRoot: t('breadcrumbsRoot', { ns: 'navigation' }),
    labStatus: t('labStatus', { ns: 'navigation' }),
    menu: t('menu', { ns: 'navigation' }),
    mobileNavigation: t('mobileNavigation', { ns: 'navigation' }),
    notifications: t('notifications', { ns: 'navigation' }),
    profile: t('profile', { ns: 'navigation' }),
    quickAccess: t('quickAccess', { ns: 'navigation' }),
    settings: t('settings', { ns: 'navigation' }),
    skipToContent: t('skipToContent', { ns: 'navigation' }),
    themeStore: t('themeStore', { ns: 'navigation' }),
    userMenu: t('userMenu', { ns: 'navigation' }),
  }), [t]);
}

export function useShellStats(): AppShellStats {
  const { loading, profile, progress } = useUserProgress();
  return React.useMemo(() => ({
    badgeCount: progress?.unlockedBadges.length ?? 0,
    discoveredCount: progress?.discoveredElements.length ?? 0,
    isLoading: loading,
    motionReduced: profile?.reducedMotion ?? false,
    soundEnabled: profile?.globalSoundEnabled ?? true,
    themeLabel: profile?.activeTheme ?? 'default',
    username: profile?.username ?? 'Scientist',
    xp: progress?.experiencePoints ?? 0,
  }), [loading, profile, progress]);
}
