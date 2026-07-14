import React from 'react';
import type { GasVariable } from '../types/gas.types';

interface VariableSelectorProps {
  value: GasVariable;
  onChange: (v: GasVariable) => void;
}

export const VariableSelector: React.FC<VariableSelectorProps> = ({ value, onChange }) => {
  const options: { id: GasVariable; label: string; symbol: string }[] = [
    { id: 'pressure', label: 'Pression', symbol: 'P' },
    { id: 'volume', label: 'Volume', symbol: 'V' },
    { id: 'temperature', label: 'Température', symbol: 'T' },
    { id: 'moles', label: 'Quantité', symbol: 'n' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
      <span style={{ fontSize: '11px', color: 'var(--as-text-muted)', fontFamily: 'var(--as-font-title)' }}>VARIABLE À CALCULER</span>
      <div style={{ display: 'flex', gap: '4px', background: 'var(--surface-card)', padding: '4px', borderRadius: '6px' }}>
        {options.map(opt => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              style={{
                flex: 1,
                padding: '6px',
                background: active ? 'var(--as-surface-primary)' : 'transparent',
                border: 'none',
                borderRadius: '4px',
                color: active ? 'var(--as-text-primary)' : 'var(--as-text-muted)',
                fontFamily: 'var(--as-font-title)',
                fontSize: '10px',
                cursor: 'pointer',
                boxShadow: active ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                transition: 'all 0.2s'
              }}
              title={`Calculer le ${opt.label} en fonction des autres variables`}
            >
              {opt.symbol}
            </button>
          );
        })}
      </div>
    </div>
  );
};
