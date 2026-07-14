import { Bot } from 'lucide-react';
import { NavigationItem } from '../design-system';
import type { AppRouteItem, AppShellLabels } from './AppShell.types';

export function ShellBrand({ labels }: { labels: AppShellLabels }) {
  return (
    <div className="as-shell-brand">
      <span className="as-shell-brand-mark" aria-hidden="true">
        <Bot size={26} />
      </span>
      <div>
        <strong>{labels.appTitle}</strong>
        <span>{labels.appSubtitle}</span>
      </div>
    </div>
  );
}

interface ShellNavigationProps<TId extends string> {
  activeRouteId: TId;
  focusRouteAt: (index: number) => void;
  onRouteChange: (routeId: TId) => void;
  routes: AppRouteItem<TId>[];
}

export function ShellNavigation<TId extends string>({
  activeRouteId,
  focusRouteAt,
  onRouteChange,
  routes,
}: ShellNavigationProps<TId>) {
  return (
    <nav className="as-shell-nav" aria-label="Application">
      {routes.map((route, index) => {
        const Icon = route.icon;
        return (
          <NavigationItem
            active={activeRouteId === route.id}
            badge={route.badge}
            icon={<Icon size={18} />}
            id={`app-route-${route.id}`}
            key={route.id}
            label={
              <span className="as-shell-nav-label">
                <strong>{route.label}</strong>
                <small>{route.description}</small>
              </span>
            }
            onClick={() => onRouteChange(route.id)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                focusRouteAt(index + 1);
              }
              if (event.key === 'ArrowUp') {
                event.preventDefault();
                focusRouteAt(index - 1);
              }
            }}
          />
        );
      })}
    </nav>
  );
}
