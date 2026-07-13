import React, { useState, Suspense } from 'react';
import { LanguageProvider, useLanguage } from './hooks/useLanguage';
import { WelcomeModal } from './components/WelcomeModal';
import type { ElementType } from './components/PeriodicTable/TableGrid';
import { DetailModal } from './components/ElementCard/DetailModal';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { Grid, Flame, Zap, Beaker, Trophy, FlaskConical, Loader2, GraduationCap, Palette, Settings } from 'lucide-react';
import { UserProgressProvider } from './components/UserProgressProvider';
import { MascotProvider } from './components/Mascot/MascotContext';
import { AngieMascot } from './components/Mascot/AngieMascot';
import { LoginScreen } from './components/LoginScreen';
import { ReloadPrompt } from './components/ReloadPrompt';
import { SettingsModal } from './components/SettingsModal';
import { ThemeStoreModal } from './components/ThemeStoreModal';
import { TransitionWrapper } from './components/TransitionWrapper';
import { getUserId } from './api/progress';
import { AudioManager } from './services/Audio/AudioManager';
import { MusicManager } from './services/Audio/MusicManager';
import { useUserProgress } from './components/UserProgressProvider';
import './styles/theme.css';
import './styles/animations.css';
import './styles/responsive.css';

// Lazy load heavy modules
const TableGrid = React.lazy(() => import('./components/PeriodicTable/TableGrid').then(m => ({ default: m.TableGrid })));
const FusionCore = React.lazy(() => import('./components/ReactionSimulator/FusionCore').then(m => ({ default: m.FusionCore })));
const QuantumVisualizer = React.lazy(() => import('./components/QuantumVisualizer/QuantumVisualizer').then(m => ({ default: m.QuantumVisualizer })));
const PhysChemLab = React.lazy(() => import('./components/PhysicsChemistry/PhysChemLab').then(m => ({ default: m.PhysChemLab })));
const VirtualLab = React.lazy(() => import('./components/VirtualLab/VirtualLab').then(m => ({ default: m.VirtualLab })));
const DiscoveryAlbum = React.lazy(() => import('./components/Gamification/DiscoveryAlbum').then(m => ({ default: m.DiscoveryAlbum })));
const QuizMode = React.lazy(() => import('./components/Gamification/QuizMode').then(m => ({ default: m.QuizMode })));

type TabType = 'table' | 'fusion' | 'quantum' | 'physchem' | 'virtuallab' | 'quests' | 'quiz';

const TAB_IDS: TabType[] = ['table', 'fusion', 'quantum', 'physchem', 'virtuallab', 'quests', 'quiz'];
const isTabType = (raw: unknown): raw is TabType =>
  typeof raw === 'string' && (TAB_IDS as string[]).includes(raw);

const LoadingFallback = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', color: 'var(--neon-cyan)' }}>
    <Loader2 className="animate-spin" size={32} style={{ marginBottom: '16px' }} />
    <span style={{ fontFamily: 'var(--font-mono)' }}>CHARGEMENT...</span>
  </div>
);

import { useTutorial } from './hooks/useTutorial';

const AppContent: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useLocalStorageState<TabType>('activeTab', 'table', { validate: isTabType });
  const [selectedElement, setSelectedElement] = useState<ElementType | null>(null);
  useTutorial(activeTab);

  // Fusion Reactant slots managed at App level so elements can be added from the grid
  const [reactant1, setReactant1] = useState<string | null>(null);
  const [reactant2, setReactant2] = useState<string | null>(null);
  
  const [isThemeStoreOpen, setIsThemeStoreOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const { profile } = useUserProgress();

  React.useEffect(() => {
    const isEnabled = profile?.globalSoundEnabled ?? true;
    AudioManager.getInstance().setEnabled(isEnabled);
    MusicManager.getInstance().setEnabled(isEnabled);
    
    if (profile?.activeTheme) {
      document.documentElement.setAttribute('data-theme', profile.activeTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'default');
    }

    if (profile?.reducedMotion) {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    } else {
      document.documentElement.removeAttribute('data-reduced-motion');
    }
  }, [profile?.globalSoundEnabled, profile?.activeTheme, profile?.reducedMotion]);

  const handleAddToFusion = (el: ElementType) => {
    if (!reactant1) {
      setReactant1(el.s);
      setActiveTab('fusion');
    } else if (!reactant2 && reactant1 !== el.s) {
      setReactant2(el.s);
      setActiveTab('fusion');
    } else {
      // Slot 1 is full, slot 2 is full, replace slot 2
      setReactant2(el.s);
      setActiveTab('fusion');
    }
  };

  const navTabs = [
    { id: 'table', label: t('nav.table'), icon: Grid, color: 'var(--neon-cyan)', glow: 'var(--glow-cyan)' },
    { id: 'fusion', label: t('nav.fusion'), icon: Flame, color: 'var(--neon-purple)', glow: 'var(--glow-purple)' },
    { id: 'quantum', label: t('nav.quantum'), icon: Zap, color: 'var(--neon-magenta)', glow: 'var(--glow-magenta)' },
    { id: 'physchem', label: t('nav.physchem'), icon: Beaker, color: 'var(--neon-yellow)', glow: 'var(--glow-yellow)' },
    { id: 'virtuallab', label: language === 'fr' ? 'Labo Virtuel' : 'Lab Virtual', icon: FlaskConical, color: 'var(--neon-orange)', glow: 'var(--glow-orange)' },
    { id: 'quests', label: language === 'fr' ? 'Quêtes' : 'Misiones', icon: Trophy, color: 'var(--neon-green)', glow: 'var(--glow-green)' },
    { id: 'quiz', label: 'Quiz', icon: GraduationCap, color: 'var(--neon-magenta)', glow: 'var(--glow-magenta)' }
  ] as const;

  const focusNavTabAt = (index: number) => {
    const wrapped = (index + navTabs.length) % navTabs.length;
    const nextTab = navTabs[wrapped];
    setActiveTab(nextTab.id as TabType);
    requestAnimationFrame(() => {
      document.getElementById(`main-tab-${nextTab.id}`)?.focus();
    });
  };

  return (
    <div className="app-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', minWidth: 0, maxWidth: '100vw' }}>
      <WelcomeModal />

      {/* Dashboard Header */}
      <header className="app-header">
        <div>
          <h1 className="app-title">ANGIE SCIENTIFIC</h1>
          <p className="app-subtitle">{t('welcome.subtitle')}</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-outline hover-lift" onClick={() => setIsThemeStoreOpen(true)} title={language === 'fr' ? 'Thèmes' : 'Temas'} style={{ padding: '8px', color: 'var(--neon-yellow)', borderColor: 'var(--neon-yellow)' }} aria-label={language === 'fr' ? 'Ouvrir les thèmes' : 'Abrir temas'}>
            <Palette size={14} />
          </button>
          
          <button className="btn btn-outline hover-lift" onClick={() => setIsSettingsOpen(true)} title={language === 'fr' ? 'Paramètres' : 'Configuración'} style={{ padding: '8px' }} aria-label={language === 'fr' ? 'Ouvrir les paramètres' : 'Abrir configuración'}>
            <Settings size={14} />
          </button>
        </div>
      </header>

      {/* Tab Navigation Bar */}
      <div className="main-tab-nav" role="tablist" aria-label={language === 'fr' ? 'Sections principales' : 'Secciones principales'}>
        {navTabs.map((tab, i) => {
          const active = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`main-tab-${tab.id}`}
              role="tab"
              aria-selected={active}
              aria-controls="main-tabpanel"
              tabIndex={active ? 0 : -1}
              onClick={() => {
                AudioManager.getInstance().playClick();
                setActiveTab(tab.id as TabType);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') { e.preventDefault(); focusNavTabAt(i + 1); }
                else if (e.key === 'ArrowLeft') { e.preventDefault(); focusNavTabAt(i - 1); }
              }}
              className="main-tab-btn hover-lift"
              style={{
                background: active ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                borderColor: active ? tab.color : 'var(--glass-border)',
                color: active ? '#fff' : 'var(--text-secondary)',
                boxShadow: active ? tab.glow : 'none'
              }}
            >
              <Icon size={15} style={{ color: active ? tab.color : 'inherit' }} />
              {tab.label.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Active Viewport Tab Content */}
      <main id="main-tabpanel" role="tabpanel" aria-labelledby={`main-tab-${activeTab}`} style={{ flex: '1', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TransitionWrapper activeKey={activeTab}>
          <Suspense fallback={<LoadingFallback />}>
            {activeTab === 'table' && (
              <TableGrid onSelectElement={(el) => {
                AudioManager.getInstance().playClick();
                setSelectedElement(el);
              }} onAddToFusion={handleAddToFusion} />
            )}
            {activeTab === 'fusion' && (
              <ErrorBoundary label="Simulateur de Fusion" resetKey="fusion" onNavigateHome={() => setActiveTab('table')}>
                <FusionCore
                  selectedReactant1={reactant1}
                  selectedReactant2={reactant2}
                  setSelectedReactant1={setReactant1}
                  setSelectedReactant2={setReactant2}
                />
              </ErrorBoundary>
            )}
            {activeTab === 'quantum' && (
              <ErrorBoundary label="Visualiseur Quantique" resetKey="quantum" onNavigateHome={() => setActiveTab('table')}>
                <QuantumVisualizer />
              </ErrorBoundary>
            )}
            {activeTab === 'physchem' && (
              <ErrorBoundary label="Laboratoire Physique-Chimie" resetKey="physchem" onNavigateHome={() => setActiveTab('table')}>
                <PhysChemLab />
              </ErrorBoundary>
            )}
            {activeTab === 'virtuallab' && (
              <ErrorBoundary label="Laboratoire Virtuel" resetKey="virtuallab" onNavigateHome={() => setActiveTab('table')}>
                <VirtualLab />
              </ErrorBoundary>
            )}
            {activeTab === 'quests' && (
              <DiscoveryAlbum />
            )}
            {activeTab === 'quiz' && (
              <ErrorBoundary label="Mode Quiz" resetKey="quiz" onNavigateHome={() => setActiveTab('table')}>
                <QuizMode />
              </ErrorBoundary>
            )}
          </Suspense>
        </TransitionWrapper>
      </main>

      {/* Details Modal popup */}
      {selectedElement && (
        <ErrorBoundary label={`Fiche Élément (${selectedElement.s})`} resetKey={selectedElement.s} onNavigateHome={() => setSelectedElement(null)} homeLabel="Fermer la fiche">
          <DetailModal
            element={selectedElement}
            onClose={() => setSelectedElement(null)}
            onAddToFusion={handleAddToFusion}
          />
        </ErrorBoundary>
      )}

      {/* Telemetry Footer */}
      <footer style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
        // ANGIE QUANTUM LABS // ALL SIMULATIONS CALIBRATED FOR STP // ENERGETIC INTEGRITY SECURED
      </footer>

      <ReloadPrompt />
      {isThemeStoreOpen && <ThemeStoreModal onClose={() => setIsThemeStoreOpen(false)} />}
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
};

export default function App() {
  const userId = getUserId();

  if (!userId) {
    return (
      <LanguageProvider>
        <LoginScreen />
      </LanguageProvider>
    );
  }

  return (
    <ErrorBoundary label="Angie Scientific" description="L'application a rencontré une erreur inattendue. Vos données enregistrées (langue, progression) sont conservées. Rechargez pour repartir sur une base saine." onNavigateHome={() => window.location.reload()} homeLabel="Recharger l'application">
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
