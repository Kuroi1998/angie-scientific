import React from 'react';
import type { GasModelsComparison } from '../types/gas.types';

export const ValidityAlerts: React.FC<{ comparison: GasModelsComparison }> = ({ comparison }) => {
  const { idealGas, vanDerWaals, divergenceLevel } = comparison;

  if (idealGas.isValid && vanDerWaals.isValid && divergenceLevel === 'none' || divergenceLevel === 'low') {
    return null; // All good, no alert needed
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {!idealGas.isValid && (
        <div style={{ padding: '12px', background: 'rgba(239, 107, 91, 0.1)', borderLeft: '4px solid var(--as-accent-red)', borderRadius: '4px' }}>
          <strong style={{ color: 'color-mix(in srgb, var(--as-accent-red) 75%, var(--as-text-primary) 25%)', fontSize: '11px', fontFamily: 'var(--as-font-title)' }}>ERREUR GAZ PARFAIT :</strong>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--as-text-muted)' }}>{idealGas.errorReason}</p>
        </div>
      )}

      {!vanDerWaals.isValid && (
        <div style={{ padding: '12px', background: 'rgba(239, 107, 91, 0.1)', borderLeft: '4px solid var(--as-accent-red)', borderRadius: '4px' }}>
          <strong style={{ color: 'color-mix(in srgb, var(--as-accent-red) 75%, var(--as-text-primary) 25%)', fontSize: '11px', fontFamily: 'var(--as-font-title)' }}>ERREUR VAN DER WAALS :</strong>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--as-text-muted)' }}>{vanDerWaals.errorReason}</p>
        </div>
      )}

      {(divergenceLevel === 'high' || divergenceLevel === 'critical') && vanDerWaals.isValid && idealGas.isValid && (
        <div style={{ padding: '12px', background: 'rgba(255, 171, 0, 0.1)', borderLeft: '4px solid var(--as-accent-amber)', borderRadius: '4px' }}>
          <strong style={{ color: 'color-mix(in srgb, var(--as-accent-amber) 75%, var(--as-text-primary) 25%)', fontSize: '11px', fontFamily: 'var(--as-font-title)' }}>DIVERGENCE IMPORTANTE :</strong>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--as-text-muted)' }}>
            Les interactions intermoléculaires et le volume propre des molécules influencent fortement le comportement du gaz. Le modèle du gaz parfait n'est plus fiable dans ces conditions (haute pression / basse température).
          </p>
        </div>
      )}
    </div>
  );
};
