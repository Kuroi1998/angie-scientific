import React from 'react';
import { reactionKeys } from '../data/reactionDatabase';
import { useLanguage } from '../../../../../../hooks/useLanguage';

interface ReactionSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export const ReactionSelector: React.FC<ReactionSelectorProps> = ({ selectedId, onSelect }) => {
  const { t } = useLanguage('lab');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <span style={{ fontSize: '11px', color: 'var(--as-text-muted)', fontFamily: 'var(--as-font-title)' }}>{t('kinetics.reaction.title')}</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {reactionKeys.map(key => {
          const active = key === selectedId;
          
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '8px 12px',
                background: active ? 'rgba(24, 184, 200, 0.1)' : 'var(--surface-card)',
                border: `1px solid ${active ? 'var(--as-accent-cyan)' : 'var(--as-border-inverse)'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
            >
              <div style={{ fontSize: '12px', fontFamily: 'var(--as-font-title)', color: active ? 'color-mix(in srgb, var(--as-accent-cyan) 75%, var(--as-text-primary) 25%)' : 'var(--as-text-muted)' }}>
                {t(`kinetics.reactions.${key}.name`)}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--as-text-secondary)', marginTop: '4px' }}>
                {t(`kinetics.reactions.${key}.desc`)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
