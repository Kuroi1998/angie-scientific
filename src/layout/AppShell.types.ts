import type { LucideIcon } from 'lucide-react';

export interface AppRouteItem<TId extends string = string> {
  badge?: string;
  description: string;
  icon: LucideIcon;
  id: TId;
  label: string;
  shortLabel: string;
}

export interface AppShellStats {
  badgeCount: number;
  discoveredCount: number;
  isLoading: boolean;
  motionReduced: boolean;
  soundEnabled: boolean;
  themeLabel: string;
  username: string;
  xp: number;
}

export interface AppShellLabels {
  angieAction: string;
  appSubtitle: string;
  appTitle: string;
  breadcrumbsRoot: string;
  labStatus: string;
  menu: string;
  mobileNavigation: string;
  notifications: string;
  profile: string;
  quickAccess: string;
  settings: string;
  skipToContent: string;
  themeStore: string;
  userMenu: string;
}
