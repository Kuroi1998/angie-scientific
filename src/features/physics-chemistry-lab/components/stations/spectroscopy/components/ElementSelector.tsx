import React from 'react';
import type { SpectroscopyMode } from '../types/spectroscopy.types';
import { emissionDatabase, emissionKeys, absorptionDatabase, absorptionKeys } from '../data/spectroscopyDatabase';

interface ElementSelectorProps {
  mode: SpectroscopyMode;
  selectedId: string;
  onSelect: (id: string) => void;
}

export const ElementSelector: React.FC<ElementSelectorProps> = ({ mode, selectedId, onSelect }) => {
  const isEmission = mode === 'EMISSION';
  const keys = isEmission ? emissionKeys : absorptionKeys;
  const db = isEmission ? emissionDatabase : absorptionDatabase;
  const accentColor = isEmission ? 'var(--as-accent-cyan)' : 'var(--as-accent-amber)';

  const currentItem = isEmission ? emissionDatabase[selectedId] : absorptionDatabase[selectedId];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <span style={{ fontSize: '11px', color: 'var(--as-text-muted)', fontFamily: 'var(--as-font-title)' }}>
        {isEmission ? 'ÉLÉMENT ATOMIQUE' : 'MOLÉCULE'}
      </span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '8px' }}>
        {keys.map(key => {
          const item = db[key as keyof typeof db];
          const active = key === selectedId;
          const symbol = 'symbol' in item ? item.symbol : item.formula;
          
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 12px',
                background: active ? `${accentColor}22` : 'var(--surface-card)',
                border: `1px solid ${active ? accentColor : 'var(--as-border-inverse)'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '16px', fontFamily: 'var(--as-font-title)', color: active ? `color-mix(in srgb, ${accentColor} 75%, var(--as-text-primary) 25%)` : 'var(--as-text-primary)' }}>
                {symbol}
              </div>
              <div style={{ fontSize: '9px', fontFamily: 'var(--as-font-mono)', color: 'var(--as-text-muted)' }}>
                {item.name}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ padding: '12px', background: 'var(--surface-card)', borderLeft: `2px solid ${accentColor}`, borderRadius: '0 4px 4px 0', fontSize: '12px', color: 'var(--as-text-secondary)', lineHeight: '1.4' }}>
        {currentItem?.description}
      </div>
    </div>
  );
};
