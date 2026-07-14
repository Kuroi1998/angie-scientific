import React, { useState } from 'react';
import { useQuantumState } from '../hooks/useQuantumState';
import { OrbitalControls } from './OrbitalControls';
import { OrbitalCanvas3D } from './OrbitalCanvas3D';
import { OrbitalInfoPanel } from './OrbitalInfoPanel';
import { OrbitalComparison } from './OrbitalComparison';
import { HeisenbergExperiment } from './HeisenbergExperiment';
import { HybridizationModule } from './HybridizationModule';
import { ScientificPanel } from '../../../components/shared/ScientificPanel';
import { useLanguage } from '../../../hooks/useLanguage';
import '../styles/quantum.css';

type ActiveTab = 'orbital' | 'compare' | 'heisenberg' | 'hybrid';

export const QuantumVisualizerHub: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>('orbital');
  
  const {
    state, currentOrbitalDef, viewMode, 
    updateQuantumNumbers, setViewMode
  } = useQuantumState();

  const tabs: { id: ActiveTab, label: string }[] = [
    { id: 'orbital', label: t('hub.tabs.orbital', { ns: 'quantum' }) },
    { id: 'compare', label: t('hub.tabs.compare', { ns: 'quantum' }) },
    { id: 'heisenberg', label: t('hub.tabs.heisenberg', { ns: 'quantum' }) },
    { id: 'hybrid', label: t('hub.tabs.hybrid', { ns: 'quantum' }) }
  ];

  return (
    <div className="quantum-hub-container">
      {/* Navigation Interne */}
      <nav className="quantum-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`quantum-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Zone de contenu */}
      <div className="quantum-content-area">
        {activeTab === 'orbital' && (
          <div className="quantum-grid-layout">
            <div className="quantum-col-controls">
              <ScientificPanel title={t('hub.quantumParams', { ns: 'quantum' })} variant="primary">
                <OrbitalControls
                  n={state.n} l={state.l} m={state.m} viewMode={viewMode}
                  onUpdateNumbers={updateQuantumNumbers}
                  onSetViewMode={setViewMode}
                />
              </ScientificPanel>
              
              <div style={{ marginTop: '20px' }}>
                <OrbitalInfoPanel orbital={currentOrbitalDef} />
              </div>
            </div>

            <div className="quantum-col-visualizer">
              <ScientificPanel title={t('hub.visualizer', { ns: 'quantum' })} variant="glass" className="h-full">
                <div className="quantum-visualizer-wrapper">
                  <OrbitalCanvas3D n={state.n} l={state.l} m={state.m} viewMode={viewMode} />
                </div>
              </ScientificPanel>
            </div>
          </div>
        )}

        {activeTab === 'compare' && (
          <OrbitalComparison />
        )}

        {activeTab === 'heisenberg' && (
          <HeisenbergExperiment />
        )}

        {activeTab === 'hybrid' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <HybridizationModule />
          </div>
        )}
      </div>
    </div>
  );
};
