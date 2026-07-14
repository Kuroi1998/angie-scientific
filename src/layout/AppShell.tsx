import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { Drawer, IconButton } from '../design-system';
import type {
  AppRouteItem,
  AppShellLabels,
  AppShellStats,
} from './AppShell.types';
import { ShellBrand, ShellNavigation } from './AppShellBrandNav';
import { ShellHeader } from './AppShellHeader';
import {
  AngieDock,
  MobileNav,
  ShellStatus,
} from './AppShellWidgets';
import './app-shell.css';
import './app-shell-responsive.css';

interface AppShellProps<TId extends string> {
  activeRouteId: TId;
  children: ReactNode;
  labels: AppShellLabels;
  onAngieOpen: () => void;
  onOpenSettings: () => void;
  onOpenThemeStore: () => void;
  onRouteChange: (routeId: TId) => void;
  routes: AppRouteItem<TId>[];
  stats: AppShellStats;
}

export function AppShell<TId extends string>({
  activeRouteId,
  children,
  labels,
  onAngieOpen,
  onOpenSettings,
  onOpenThemeStore,
  onRouteChange,
  routes,
  stats,
}: AppShellProps<TId>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeRoute = useMemo(
    () => routes.find((route) => route.id === activeRouteId) ?? routes[0],
    [activeRouteId, routes],
  );
  const quickRoutes = routes.filter((route) =>
    ['home', 'table', 'quiz'].includes(route.id),
  );
  const profileRoute = routes.find((route) => route.id === 'profile');

  const selectRoute = (routeId: TId) => {
    onRouteChange(routeId);
    setMobileMenuOpen(false);
  };

  const focusRouteAt = (index: number) => {
    const nextIndex = (index + routes.length) % routes.length;
    const nextRoute = routes[nextIndex];
    onRouteChange(nextRoute.id);
    requestAnimationFrame(() => {
      document.getElementById(`app-route-${nextRoute.id}`)?.focus();
    });
  };

  const openProfile = () => {
    if (profileRoute) selectRoute(profileRoute.id);
  };

  return (
    <div className="as-app-shell">
      <a className="as-skip-link" href="#app-main-content">
        {labels.skipToContent}
      </a>

      <aside className="as-shell-sidebar" aria-label={labels.mobileNavigation}>
        <ShellBrand labels={labels} />
        <ShellNavigation
          activeRouteId={activeRouteId}
          focusRouteAt={focusRouteAt}
          onRouteChange={selectRoute}
          routes={routes}
        />
        <AngieDock actionLabel={labels.angieAction} onOpen={onAngieOpen} />
      </aside>

      <div className="as-shell-main">
        <header className="as-shell-header">
          <IconButton
            className="as-shell-menu-button"
            icon={<Menu size={20} />}
            label={labels.menu}
            onClick={() => setMobileMenuOpen(true)}
            variant="outline"
          />
          <ShellHeader
            activeRoute={activeRoute}
            labels={labels}
            onOpenSettings={onOpenSettings}
            onOpenThemeStore={onOpenThemeStore}
            onOpenProfile={openProfile}
            quickRoutes={quickRoutes}
            selectRoute={selectRoute}
            stats={stats}
          />
        </header>

        <main
          aria-labelledby="app-shell-page-title"
          className="as-shell-content"
          id="app-main-content"
        >
          <section className="as-shell-stage">{children}</section>
        </main>

        <ShellStatus activeRoute={activeRoute} labels={labels} stats={stats} />
      </div>

      <MobileNav
        activeRouteId={activeRouteId}
        onRouteChange={selectRoute}
        routes={routes}
      />

      <Drawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title={labels.mobileNavigation}
      >
        <ShellNavigation
          activeRouteId={activeRouteId}
          focusRouteAt={focusRouteAt}
          onRouteChange={selectRoute}
          routes={routes}
        />
      </Drawer>
    </div>
  );
}
