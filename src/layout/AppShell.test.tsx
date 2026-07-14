import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Beaker, Grid } from 'lucide-react';
import { AppShell } from './AppShell';
import type {
  AppRouteItem,
  AppShellLabels,
  AppShellStats,
} from './AppShell.types';

type TestRoute = 'table' | 'fusion';

const routes: AppRouteItem<TestRoute>[] = [
  {
    id: 'table',
    label: 'Table',
    shortLabel: 'Table',
    description: 'Explore elements.',
    icon: Grid,
  },
  {
    id: 'fusion',
    label: 'Fusion',
    shortLabel: 'Fusion',
    description: 'Combine reactants.',
    icon: Beaker,
  },
];

const labels: AppShellLabels = {
  angieAction: 'Ask Angie',
  appSubtitle: 'Research station',
  appTitle: 'Angie Scientific',
  breadcrumbsRoot: 'Station',
  labStatus: 'Lab ready',
  menu: 'Open menu',
  mobileNavigation: 'Mobile navigation',
  notifications: 'Notifications',
  profile: 'Profile',
  quickAccess: 'Quick access',
  settings: 'Settings',
  skipToContent: 'Skip to content',
  themeStore: 'Themes',
  userMenu: 'User menu',
};

const stats: AppShellStats = {
  badgeCount: 2,
  discoveredCount: 12,
  isLoading: false,
  motionReduced: false,
  soundEnabled: true,
  themeLabel: 'default',
  username: 'Ada',
  xp: 420,
};

afterEach(() => {
  cleanup();
});

function renderShell(activeRouteId: TestRoute = 'table') {
  return {
    onAngieOpen: vi.fn(),
    onOpenSettings: vi.fn(),
    onOpenThemeStore: vi.fn(),
    onRouteChange: vi.fn(),
    ...render(
      <AppShell
        activeRouteId={activeRouteId}
        labels={labels}
        onAngieOpen={vi.fn()}
        onOpenSettings={vi.fn()}
        onOpenThemeStore={vi.fn()}
        onRouteChange={vi.fn()}
        routes={routes}
        stats={stats}
      >
        <p>Active content</p>
      </AppShell>,
    ),
  };
}

describe('AppShell', () => {
  it('renders the active route context and content', () => {
    renderShell();

    expect(screen.getByRole('heading', { name: 'Table' })).toBeInTheDocument();
    expect(screen.getByText('Active content')).toBeInTheDocument();
    expect(screen.getByText('420 XP')).toBeInTheDocument();
  });

  it('opens the mobile navigation drawer', async () => {
    const user = userEvent.setup();
    renderShell();

    await user.click(screen.getByLabelText('Open menu'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Mobile navigation')).toBeInTheDocument();
  });

  it('moves route focus with arrow keys', () => {
    const onRouteChange = vi.fn();
    render(
      <AppShell
        activeRouteId="table"
        labels={labels}
        onAngieOpen={vi.fn()}
        onOpenSettings={vi.fn()}
        onOpenThemeStore={vi.fn()}
        onRouteChange={onRouteChange}
        routes={routes}
        stats={stats}
      >
        <p>Active content</p>
      </AppShell>,
    );

    fireEvent.keyDown(document.getElementById('app-route-table')!, {
      key: 'ArrowDown',
    });

    expect(onRouteChange).toHaveBeenCalledWith('fusion');
  });

  it('calls shell actions', async () => {
    const user = userEvent.setup();
    const onAngieOpen = vi.fn();
    const onOpenSettings = vi.fn();
    const onOpenThemeStore = vi.fn();
    render(
      <AppShell
        activeRouteId="table"
        labels={labels}
        onAngieOpen={onAngieOpen}
        onOpenSettings={onOpenSettings}
        onOpenThemeStore={onOpenThemeStore}
        onRouteChange={vi.fn()}
        routes={routes}
        stats={stats}
      >
        <p>Active content</p>
      </AppShell>,
    );

    await user.click(screen.getByText('Ask Angie'));
    await user.click(screen.getByLabelText('Settings'));
    await user.click(screen.getByRole('button', { name: 'Changer le thème' }));
    await user.click(screen.getByRole('menuitem', { name: 'Ouvrir le Theme Store' }));

    expect(onAngieOpen).toHaveBeenCalled();
    expect(onOpenSettings).toHaveBeenCalled();
    expect(onOpenThemeStore).toHaveBeenCalled();
  });
});
