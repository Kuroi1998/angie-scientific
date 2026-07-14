import React from 'react';
import type { KineticsResult } from '../types/kinetics.types';
import { useLanguage } from '../../../../../../hooks/useLanguage';

export const EquilibriumIndicator: React.FC<{ result: KineticsResult }> = ({ result }) => {
  const { t } = useLanguage('lab');
  const { Q, K, isAtEquilibrium } = result;

  const getDirection = () => {
    if (isAtEquilibrium || !Number.isFinite(Q) || !Number.isFinite(K)) return t('kinetics.equilibrium.atEq');
    if (Q < K) return t('kinetics.equilibrium.forward');
    return t('kinetics.equilibrium.reverse');
  };

  const getColor = () => {
    if (isAtEquilibrium) return 'var(--as-accent-green)';
    if (Q < K) return 'var(--as-accent-cyan)';
    return 'var(--as-accent-magenta)';
  };

  const position = Math.min(Math.max((Math.log10(Q) - Math.log10(K) + 5) / 10, 0), 1); // rough mapping -5 to +5 decades
  const percentage = Number.isFinite(position) ? position * 100 : 50;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', background: 'var(--surface-card)', borderRadius: '8px', border: `1px solid ${getColor()}`, transition: 'all 0.3s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: 'var(--as-text-secondary)', fontFamily: 'var(--as-font-title)' }}>{t('kinetics.equilibrium.stateTitle')}</span>
        <span style={{ fontSize: '10px', color: `color-mix(in srgb, ${getColor()} 75%, var(--as-text-primary) 25%)`, fontFamily: 'var(--as-font-title)', fontWeight: 'bold' }}>{getDirection()}</span>
      </div>

      <div style={{ position: 'relative', height: '4px', background: 'var(--as-surface-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: 'var(--as-text-muted)' }} />
        <div 
          style={{ 
            position: 'absolute', 
            left: `${Math.min(percentage, 50)}%`, 
            width: `${Math.abs(percentage - 50)}%`, 
            top: 0, bottom: 0, 
            background: getColor(),
            transition: 'all 0.1s linear'
          }} 
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--as-text-muted)', fontFamily: 'var(--as-font-mono)' }}>
        <span>Q &lt; K</span>
        <span>Q = K</span>
        <span>Q &gt; K</span>
      </div>
    </div>
  );
};
