import React, { useState, Suspense } from 'react';
import { LanguageProvider, useLanguage } from './hooks/useLanguage';
import { WelcomeModal } from './components/WelcomeModal';
import type { ElementType } from './components/PeriodicTable/TableGrid';
import { DetailModal } from './components/ElementCard/DetailModal';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { clearAllStoredValues } from './utils/localStorage';
import { Grid, Flame, Zap, Beaker, Globe, Trophy, FlaskConical, RotateCcw, Loader2 } from 'lucide-react';
import { UserProgressProvider } from './components/UserProgressProvider';
import { MascotProvider } from './components/Mascot/MascotContext';
import { AngieMascot } from './components/Mascot/AngieMascot';
import { LoginScreen } from './components/LoginScreen';
import { getUserId, removeUserId } from './api/progress';
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

type TabType = 'table' | 'fusion' | 'quantum' | 'physchem' | 'virtuallab' | 'quests';

const TAB_IDS: TabType[] = ['table', 'fusion', 'quantum', 'physchem', 'virtuallab', 'quests'];
const isTabType = (raw: unknown): raw is TabType =>
  typeof raw === 'string' && (TAB_IDS as string[]).includes(raw);

const LoadingFallback = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', color: 'var(--neon-cyan)' }}>
    <Loader2 className="animate-spin" size={32} style={{ marginBottom: '16px' }} />
    <span style={{ fontFamily: 'var(--font-mono)' }}>CHARGEMENT...</span>
  </div>
);

const AppContent: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useLocalStorageState<TabType>('activeTab', 'table', { validate: isTabType });
  const [selectedElement, setSelectedElement] = useState<ElementType | null>(null);

  // Fusion Reactant slots managed at App level so elements can be added from the grid
  const [reactant1, setReactant1] = useState<string | null>(null);
  const [reactant2, setReactant2] = useState<string | null>(null);

  const toggleLanguage = () => {
    if (language === 'fr') setLanguage('es');
    else setLanguage('fr');
  };

  const handleResetAllData = () => {
    const confirmed = window.confirm(
      language === 'fr'
        ? 'Réinitialiser toutes les données locales (langue, progression des quêtes, historique de recherche, expériences complétées) ? Cette action est irréversible.'
        : '¿Restablecer todos los datos locales (idioma, progreso de misiones, historial de búsqueda, experimentos completados)? Esta acción es irreversible.'
    );
    if (!confirmed) return;
    clearAllStoredValues();
    removeUserId();
    window.location.reload();
  };

  const handleLogout = () => {
    removeUserId();
    window.location.reload();
  };

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
    { id: 'quests', label: language === 'fr' ? 'Quêtes' : 'Misiones', icon: Trophy, color: 'var(--neon-green)', glow: 'var(--glow-green)' }
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
          <button className="btn btn-outline hover-lift" onClick={toggleLanguage}>
            <Globe size={14} />
            {language === 'fr' ? "FRANÇAIS" : "ESPAÑOL"}
          </button>

          <button className="btn btn-danger-outline hover-lift" onClick={handleLogout} title={language === 'fr' ? 'Se déconnecter' : 'Cerrar sesión'}>
            {language === 'fr' ? "DÉCONNEXION" : "SALIR"}
          </button>

          <button className="btn btn-danger-ghost hover-lift" onClick={handleResetAllData} title={language === 'fr' ? 'Réinitialiser la langue, la progression des quêtes et l\'historique de recherche enregistrés localement' : 'Restablecer el idioma, el progreso de misiones y el historial de búsqueda guardados localmente'}>
            <RotateCcw size={12} />
            {language === 'fr' ? 'RÉINITIALISER' : 'RESTABLECER'}
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
              onClick={() => setActiveTab(tab.id as TabType)}
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
      <main id="main-tabpanel" role="tabpanel" aria-labelledby={`main-tab-${activeTab}`} style={{ flex: '1', minWidth: 0 }}>
        <Suspense fallback={<LoadingFallback />}>
          {activeTab === 'table' && (
            <TableGrid onSelectElement={(el) => setSelectedElement(el)} onAddToFusion={handleAddToFusion} />
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
        </Suspense>
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
