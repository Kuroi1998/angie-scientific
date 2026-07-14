import React from 'react';
import { AdvancedSlider } from '../controls/AdvancedSlider';
import type { GasState, GasVariable } from '../types/gas.types';
import { useLanguage } from '../../../../../../hooks/useLanguage';

interface ParameterPanelProps {
  state: GasState;
  onUpdateState: (k: keyof GasState, v: any) => void;
}

export const ParameterPanel: React.FC<ParameterPanelProps> = ({ state, onUpdateState }) => {
  const { t } = useLanguage('lab');
  const isCalc = (v: GasVariable) => state.calculatedVariable === v;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <AdvancedSlider
        label={t('gas.params.temperature')} symbol="T"
        value={state.temperature} min={50} max={1000} step={1} unit="K"
        onChange={v => onUpdateState('temperature', v)}
        disabled={isCalc('temperature')}
        accentColor="var(--as-accent-amber)"
      />
      
      <AdvancedSlider
        label={t('gas.params.pressure')} symbol="P"
        value={state.pressure} min={0.1} max={200} step={0.1} unit="bar"
        onChange={v => onUpdateState('pressure', v)}
        disabled={isCalc('pressure')}
        accentColor="var(--as-accent-magenta)"
      />
      
      <AdvancedSlider
        label={t('gas.params.volume')} symbol="V"
        value={state.volume} min={0.1} max={50} step={0.1} unit="L"
        onChange={v => onUpdateState('volume', v)}
        disabled={isCalc('volume')}
        accentColor="var(--as-accent-cyan)"
      />
      
      <AdvancedSlider
        label={t('gas.params.moles')} symbol="n"
        value={state.moles} min={0.1} max={10} step={0.1} unit="mol"
        onChange={v => onUpdateState('moles', v)}
        disabled={isCalc('moles')}
        accentColor="var(--as-accent-green)"
      />
    </div>
  );
};
