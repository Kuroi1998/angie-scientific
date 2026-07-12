import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { GasEquations } from './GasEquations';
import { KineticsEquilibrium } from './KineticsEquilibrium';
import { PhaseDiagram } from './PhaseDiagram';
import { Spectrometry } from './Spectrometry';
import { Beaker, Eye, Gauge, Compass } from 'lucide-react';

type SubTabType = 'gas' | 'kinetics' | 'phase' | 'spectrometry';

export const PhysChemLab: React.FC = () => {
  const { t } = useLanguage();
  const [subTab, setSubTab] = useState<SubTabType>('gas');

  return React.createElement('div', { className: 'physchem-lab-container animate-fade-in', style: { display: 'flex', flexDirection: 'column', gap: '20px' } },
    
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
        { id: 'gas', label: t('phys.gas'), icon: Gauge },
        { id: 'kinetics', label: t('phys.kinetics'), icon: Beaker },
        { id: 'phase', label: t('phys.phase'), icon: Compass },
        { id: 'spectrometry', label: t('phys.spectrometry'), icon: Eye }
      ] as const).map(tab => {
        const active = subTab === tab.id;
        const Icon = tab.icon;
        return React.createElement('button', {
          key: tab.id,
          onClick: () => setSubTab(tab.id),
          style: {
            padding: '10px 20px',
            background: active ? 'rgba(0, 243, 255, 0.05)' : 'transparent',
            border: 'none',
            borderBottom: active ? '2px solid var(--neon-cyan)' : '2px solid transparent',
            color: active ? '#fff' : 'var(--text-secondary)',
            fontFamily: 'var(--font-title)',
            fontSize: '11px',
            fontWeight: active ? 'bold' : 'normal',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            boxShadow: active ? '0 4px 10px rgba(0, 243, 255, 0.02)' : 'none'
          }
        },
          React.createElement(Icon, { size: 13, style: { color: active ? 'var(--neon-cyan)' : 'inherit' } }),
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
      subTab === 'gas' && React.createElement('div', { className: 'tab-content', style: { width: '100%', maxWidth: '700px' } }, 
        React.createElement(GasEquations, null)
      ),
      subTab === 'kinetics' && React.createElement('div', { className: 'tab-content', style: { width: '100%', maxWidth: '700px' } }, 
        React.createElement(KineticsEquilibrium, null)
      ),
      subTab === 'phase' && React.createElement('div', { className: 'tab-content', style: { width: '100%', maxWidth: '700px' } }, 
        React.createElement(PhaseDiagram, null)
      ),
      subTab === 'spectrometry' && React.createElement('div', { className: 'tab-content', style: { width: '100%', maxWidth: '700px' } }, 
        React.createElement(Spectrometry, null)
      )
    )
  );
};
