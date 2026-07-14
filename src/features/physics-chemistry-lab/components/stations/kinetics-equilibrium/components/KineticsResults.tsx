import React from 'react';
import type { KineticsResult } from '../types/kinetics.types';

export const KineticsResults: React.FC<{ result: KineticsResult }> = ({ result }) => {
  const formatSci = (v: number) => {
    if (!Number.isFinite(v)) return '∞';
    if (v === 0) return '0.00';
    if (v < 0.01 || v > 1000) return v.toExponential(2);
    return v.toFixed(3);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
      <div style={{ padding: '12px', background: 'var(--surface-card)', border: '1px solid var(--as-border-inverse)', borderRadius: '8px' }}>
        <div style={{ fontSize: '11px', color: 'var(--as-text-secondary)', fontFamily: 'var(--as-font-title)' }}>Vitesse Directe (vf)</div>
        <div style={{ fontSize: '18px', fontFamily: 'var(--as-font-mono)', color: 'var(--text-primary)', margin: '4px 0' }}>
          {formatSci(result.vf)}
        </div>
        <div style={{ fontSize: '9px', color: 'var(--as-text-muted)' }}>mol/(L·s)</div>
      </div>

      <div style={{ padding: '12px', background: 'var(--surface-card)', border: '1px solid var(--as-border-inverse)', borderRadius: '8px' }}>
        <div style={{ fontSize: '11px', color: 'var(--as-text-secondary)', fontFamily: 'var(--as-font-title)' }}>Vitesse Inverse (vr)</div>
        <div style={{ fontSize: '18px', fontFamily: 'var(--as-font-mono)', color: 'var(--text-primary)', margin: '4px 0' }}>
          {formatSci(result.vr)}
        </div>
        <div style={{ fontSize: '9px', color: 'var(--as-text-muted)' }}>mol/(L·s)</div>
      </div>

      <div style={{ padding: '12px', background: 'color-mix(in srgb, var(--as-accent-cyan) 8%, transparent)', border: '1px solid var(--as-accent-cyan)', borderRadius: '8px' }}>
        <div style={{ fontSize: '11px', color: 'color-mix(in srgb, var(--as-accent-cyan) 75%, var(--as-text-primary) 25%)', fontFamily: 'var(--as-font-title)' }}>Constante d'Éq. (K)</div>
        <div style={{ fontSize: '18px', fontFamily: 'var(--as-font-mono)', color: 'var(--text-primary)', margin: '4px 0' }}>
          {formatSci(result.K)}
        </div>
        <div style={{ fontSize: '9px', color: 'var(--as-text-muted)' }}>Dépendant de T</div>
      </div>

      <div style={{ padding: '12px', background: 'color-mix(in srgb, var(--as-accent-amber) 8%, transparent)', border: '1px solid var(--as-accent-amber)', borderRadius: '8px' }}>
        <div style={{ fontSize: '11px', color: 'color-mix(in srgb, var(--as-accent-amber) 75%, var(--as-text-primary) 25%)', fontFamily: 'var(--as-font-title)' }}>Quotient de R. (Q)</div>
        <div style={{ fontSize: '18px', fontFamily: 'var(--as-font-mono)', color: 'var(--text-primary)', margin: '4px 0' }}>
          {formatSci(result.Q)}
        </div>
        <div style={{ fontSize: '9px', color: 'var(--as-text-muted)' }}>État instantané</div>
      </div>
    </div>
  );
};
