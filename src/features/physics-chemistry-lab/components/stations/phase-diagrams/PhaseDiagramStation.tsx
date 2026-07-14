import React from 'react';
import { usePhaseState } from './hooks/usePhaseState';
import { PhaseHeader } from './components/PhaseHeader';
import { SubstanceSelector } from './components/SubstanceSelector';
import { PhasePropertiesPanel } from './components/PhasePropertiesPanel';
import { PhaseSlider } from './controls/PhaseSlider';
import { PTDiagramChart } from './charts/PTDiagramChart';
import { MolecularPhaseSimulation } from './charts/MolecularPhaseSimulation';
import { useLanguage } from '../../../../../hooks/useLanguage';

export const PhaseDiagramStation: React.FC = () => {
  const {
    substanceId, substance, temperature, pressure, phase,
    changeSubstance, setTemperature, setPressure
  } = usePhaseState();
  const { t } = useLanguage('lab');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '24px', overflowY: 'auto', paddingRight: '8px' }}>
      <PhaseHeader />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(400px, 2fr)', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'var(--as-surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--as-border-inverse)' }}>
            <SubstanceSelector selectedId={substanceId} onSelect={changeSubstance} />
          </div>

          <div style={{ background: 'var(--as-surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--as-border-inverse)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontFamily: 'var(--as-font-title)', color: 'var(--text-primary)' }}>{t('phase.params.title')}</h3>
            
            <PhaseSlider
              label={t('phase.params.temperature')} symbol="T"
              value={temperature} min={substance.minT} max={substance.maxT} step={0.1} unit="K"
              onChange={setTemperature}
              accentColor="var(--as-accent-amber)"
            />

            <PhaseSlider
              label={t('phase.params.pressure')} symbol="P"
              value={pressure} min={substance.minP} max={substance.maxP} step={0.001} unit="bar"
              isLogScale={true}
              onChange={setPressure}
              accentColor="var(--as-accent-cyan)"
            />
          </div>
        </div>

        {/* Right Column: Graphs & Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <PhasePropertiesPanel substance={substance} phase={phase} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ background: 'var(--as-surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--as-border-inverse)' }}>
              <PTDiagramChart 
                substance={substance} 
                temperature={temperature} 
                pressure={pressure} 
                onPointChange={(t, p) => { setTemperature(t); setPressure(p); }} 
              />
            </div>
            <div style={{ background: 'var(--as-surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--as-border-inverse)' }}>
              <MolecularPhaseSimulation 
                phase={phase} 
                substance={substance} 
                temperature={temperature} 
                pressure={pressure} 
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
