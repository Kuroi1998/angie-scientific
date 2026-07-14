import React from 'react';
import type { PhaseState, SubstanceParams } from '../types/phase.types';
import { phaseToFrenchLabel } from '../services/phaseCalculator.service';

interface PhasePropertiesPanelProps {
  substance: SubstanceParams;
  phase: PhaseState;
}

export const PhasePropertiesPanel: React.FC<PhasePropertiesPanelProps> = ({ substance, phase }) => {
  const getPhaseColor = () => {
    switch (phase) {
      case 'solid': return '#18b8c8'; // Cyan
      case 'liquid': return '#ef6b5b'; // Red
      case 'gas': return '#f2b84b'; // Yellow
      case 'supercritical': return '#b142af'; // Purple
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
      <div style={{ padding: '12px', background: 'var(--surface-card)', border: `1px solid ${getPhaseColor()}`, borderRadius: '8px' }}>
        <div style={{ fontSize: '11px', color: 'var(--as-text-secondary)', fontFamily: 'var(--as-font-title)' }}>État Physique</div>
        <div style={{ fontSize: '16px', fontFamily: 'var(--as-font-title)', color: `color-mix(in srgb, ${getPhaseColor()} 75%, var(--as-text-primary) 25%)`, margin: '4px 0', textTransform: 'uppercase' }}>
          {phaseToFrenchLabel(phase)}
        </div>
      </div>

      <div style={{ padding: '12px', background: 'var(--surface-card)', border: '1px solid var(--as-border-inverse)', borderRadius: '8px' }}>
        <div style={{ fontSize: '11px', color: 'var(--as-text-secondary)', fontFamily: 'var(--as-font-title)' }}>Point Triple</div>
        <div style={{ fontSize: '14px', fontFamily: 'var(--as-font-mono)', color: 'var(--text-primary)', margin: '4px 0' }}>
          {substance.tripleT} K
        </div>
        <div style={{ fontSize: '10px', color: 'var(--as-text-muted)', fontFamily: 'var(--as-font-mono)' }}>{substance.tripleP} bar</div>
      </div>

      <div style={{ padding: '12px', background: 'var(--surface-card)', border: '1px solid var(--as-border-inverse)', borderRadius: '8px' }}>
        <div style={{ fontSize: '11px', color: 'var(--as-text-secondary)', fontFamily: 'var(--as-font-title)' }}>Point Critique</div>
        <div style={{ fontSize: '14px', fontFamily: 'var(--as-font-mono)', color: 'var(--text-primary)', margin: '4px 0' }}>
          {substance.criticalT} K
        </div>
        <div style={{ fontSize: '10px', color: 'var(--as-text-muted)', fontFamily: 'var(--as-font-mono)' }}>{substance.criticalP} bar</div>
      </div>
    </div>
  );
};
