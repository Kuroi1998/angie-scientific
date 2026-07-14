import { ErrorBoundary } from '../components/ErrorBoundary/ErrorBoundary';
import type { ElementType } from '../components/PeriodicTable/TableGrid';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import {
  FusionCore,
  PeriodicTableLayout,
  PhysChemLab,
  QuantumVisualizer,
  QuizMode,
  UserCenter,
  VirtualLab,
} from './lazyModules';
import type { TabType } from './appTypes';
import { useLanguage } from '../hooks/useLanguage';

interface ActiveModuleProps {
  activeTab: TabType;
  onAddToFusion: (element: ElementType) => void;
  reactant1: string | null;
  reactant2: string | null;
  setActiveTab: (tab: TabType) => void;
  setReactant1: (value: string | null) => void;
  setReactant2: (value: string | null) => void;
}

export function ActiveModule({
  activeTab,
  onAddToFusion,
  reactant1,
  reactant2,
  setActiveTab,
  setReactant1,
  setReactant2,
}: ActiveModuleProps) {
  const { t } = useLanguage('navigation');
  const { t: tc } = useLanguage('common');
  if (activeTab === 'home') {
    return <DashboardPage onNavigate={setActiveTab} />;
  }
  if (activeTab === 'profile') {
    return <UserCenter initialSection="profile" />;
  }
  if (activeTab === 'table') {
    return <PeriodicTableLayout onAddToFusion={onAddToFusion} />;
  }
  if (activeTab === 'fusion') {
    return (
      <ErrorBoundary
        label={t('routes.fusion.label')}
        titlePrefix={tc('errorBoundary.titlePrefix')}
        retryLabel={tc('errorBoundary.retryLabel')}
        onNavigateHome={() => setActiveTab('home')}
        resetKey="fusion"
      >
        <FusionCore
          selectedReactant1={reactant1}
          selectedReactant2={reactant2}
          setSelectedReactant1={setReactant1}
          setSelectedReactant2={setReactant2}
        />
      </ErrorBoundary>
    );
  }
  if (activeTab === 'quantum') {
    return (
      <ErrorBoundary
        label={t('routes.quantum.label')}
        titlePrefix={tc('errorBoundary.titlePrefix')}
        retryLabel={tc('errorBoundary.retryLabel')}
        onNavigateHome={() => setActiveTab('home')}
        resetKey="quantum"
      >
        <QuantumVisualizer />
      </ErrorBoundary>
    );
  }
  if (activeTab === 'physchem') {
    return (
      <ErrorBoundary
        label={t('routes.physchem.label')}
        titlePrefix={tc('errorBoundary.titlePrefix')}
        retryLabel={tc('errorBoundary.retryLabel')}
        onNavigateHome={() => setActiveTab('home')}
        resetKey="physchem"
      >
        <PhysChemLab />
      </ErrorBoundary>
    );
  }
  if (activeTab === 'virtuallab') {
    return (
      <ErrorBoundary
        label={t('routes.virtuallab.label')}
        titlePrefix={tc('errorBoundary.titlePrefix')}
        retryLabel={tc('errorBoundary.retryLabel')}
        onNavigateHome={() => setActiveTab('home')}
        resetKey="virtuallab"
      >
        <VirtualLab />
      </ErrorBoundary>
    );
  }
  if (activeTab === 'quests') return <UserCenter initialSection="album" />;
  return (
    <ErrorBoundary
      label={t('routes.quiz.label')}
      titlePrefix={tc('errorBoundary.titlePrefix')}
      retryLabel={tc('errorBoundary.retryLabel')}
      onNavigateHome={() => setActiveTab('home')}
      resetKey="quiz"
    >
      <QuizMode />
    </ErrorBoundary>
  );
}
