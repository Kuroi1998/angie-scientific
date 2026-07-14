import React from 'react';
import type { GasModelsComparison, GasVariable } from '../types/gas.types';
import { formatScientific } from '../utils/gasUnitConversions';

interface ResultCardsProps {
  comparison: GasModelsComparison;
  calculatedVariable: GasVariable;
}

export const ResultCards: React.FC<ResultCardsProps> = ({ comparison, calculatedVariable }) => {
  const { idealGas, vanDerWaals, absoluteDivergence, relativeDivergence, compressibilityFactorZ, divergenceLevel } = comparison;

  const getDivergenceColor = () => {
    switch (divergenceLevel) {
      case 'none': return 'var(--as-accent-green)';
      case 'low': return 'var(--as-accent-green)';
      case 'moderate': return 'var(--as-accent-yellow)';
      case 'high': return 'var(--as-accent-amber)';
      case 'critical': return 'var(--as-accent-red)';
      default: return 'var(--as-text-muted)';
    }
  };

  const getDivergenceLabel = () => {
    switch (divergenceLevel) {
      case 'none': return 'Nulle';
      case 'low': return 'Faible';
      case 'moderate': return 'Modérée';
      case 'high': return 'Importante';
      case 'critical': return 'Très Importante';
      default: return 'Inconnue';
    }
  };

  const getVarSymbol = (v: GasVariable) => {
    switch (v) {
      case 'pressure': return 'P';
      case 'volume': return 'V';
      case 'temperature': return 'T';
      case 'moles': return 'n';
    }
  };

  const symbol = getVarSymbol(calculatedVariable);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
      <div style={{ padding: '16px', background: 'rgba(24, 184, 200, 0.05)', border: '1px solid var(--as-accent-cyan)', borderRadius: '8px' }}>
        <div style={{ fontSize: '11px', color: 'color-mix(in srgb, var(--as-accent-cyan) 75%, var(--as-text-primary) 25%)', fontFamily: 'var(--as-font-title)' }}>MODÈLE GAZ PARFAIT</div>
        <div style={{ fontSize: '24px', fontFamily: 'var(--as-font-mono)', color: 'var(--text-primary)', margin: '8px 0' }}>
          {idealGas.isValid ? `${formatScientific(idealGas.value)} ${idealGas.unit}` : 'Erreur'}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--as-text-muted)' }}>{symbol} idéal (interactions négligées)</div>
      </div>

      <div style={{ padding: '16px', background: 'rgba(239, 107, 91, 0.05)', border: '1px solid var(--as-accent-magenta)', borderRadius: '8px' }}>
        <div style={{ fontSize: '11px', color: 'color-mix(in srgb, var(--as-accent-magenta) 75%, var(--as-text-primary) 25%)', fontFamily: 'var(--as-font-title)' }}>MODÈLE VAN DER WAALS</div>
        <div style={{ fontSize: '24px', fontFamily: 'var(--as-font-mono)', color: 'var(--text-primary)', margin: '8px 0' }}>
          {vanDerWaals.isValid ? `${formatScientific(vanDerWaals.value)} ${vanDerWaals.unit}` : 'Erreur'}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--as-text-muted)' }}>{symbol} réel (volume moléculaire et attractions)</div>
      </div>

      <div style={{ padding: '16px', background: 'var(--surface-card)', border: `1px solid ${getDivergenceColor()}`, borderRadius: '8px' }}>
        <div style={{ fontSize: '11px', color: `color-mix(in srgb, ${getDivergenceColor()} 75%, var(--as-text-primary) 25%)`, fontFamily: 'var(--as-font-title)' }}>ÉCART RELATIF : {getDivergenceLabel().toUpperCase()}</div>
        <div style={{ fontSize: '24px', fontFamily: 'var(--as-font-mono)', color: 'var(--text-primary)', margin: '8px 0' }}>
          {relativeDivergence.toFixed(2)} %
        </div>
        <div style={{ fontSize: '10px', color: 'var(--as-text-muted)' }}>
          Écart absolu : {formatScientific(absoluteDivergence)} {idealGas.unit}
        </div>
      </div>

      <div style={{ padding: '16px', background: 'var(--surface-card)', border: '1px solid var(--as-border-inverse)', borderRadius: '8px' }}>
        <div style={{ fontSize: '11px', color: 'var(--as-text-secondary)', fontFamily: 'var(--as-font-title)' }}>FACTEUR DE COMPRESSIBILITÉ Z</div>
        <div style={{ fontSize: '24px', fontFamily: 'var(--as-font-mono)', color: 'var(--text-primary)', margin: '8px 0' }}>
          {compressibilityFactorZ.toFixed(4)}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--as-text-muted)' }}>Z = PV / nRT (Z=1 pour l'idéal)</div>
      </div>
    </div>
  );
};
