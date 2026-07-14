import React from 'react';
import { substancesDatabase, substanceKeys } from '../data/substancesDatabase';
import { useLanguage } from '../../../../../../hooks/useLanguage';

interface SubstanceSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export const SubstanceSelector: React.FC<SubstanceSelectorProps> = ({ selectedId, onSelect }) => {
  const { t } = useLanguage('lab');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <span style={{ fontSize: '11px', color: 'var(--as-text-muted)', fontFamily: 'var(--as-font-title)' }}>{t('phase.substance.title')}</span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
        {substanceKeys.map(key => {
          const sub = substancesDatabase[key];
          const active = key === selectedId;
          
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: active ? `${sub.color}22` : 'var(--surface-card)',
                border: `1px solid ${active ? sub.color : 'var(--as-border-inverse)'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
            >
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: sub.color }} />
              <div style={{ fontSize: '12px', fontFamily: 'var(--as-font-title)', color: active ? `color-mix(in srgb, ${sub.color} 75%, var(--as-text-primary) 25%)` : 'var(--as-text-muted)' }}>
                {t(`phase.substances.${key}.name`)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
