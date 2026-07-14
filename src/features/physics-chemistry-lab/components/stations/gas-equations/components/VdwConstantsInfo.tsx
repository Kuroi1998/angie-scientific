import React from 'react';
import type { GasDefinition } from '../types/gas.types';
import { ScientificPanel } from '../../../../../../components/shared/ScientificPanel';

export const VdwConstantsInfo: React.FC<{ gas: GasDefinition }> = ({ gas }) => {
  return (
    <ScientificPanel title={`Constantes de Van der Waals : ${gas.name}`} variant="glass">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid var(--surface-border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', color: 'var(--as-accent-magenta)', fontFamily: 'var(--as-font-title)' }}>Paramètre a</span>
            <span style={{ fontSize: '10px', color: 'rgba(247, 250, 252, 0.6)' }}>Cohésion (attractions)</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '14px', fontFamily: 'var(--as-font-mono)', color: 'rgba(247, 250, 252, 0.94)' }}>{gas.a.toFixed(4)}</span>
            <span style={{ fontSize: '9px', color: 'rgba(247, 250, 252, 0.7)' }}>L²·bar/mol²</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', color: 'var(--as-accent-cyan)', fontFamily: 'var(--as-font-title)' }}>Paramètre b</span>
            <span style={{ fontSize: '10px', color: 'rgba(247, 250, 252, 0.6)' }}>Covolume (encombrement)</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '14px', fontFamily: 'var(--as-font-mono)', color: 'rgba(247, 250, 252, 0.94)' }}>{gas.b.toFixed(4)}</span>
            <span style={{ fontSize: '9px', color: 'rgba(247, 250, 252, 0.7)' }}>L/mol</span>
          </div>
        </div>

        <div style={{ background: 'var(--surface-card)', padding: '12px', borderRadius: '6px', fontSize: '11px', color: 'var(--as-text-muted)', lineHeight: 1.4 }}>
          {gas.description}
        </div>
      </div>
    </ScientificPanel>
  );
};
