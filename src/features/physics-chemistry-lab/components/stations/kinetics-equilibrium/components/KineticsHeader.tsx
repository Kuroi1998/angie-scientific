import React from 'react';
import type { KineticsState } from '../types/kinetics.types';
import { useLanguage } from '../../../../../../hooks/useLanguage';

interface KineticsHeaderProps {
  state: KineticsState;
  onTogglePause: () => void;
  onReset: () => void;
  onInject: () => void;
  onChangeSpeed: (v: number) => void;
}

export const KineticsHeader: React.FC<KineticsHeaderProps> = ({ state, onTogglePause, onReset, onInject, onChangeSpeed }) => {
  const { t } = useLanguage('lab');

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--as-border-inverse)', flexWrap: 'wrap', gap: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--as-font-title)', color: 'var(--text-primary)', fontSize: '20px' }}>
          {t('kinetics.header.title')}
        </h2>
        <span style={{ color: 'var(--as-text-muted)', fontSize: '12px', maxWidth: '600px' }}>
          {t('kinetics.header.desc')}
        </span>
      </div>
      
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '16px' }}>
          <span style={{ fontSize: '10px', color: 'var(--as-text-muted)' }}>{t('kinetics.header.speed')}</span>
          <input 
            type="range" min={0.1} max={5} step={0.1} 
            value={state.simulationSpeed} 
            onChange={e => onChangeSpeed(parseFloat(e.target.value))} 
            style={{ width: '60px' }} 
          />
        </div>

        <button
          onClick={onInject}
          style={{
            background: 'rgba(24, 184, 200, 0.1)',
            border: '1px solid var(--as-accent-cyan)',
            color: 'color-mix(in srgb, var(--as-accent-cyan) 75%, var(--as-text-primary) 25%)',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'var(--as-font-title)',
            fontSize: '11px',
            transition: 'all 0.2s'
          }}
          title={t('kinetics.header.injectTooltip')}
        >
          {t('kinetics.header.injectBtn')}
        </button>

        <button
          onClick={onTogglePause}
          style={{
            background: state.isPaused ? 'var(--as-accent-green)' : 'transparent',
            border: `1px solid ${state.isPaused ? 'var(--as-accent-green)' : 'var(--as-border-inverse)'}`,
            color: state.isPaused ? '#000' : 'var(--as-text-primary)',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'var(--as-font-title)',
            fontSize: '11px',
            transition: 'all 0.2s'
          }}
        >
          {state.isPaused ? t('kinetics.header.play') : t('kinetics.header.pause')}
        </button>
        
        <button
          onClick={onReset}
          style={{
            background: 'transparent',
            border: '1px solid var(--as-border-inverse)',
            color: 'var(--text-primary)',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'var(--as-font-title)',
            fontSize: '11px',
            transition: 'all 0.2s'
          }}
        >
          {t('kinetics.header.reset')}
        </button>
      </div>
    </div>
  );
};
