import React from 'react';
import type { GasVariable } from '../types/gas.types';
import { useLanguage } from '../../../../../../hooks/useLanguage';

interface VariableSelectorProps {
  value: GasVariable;
  onChange: (v: GasVariable) => void;
}

export const VariableSelector: React.FC<VariableSelectorProps> = ({ value, onChange }) => {
  const { t } = useLanguage('lab');

  const options: { id: GasVariable; label: string; symbol: string }[] = [
    { id: 'pressure', label: t('gas.params.pressure'), symbol: 'P' },
    { id: 'volume', label: t('gas.params.volume'), symbol: 'V' },
    { id: 'temperature', label: t('gas.params.temperature'), symbol: 'T' },
    { id: 'moles', label: t('gas.params.moles'), symbol: 'n' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
      <span style={{ fontSize: '11px', color: 'var(--as-text-muted)', fontFamily: 'var(--as-font-title)' }}>{t('gas.variableSelector.title')}</span>
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
              title={t('gas.variableSelector.calcHint', { label: opt.label.toLowerCase() })}
            >
              {opt.symbol}
            </button>
          );
        })}
      </div>
    </div>
  );
};
