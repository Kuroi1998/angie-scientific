import React, { Suspense, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getUserId } from './api/progress';
import { ActiveModule } from './app/ActiveModule';
import { isTabType } from './app/appTypes';
import type { TabType } from './app/appTypes';
import { DesignSystemDemo } from './app/lazyModules';
import {
  useShellLabels,
  useShellRoutes,
  useShellStats,
} from './app/useAppShellConfig';
import { AppNotifications } from './components/AppNotifications';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { LoginScreen } from './components/LoginScreen';
import { AngieMascot } from './components/Mascot/AngieMascot';
import { MascotProvider } from './components/Mascot/MascotContext';
import { useMascot } from './components/Mascot/useMascot';
import type { ElementType } from './components/PeriodicTable/TableGrid';
import { ReloadPrompt } from './components/ReloadPrompt';
import { SettingsModal } from './components/SettingsModal';
import { ThemeStoreModal } from './components/ThemeStoreModal';
import { TransitionWrapper } from './components/TransitionWrapper';
import {
  UserProgressProvider,
} from './components/UserProgressProvider';
import { useUserProgress } from './components/useUserProgress';
import { WelcomeModal } from './components/WelcomeModal';
import { LanguageProvider, useLanguage } from './hooks/useLanguage';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { useTutorial } from './hooks/useTutorial';
import { AppShell } from './layout/AppShell';
import { AudioManager } from './services/Audio/AudioManager';
import { MusicManager } from './services/Audio/MusicManager';
import './app/app.css';
import './styles/animations.css';
import './styles/responsive.css';

const LoadingFallback = () => {
  const { t } = useLanguage();
  return (
    <div className="app-loading-fallback">
      <Loader2 className="animate-spin" size={32} />
      <span>{t('loading')}</span>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useLocalStorageState<TabType>(
    'activeTab',
    'home',
    { validate: isTabType },
  );
  const [reactant1, setReactant1] = useState<string | null>(null);
  const [reactant2, setReactant2] = useState<string | null>(null);
  const [isThemeStoreOpen, setIsThemeStoreOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { profile } = useUserProgress();
  const { showMessage } = useMascot();
  const shellLanguage = language ?? 'fr';
  const navTabs = useShellRoutes(shellLanguage, t);
  const shellLabels = useShellLabels(shellLanguage, t);
  const shellStats = useShellStats();

  useTutorial(activeTab);
  React.useEffect(() => {
    const isEnabled = profile?.globalSoundEnabled ?? true;
    AudioManager.getInstance().setEnabled(isEnabled);
    MusicManager.getInstance().setEnabled(isEnabled);
    if (profile?.reducedMotion) {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    } else {
      document.documentElement.removeAttribute('data-reduced-motion');
    }
  }, [profile?.globalSoundEnabled, profile?.reducedMotion]);

  const handleAddToFusion = (element: ElementType) => {
    if (!reactant1) setReactant1(element.s);
    else if (!reactant2 && reactant1 !== element.s) setReactant2(element.s);
    else setReactant2(element.s);
    setActiveTab('fusion');
  };

  const handleRouteChange = (tab: TabType) => {
    AudioManager.getInstance().playClick();
    setActiveTab(tab);
  };

  const handleAngieOpen = () => {
    showMessage(
      t('angie.ready'),
      5000,
      'encouraging',
    );
  };

  return (
    <div className="app-root">
      <WelcomeModal />
      <AppShell
        activeRouteId={activeTab}
        labels={shellLabels}
        onAngieOpen={handleAngieOpen}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenThemeStore={() => setIsThemeStoreOpen(true)}
        onRouteChange={handleRouteChange}
        routes={navTabs}
        stats={shellStats}
      >
        <TransitionWrapper activeKey={activeTab}>
          <Suspense fallback={<LoadingFallback />}>
            <ActiveModule
              activeTab={activeTab}
              onAddToFusion={handleAddToFusion}
              reactant1={reactant1}
              reactant2={reactant2}
              setActiveTab={setActiveTab}
              setReactant1={setReactant1}
              setReactant2={setReactant2}
            />
          </Suspense>
        </TransitionWrapper>
      </AppShell>
      <AppNotifications />
      <ReloadPrompt />
      {isThemeStoreOpen && (
        <ThemeStoreModal onClose={() => setIsThemeStoreOpen(false)} />
      )}
      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  const { t } = useLanguage();
  const showDesignSystem = new URLSearchParams(window.location.search).has(
    'design-system',
  );
  if (showDesignSystem) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <DesignSystemDemo />
      </Suspense>
    );
  }

  if (!getUserId()) {
    return (
      <LanguageProvider>
        <LoginScreen />
      </LanguageProvider>
    );
  }

  return (
    <ErrorBoundary
      description={t('errorBoundary.description')}
      homeLabel={t('errorBoundary.reload')}
      label={t('errorBoundary.title')}
      onNavigateHome={() => window.location.reload()}
    >
      <UserProgressProvider>
        <MascotProvider>
          <LanguageProvider>
            <AppContent />
            <AngieMascot />
          </LanguageProvider>
        </MascotProvider>
      </UserProgressProvider>
    </ErrorBoundary>
  );
}
