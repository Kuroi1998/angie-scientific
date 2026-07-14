import { Bell, Settings, UserCircle } from 'lucide-react';
import {
  Breadcrumb,
  Button,
  Dropdown,
  IconButton,
} from '../design-system';
import { ThemeToggle } from '../theme/components/ThemeToggle';
import type {
  AppRouteItem,
  AppShellLabels,
  AppShellStats,
} from './AppShell.types';

interface ShellHeaderProps<TId extends string> {
  activeRoute: AppRouteItem<TId>;
  labels: AppShellLabels;
  onOpenSettings: () => void;
  onOpenThemeStore: () => void;
  onOpenProfile: () => void;
  quickRoutes: AppRouteItem<TId>[];
  selectRoute: (routeId: TId) => void;
  stats: AppShellStats;
}

export function ShellHeader<TId extends string>({
  activeRoute,
  labels,
  onOpenSettings,
  onOpenThemeStore,
  onOpenProfile,
  quickRoutes,
  selectRoute,
  stats,
}: ShellHeaderProps<TId>) {
  return (
    <>
      <div className="as-shell-heading">
        <Breadcrumb
          items={[
            { label: labels.breadcrumbsRoot },
            { label: activeRoute.label },
          ]}
        />
        <h1 id="app-shell-page-title">{activeRoute.label}</h1>
        <p>{activeRoute.description}</p>
      </div>
      <ShellActions
        labels={labels}
        onOpenSettings={onOpenSettings}
        onOpenThemeStore={onOpenThemeStore}
        onOpenProfile={onOpenProfile}
        quickRoutes={quickRoutes}
        selectRoute={selectRoute}
        stats={stats}
      />
    </>
  );
}

function ShellActions<TId extends string>({
  labels,
  onOpenSettings,
  onOpenThemeStore,
  onOpenProfile,
  quickRoutes,
  selectRoute,
  stats,
}: Omit<ShellHeaderProps<TId>, 'activeRoute'>) {
  return (
    <div className="as-shell-actions">
      <div className="as-shell-shortcuts" aria-label={labels.quickAccess}>
        {quickRoutes.map((route) => {
          const Icon = route.icon;
          return (
            <Button
              iconLeft={<Icon size={16} />}
              key={route.id}
              onClick={() => selectRoute(route.id)}
              size="sm"
              variant="ghost"
            >
              {route.shortLabel}
            </Button>
          );
        })}
      </div>
      <Button
        iconLeft={<Bell size={17} />}
        aria-label={labels.notifications}
        variant="ghost"
        size="sm"
      >
        {stats.isLoading ? labels.sync : labels.ok}
      </Button>
      <ThemeToggle onOpenThemeStore={onOpenThemeStore} />
      <IconButton
        icon={<Settings size={18} />}
        label={labels.settings}
        onClick={onOpenSettings}
        variant="ghost"
      />
      <Dropdown
        variant="ghost"
        label={
          <span className="as-shell-user-label">
            <UserCircle size={17} />
            {stats.username}
          </span>
        }
        items={[
          { label: labels.profile, onSelect: onOpenProfile },
          { label: labels.settings, onSelect: onOpenSettings },
          { label: labels.themeStore, onSelect: onOpenThemeStore },
        ]}
      />
    </div>
  );
}
