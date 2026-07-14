import { ChevronRight, Gauge, Sparkles } from 'lucide-react';
import { Badge, Button } from '../design-system';
import type {
  AppRouteItem,
  AppShellLabels,
  AppShellStats,
} from './AppShell.types';
import { useLanguage } from '../hooks/useLanguage';

export function AngieDock({
  actionLabel,
  onOpen,
}: {
  actionLabel: string;
  onOpen: () => void;
}) {
  const { t } = useLanguage('navigation');
  return (
    <section className="as-shell-angie" aria-label="Angie">
      <Sparkles size={18} aria-hidden="true" />
      <div>
        <strong>Angie</strong>
        <p>{t('angieDesc')}</p>
      </div>
      <Button onClick={onOpen} size="sm" variant="soft">
        {actionLabel}
      </Button>
    </section>
  );
}

export function MobileNav<TId extends string>({
  activeRouteId,
  onRouteChange,
  routes,
}: {
  activeRouteId: TId;
  onRouteChange: (routeId: TId) => void;
  routes: AppRouteItem<TId>[];
}) {
  const { t } = useLanguage('navigation');
  return (
    <nav className="as-shell-mobile-nav" aria-label={t('mobileNavigation')}>
      {routes.map((route) => {
        const Icon = route.icon;
        return (
          <button
            aria-current={activeRouteId === route.id ? 'page' : undefined}
            className={activeRouteId === route.id ? 'is-active' : undefined}
            key={route.id}
            onClick={() => onRouteChange(route.id)}
            type="button"
          >
            <Icon size={18} />
            <span>{route.shortLabel}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function ShellStatus<TId extends string>({
  activeRoute,
  labels,
  stats,
}: {
  activeRoute: AppRouteItem<TId>;
  labels: AppShellLabels;
  stats: AppShellStats;
}) {
  const { t } = useLanguage('navigation');
  return (
    <footer className="as-shell-statusbar">
      <span>
        <Gauge size={14} aria-hidden="true" />
        {labels.labStatus}
      </span>
      <ChevronRight size={14} aria-hidden="true" />
      <span>{activeRoute.shortLabel}</span>
      <Badge tone="info">{stats.xp} XP</Badge>
      <Badge tone="success">{stats.discoveredCount} {t('statsElements')}</Badge>
      <Badge tone="warning">{stats.badgeCount} {t('statsBadges')}</Badge>
      <span>{stats.soundEnabled ? t('audioActive') : t('audioMuted')}</span>
      <span>{stats.motionReduced ? t('motionReduced') : stats.themeLabel}</span>
    </footer>
  );
}
