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
import { Grid, Flame, Zap, Beaker, Globe, Trophy, FlaskConical } from 'lucide-react';
import './styles/theme.css';
import './styles/animations.css';

type TabType = 'table' | 'fusion' | 'quantum' | 'physchem' | 'virtuallab' | 'quests';

const AppContent: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('table');
  const [selectedElement, setSelectedElement] = useState<ElementType | null>(null);

  // Fusion Reactant slots managed at App level so elements can be added from the grid!
  const [reactant1, setReactant1] = useState<string | null>(null);
  const [reactant2, setReactant2] = useState<string | null>(null);

  const toggleLanguage = () => {
    if (language === 'fr') setLanguage('es');
    else setLanguage('fr');
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
    style: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 40px'
    }
  },
    // Welcome Screen locks UI until language is chosen
    React.createElement(WelcomeModal, null),

    // Dashboard Header
    React.createElement('header', {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
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
      )
    ),

    // Tab Navigation Bar
    React.createElement('div', {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '24px'
      }
    },
      ([
        { id: 'table', label: t('nav.table'), icon: Grid, color: 'var(--neon-cyan)', glow: 'var(--glow-cyan)' },
        { id: 'fusion', label: t('nav.fusion'), icon: Flame, color: 'var(--neon-purple)', glow: 'var(--glow-purple)' },
        { id: 'quantum', label: t('nav.quantum'), icon: Zap, color: 'var(--neon-magenta)', glow: 'var(--glow-magenta)' },
        { id: 'physchem', label: t('nav.physchem'), icon: Beaker, color: 'var(--neon-yellow)', glow: 'var(--glow-yellow)' },
        { id: 'virtuallab', label: language === 'fr' ? 'Labo Virtuel' : 'Lab Virtual', icon: FlaskConical, color: 'var(--neon-orange)', glow: 'var(--glow-orange)' },
        { id: 'quests', label: language === 'fr' ? 'Quêtes' : 'Misiones', icon: Trophy, color: 'var(--neon-green)', glow: 'var(--glow-green)' }
      ] as const).map(tab => {
        const active = activeTab === tab.id;
        const Icon = tab.icon;
        return React.createElement('button', {
          key: tab.id,
          onClick: () => setActiveTab(tab.id),
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
      })
    ),

    // Active Viewport Tab Content
    React.createElement('main', { style: { flex: '1' } },
      activeTab === 'table' && React.createElement(TableGrid, {
        onSelectElement: (el) => setSelectedElement(el),
        onAddToFusion: handleAddToFusion
      }),
      activeTab === 'fusion' && React.createElement(FusionCore, {
        selectedReactant1: reactant1,
        selectedReactant2: reactant2,
        setSelectedReactant1: setReactant1,
        setSelectedReactant2: setReactant2
      }),
      activeTab === 'quantum' && React.createElement(QuantumVisualizer, null),
      activeTab === 'physchem' && React.createElement(PhysChemLab, null),
      activeTab === 'virtuallab' && React.createElement(VirtualLab, null),
      activeTab === 'quests' && React.createElement(QuestSystem, null)
    ),

    // Details Modal popup for single element properties
    selectedElement && React.createElement(DetailModal, {
      element: selectedElement,
      onClose: () => setSelectedElement(null),
      onAddToFusion: handleAddToFusion
    }),

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
  return React.createElement(LanguageProvider, null,
    React.createElement(AppContent, null)
  );
}
