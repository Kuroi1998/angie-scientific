import React from 'react';
import { useKineticsState } from './hooks/useKineticsState';
import { KineticsHeader } from './components/KineticsHeader';
import { ReactionSelector } from './components/ReactionSelector';
import { KineticsSlider } from './controls/KineticsSlider';
import { CatalystControl } from './components/CatalystControl';
import { KineticsResults } from './components/KineticsResults';
import { EquilibriumIndicator } from './components/EquilibriumIndicator';
import { ConcentrationChart } from './charts/ConcentrationChart';
import { EnergyProfileChart } from './charts/EnergyProfileChart';

export const KineticsStation: React.FC = () => {
  const { state, setVariable, reaction, result, history, resetSimulation, injectReactants } = useKineticsState();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '24px', overflowY: 'auto', paddingRight: '8px' }}>
      <KineticsHeader 
        state={state} 
        onTogglePause={() => setVariable('isPaused', !state.isPaused)}
        onReset={resetSimulation}
        onInject={injectReactants}
        onChangeSpeed={v => setVariable('simulationSpeed', v)}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(400px, 2fr)', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'var(--as-surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--as-border-inverse)' }}>
            <ReactionSelector selectedId={state.reactionId} onSelect={id => setVariable('reactionId', id)} />
          </div>

          <div style={{ background: 'var(--as-surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--as-border-inverse)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontFamily: 'var(--as-font-title)', color: 'var(--text-primary)' }}>Paramètres Thermodynamiques</h3>
            
            <KineticsSlider
              label="Température" symbol="T"
              value={state.temperature} min={200} max={1000} step={10} unit="K"
              onChange={v => setVariable('temperature', v)}
              accentColor="var(--as-accent-amber)"
            />

            <CatalystControl 
              catalystEaReduction={state.catalystEaReduction}
              onChange={v => setVariable('catalystEaReduction', v)}
              maxReduction={reaction.activationEnergyForward - 5} 
            />
          </div>
        </div>

        {/* Right Column: Graphs & Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <EquilibriumIndicator result={result} />
          <KineticsResults result={result} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ background: 'var(--as-surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--as-border-inverse)' }}>
              <ConcentrationChart history={history} reaction={reaction} />
            </div>
            <div style={{ background: 'var(--as-surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--as-border-inverse)' }}>
              <EnergyProfileChart reaction={reaction} catalystEaReduction={state.catalystEaReduction} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
