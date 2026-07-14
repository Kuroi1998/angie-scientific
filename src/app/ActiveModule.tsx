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
        label="Simulateur de Fusion"
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
        label="Visualiseur Quantique"
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
        label="Laboratoire Physique-Chimie"
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
        label="Laboratoire Virtuel"
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
      label="Mode Quiz"
      onNavigateHome={() => setActiveTab('home')}
      resetKey="quiz"
    >
      <QuizMode />
    </ErrorBoundary>
  );
}
