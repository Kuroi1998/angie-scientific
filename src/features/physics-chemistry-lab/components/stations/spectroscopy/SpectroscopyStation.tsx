import React from 'react';
import { useSpectroscopyState } from './hooks/useSpectroscopyState';
import { emissionDatabase, absorptionDatabase } from './data/spectroscopyDatabase';
import { SpectroscopyHeader } from './components/SpectroscopyHeader';
import { ModeSelector } from './components/ModeSelector';
import { ElementSelector } from './components/ElementSelector';
import { PhotonInfoPanel } from './components/PhotonInfoPanel';
import { EmissionSpectrumChart } from './charts/EmissionSpectrumChart';
import { AbsorptionSpectrumChart } from './charts/AbsorptionSpectrumChart';
import { useLanguage } from '../../../../../hooks/useLanguage';

export const SpectroscopyStation: React.FC = () => {
  const {
    mode, setMode,
    emissionId, setEmissionId,
    absorptionId, setAbsorptionId,
    hoveredX, setHoveredX,
    photonInfo
  } = useSpectroscopyState();
  const { t } = useLanguage('lab');

  const isEmission = mode === 'EMISSION';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '24px', overflowY: 'auto', paddingRight: '8px' }}>
      <SpectroscopyHeader />
      
      <ModeSelector mode={mode} onModeChange={(m) => { setMode(m); setHoveredX(null); }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(400px, 2fr)', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Controls & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'var(--as-surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--as-border-inverse)' }}>
            <ElementSelector 
              mode={mode} 
              selectedId={isEmission ? emissionId : absorptionId} 
              onSelect={isEmission ? setEmissionId : setAbsorptionId} 
            />
          </div>

          <div style={{ background: 'var(--as-surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--as-border-inverse)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontFamily: 'var(--as-font-title)', color: 'var(--text-primary)' }}>
              {t('spectroscopy.analyzerTitle')}
            </h3>
            <PhotonInfoPanel mode={mode} photonInfo={photonInfo} />
          </div>
        </div>

        {/* Right Column: Spectrum Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {isEmission ? (
            <EmissionSpectrumChart 
              element={emissionDatabase[emissionId]} 
              hoveredWavelength={hoveredX} 
              onHover={setHoveredX} 
            />
          ) : (
            <AbsorptionSpectrumChart 
              molecule={absorptionDatabase[absorptionId]} 
              hoveredWavenumber={hoveredX} 
              onHover={setHoveredX} 
            />
          )}
        </div>

      </div>
    </div>
  );
};
