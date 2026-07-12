import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { OrbitalMap } from './OrbitalMap';
import { Heisenberg } from './Heisenberg';
import { Hybridization } from './Hybridization';
import { Zap, Eye, Compass } from 'lucide-react';

type SubTabType = 'orbitals' | 'heisenberg' | 'hybrid';

export const QuantumVisualizer: React.FC = () => {
  const { t } = useLanguage();
  const [subTab, setSubTab] = useState<SubTabType>('orbitals');

  return React.createElement('div', { className: 'quantum-visualizer-container animate-fade-in', style: { display: 'flex', flexDirection: 'column', gap: '20px' } },
    
    // Sub-tab selectors
    React.createElement('div', {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '10px',
        justifyContent: 'center'
      }
    },
      ([
        { id: 'orbitals', label: t('quantum.orbital'), icon: Eye },
        { id: 'heisenberg', label: t('quantum.heisenberg'), icon: Zap },
        { id: 'hybrid', label: t('quantum.hybrid'), icon: Compass }
      ] as const).map(tab => {
        const active = subTab === tab.id;
        const Icon = tab.icon;
        return React.createElement('button', {
          key: tab.id,
          onClick: () => setSubTab(tab.id),
          style: {
            padding: '10px 20px',
            background: active ? 'rgba(157, 0, 255, 0.05)' : 'transparent',
            border: 'none',
            borderBottom: active ? '2px solid var(--neon-purple)' : '2px solid transparent',
            color: active ? '#fff' : 'var(--text-secondary)',
            fontFamily: 'var(--font-title)',
            fontSize: '11px',
            fontWeight: active ? 'bold' : 'normal',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            boxShadow: active ? '0 4px 10px rgba(157, 0, 255, 0.02)' : 'none'
          }
        },
          React.createElement(Icon, { size: 13, style: { color: active ? 'var(--neon-purple)' : 'inherit' } }),
          tab.label.toUpperCase()
        );
      })
    ),

    // Sub-tab Content viewport
    React.createElement('div', {
      style: {
        minHeight: '400px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }
    },
      subTab === 'orbitals' && React.createElement('div', { className: 'tab-content', style: { width: '100%', maxWidth: '500px' } }, 
        React.createElement(OrbitalMap, null)
      ),
      subTab === 'heisenberg' && React.createElement('div', { className: 'tab-content', style: { width: '100%', maxWidth: '600px' } }, 
        React.createElement(Heisenberg, null)
      ),
      subTab === 'hybrid' && React.createElement('div', { className: 'tab-content', style: { width: '100%', maxWidth: '500px' } }, 
        React.createElement(Hybridization, null)
      )
    )
  );
};
