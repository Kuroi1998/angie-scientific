import React from 'react';
import { gasDatabase, gasKeys } from '../data/gasDatabase';
import type { GasKey } from '../types/gas.types';

interface GasSelectorProps {
  selectedKey: GasKey;
  onSelect: (key: GasKey) => void;
}

export const GasSelector: React.FC<GasSelectorProps> = ({ selectedKey, onSelect }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
      {gasKeys.map(key => {
        const gas = gasDatabase[key];
        const active = key === selectedKey;
        
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '8px 12px',
              background: active ? `${gas.color}20` : 'var(--surface-card)',
              border: `1px solid ${active ? gas.color : 'var(--as-border-inverse)'}`,
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--as-font-title)', fontSize: '11px', color: active ? `color-mix(in srgb, ${gas.color} 75%, var(--as-text-primary) 25%)` : 'var(--as-text-muted)' }}>
                {gas.formula}
              </span>
              <span style={{ fontSize: '9px', color: 'var(--as-text-secondary)' }}>{gas.molarMass.toFixed(1)} g/mol</span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--as-text-primary)', marginTop: '4px' }}>{gas.name}</span>
          </button>
        );
      })}
    </div>
  );
};
