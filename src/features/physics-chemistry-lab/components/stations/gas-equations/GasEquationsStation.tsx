import React from 'react';
import { useGasState } from './hooks/useGasState';
import { GasHeader } from './components/GasHeader';
import { GasSelector } from './components/GasSelector';
import { ParameterPanel } from './components/ParameterPanel';
import { VariableSelector } from './controls/VariableSelector';
import { ResultCards } from './components/ResultCards';
import { GasSimulationBox } from './components/GasSimulationBox';
import { ValidityAlerts } from './components/ValidityAlerts';
import { VdwConstantsInfo } from './components/VdwConstantsInfo';
import { ComparisonTable } from './components/ComparisonTable';
import { FormulaPanel } from './components/FormulaPanel';
import { PVChart } from './charts/PVChart';
import { useLanguage } from '../../../../../hooks/useLanguage';

export const GasEquationsStation: React.FC = () => {
  const { state, setVariable, gas, comparison } = useGasState();
  const { t } = useLanguage('lab');

  const handleReset = () => {
    setVariable('gasKey', 'co2');
    setVariable('calculatedVariable', 'pressure');
    setVariable('volume', 5);
    setVariable('temperature', 300);
    setVariable('moles', 1);
    setVariable('pressure', 5); // Will be recalculated anyway if calculatedVariable is pressure
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '24px', overflowY: 'auto', paddingRight: '8px' }}>
      <GasHeader onReset={handleReset} />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(400px, 2fr)', gap: '24px', alignItems: 'start' }}>
        {/* Colonne Gauche : Contrôles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'var(--as-surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--as-border-inverse)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontFamily: 'var(--as-font-title)', color: 'var(--text-primary)' }}>{t('gas.selection.title')}</h3>
            <GasSelector selectedKey={state.gasKey} onSelect={(k) => setVariable('gasKey', k)} />
          </div>

          <div style={{ background: 'var(--as-surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--as-border-inverse)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontFamily: 'var(--as-font-title)', color: 'var(--text-primary)' }}>{t('gas.params.title')}</h3>
            <VariableSelector value={state.calculatedVariable} onChange={(v) => setVariable('calculatedVariable', v)} />
            <ParameterPanel state={state} onUpdateState={setVariable} />
          </div>
          
          <VdwConstantsInfo gas={gas} />
        </div>

        {/* Colonne Droite : Résultats et Graphiques */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <ResultCards comparison={comparison} calculatedVariable={state.calculatedVariable} />
          <ValidityAlerts comparison={comparison} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ background: 'var(--as-surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--as-border-inverse)' }}>
              <GasSimulationBox state={state} onUpdateState={setVariable} />
            </div>
            <div style={{ background: 'var(--as-surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--as-border-inverse)' }}>
              <PVChart state={state} comparison={comparison} />
            </div>
          </div>

          <ComparisonTable state={state} comparison={comparison} />
          <FormulaPanel />
        </div>
      </div>
    </div>
  );
};
