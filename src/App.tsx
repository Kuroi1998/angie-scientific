import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './hooks/useLanguage';
import { WelcomeModal } from './components/WelcomeModal';
import { TableGrid } from './components/PeriodicTable/TableGrid';
import type { ElementType } from './components/PeriodicTable/TableGrid';
import { DetailModal } from './components/ElementCard/DetailModal';
import { FusionCore } from './components/ReactionSimulator/FusionCore';
import { QuantumVisualizer } from './components/QuantumVisualizer/QuantumVisualizer';
import { PhysChemLab } from './components/PhysicsChemistry/PhysChemLab';
import { VirtualLab } from './components/VirtualLab/VirtualLab';
import { QuestSystem } from './components/Gamification/QuestSystem';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { clearAllStoredValues } from './utils/localStorage';
import { Grid, Flame, Zap, Beaker, Globe, Trophy, FlaskConical, RotateCcw } from 'lucide-react';
import './styles/theme.css';
import './styles/animations.css';
import './styles/responsive.css';

type TabType = 'table' | 'fusion' | 'quantum' | 'physchem' | 'virtuallab' | 'quests';

const TAB_IDS: TabType[] = ['table', 'fusion', 'quantum', 'physchem', 'virtuallab', 'quests'];
const isTabType = (raw: unknown): raw is TabType =>
  typeof raw === 'string' && (TAB_IDS as string[]).includes(raw);

const AppContent: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useLocalStorageState<TabType>('activeTab', 'table', { validate: isTabType });
  const [selectedElement, setSelectedElement] = useState<ElementType | null>(null);

  // Fusion Reactant slots managed at App level so elements can be added from the grid!
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

  return React.createElement('div', {
    className: 'app-root',
    style: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      maxWidth: '100vw'
    }
  },
    // Welcome Screen locks UI until language is chosen
    React.createElement(WelcomeModal, null),

    // Dashboard Header
    React.createElement('header', {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid var(--glass-border)',
        paddingBottom: '20px',
        marginBottom: '24px'
      }
    },
      React.createElement('div', null,
        React.createElement('h1', {
          style: {
            fontFamily: 'var(--font-title)',
            fontSize: '22px',
            fontWeight: '900',
            letterSpacing: '2px',
            color: '#fff',
            textShadow: '0 0 10px rgba(0, 243, 255, 0.4)'
          }
        }, "ANGIE SCIENTIFIC"),
        React.createElement('p', {
          style: {
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-neon)',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }
        }, t('welcome.subtitle'))
      ),

      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' } },
        // Language Switcher
        React.createElement('button', {
          onClick: toggleLanguage,
          style: {
            padding: '8px 16px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--neon-cyan)',
            borderRadius: '4px',
            color: '#fff',
            fontFamily: 'var(--font-title)',
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--glow-cyan)',
            transition: 'all 0.2s'
          }
        },
          React.createElement(Globe, { size: 14 }),
          language === 'fr' ? "FRANÇAIS" : "ESPAÑOL"
        ),

        // Reset local data
        React.createElement('button', {
          onClick: handleResetAllData,
          title: language === 'fr'
            ? 'Réinitialiser la langue, la progression des quêtes et l\'historique de recherche enregistrés localement'
            : 'Restablecer el idioma, el progreso de misiones y el historial de búsqueda guardados localmente',
          style: {
            padding: '8px 12px',
            background: 'transparent',
            border: '1px solid rgba(255, 0, 127, 0.4)',
            borderRadius: '4px',
            color: 'var(--neon-magenta)',
            fontFamily: 'var(--font-title)',
            fontSize: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }
        },
          React.createElement(RotateCcw, { size: 12 }),
          language === 'fr' ? 'RÉINITIALISER' : 'RESTABLECER'
        )
      )
    ),

    // Tab Navigation Bar
    React.createElement('div', {
      role: 'tablist',
      'aria-label': language === 'fr' ? 'Sections principales' : 'Secciones principales',
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '24px'
      }
    },
      (() => {
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
          setActiveTab(nextTab.id);
          requestAnimationFrame(() => {
            document.getElementById(`main-tab-${nextTab.id}`)?.focus();
          });
        };

        return navTabs.map((tab, i) => {
          const active = activeTab === tab.id;
          const Icon = tab.icon;
          return React.createElement('button', {
            key: tab.id,
            id: `main-tab-${tab.id}`,
            role: 'tab',
            type: 'button',
            'aria-selected': active,
            'aria-controls': 'main-tabpanel',
            tabIndex: active ? 0 : -1,
            onClick: () => setActiveTab(tab.id),
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === 'ArrowRight') { e.preventDefault(); focusNavTabAt(i + 1); }
              else if (e.key === 'ArrowLeft') { e.preventDefault(); focusNavTabAt(i - 1); }
            },
            style: {
              padding: '12px 24px',
              background: active ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
              border: `1px solid ${active ? tab.color : 'var(--glass-border)'}`,
              borderRadius: '6px',
              color: active ? '#fff' : 'var(--text-secondary)',
              fontFamily: 'var(--font-title)',
              fontSize: '12px',
              fontWeight: 'bold',
              letterSpacing: '1px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: active ? tab.glow : 'none',
              transition: 'all 0.2s'
            }
          },
            React.createElement(Icon, { size: 15, style: { color: active ? tab.color : 'inherit' } }),
            tab.label.toUpperCase()
          );
        });
      })()
    ),

    // Active Viewport Tab Content
    React.createElement('main', {
      id: 'main-tabpanel',
      role: 'tabpanel',
      'aria-labelledby': `main-tab-${activeTab}`,
      style: { flex: '1', minWidth: 0 }
    },
      activeTab === 'table' && React.createElement(TableGrid, {
        onSelectElement: (el) => setSelectedElement(el),
        onAddToFusion: handleAddToFusion
      }),
      activeTab === 'fusion' && React.createElement(ErrorBoundary, {
        label: 'Simulateur de Fusion',
        resetKey: 'fusion',
        onNavigateHome: () => setActiveTab('table')
      },
        React.createElement(FusionCore, {
          selectedReactant1: reactant1,
          selectedReactant2: reactant2,
          setSelectedReactant1: setReactant1,
          setSelectedReactant2: setReactant2
        })
      ),
      activeTab === 'quantum' && React.createElement(ErrorBoundary, {
        label: 'Visualiseur Quantique',
        resetKey: 'quantum',
        onNavigateHome: () => setActiveTab('table')
      }, React.createElement(QuantumVisualizer, null)),
      activeTab === 'physchem' && React.createElement(ErrorBoundary, {
        label: 'Laboratoire Physique-Chimie',
        resetKey: 'physchem',
        onNavigateHome: () => setActiveTab('table')
      }, React.createElement(PhysChemLab, null)),
      activeTab === 'virtuallab' && React.createElement(ErrorBoundary, {
        label: 'Laboratoire Virtuel',
        resetKey: 'virtuallab',
        onNavigateHome: () => setActiveTab('table')
      }, React.createElement(VirtualLab, null)),
      activeTab === 'quests' && React.createElement(QuestSystem, null)
    ),

    // Details Modal popup for single element properties
    selectedElement && React.createElement(ErrorBoundary, {
      label: `Fiche Élément (${selectedElement.s})`,
      resetKey: selectedElement.s,
      onNavigateHome: () => setSelectedElement(null),
      homeLabel: 'Fermer la fiche'
    },
      React.createElement(DetailModal, {
        element: selectedElement,
        onClose: () => setSelectedElement(null),
        onAddToFusion: handleAddToFusion
      })
    ),

    // Telemetry Footer
    React.createElement('footer', {
      style: {
        marginTop: '40px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: '16px',
        textAlign: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        color: 'var(--text-muted)'
      }
    },
      "// ANGIE QUANTUM LABS // ALL SIMULATIONS CALIBRATED FOR STP // ENERGETIC INTEGRITY SECURED"
    )
  );
};

export default function App() {
  return React.createElement(ErrorBoundary, {
    label: 'Angie Scientific',
    description: 'L\'application a rencontré une erreur inattendue. Vos données enregistrées (langue, progression) sont conservées. Rechargez pour repartir sur une base saine.',
    onNavigateHome: () => window.location.reload(),
    homeLabel: 'Recharger l\'application'
  },
    React.createElement(LanguageProvider, null,
      React.createElement(AppContent, null)
    )
  );
}
