import React from 'react';
import type { GasModelsComparison, GasVariable } from '../types/gas.types';
import { formatScientific } from '../utils/gasUnitConversions';
import { useLanguage } from '../../../../../../hooks/useLanguage';

interface ResultCardsProps {
  comparison: GasModelsComparison;
  calculatedVariable: GasVariable;
}

export const ResultCards: React.FC<ResultCardsProps> = ({ comparison, calculatedVariable }) => {
  const { t } = useLanguage('lab');
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
      case 'none': return t('gas.results.levels.none');
      case 'low': return t('gas.results.levels.low');
      case 'moderate': return t('gas.results.levels.moderate');
      case 'high': return t('gas.results.levels.high');
      case 'critical': return t('gas.results.levels.critical');
      default: return t('gas.results.levels.unknown');
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
        <div style={{ fontSize: '11px', color: 'color-mix(in srgb, var(--as-accent-cyan) 75%, var(--as-text-primary) 25%)', fontFamily: 'var(--as-font-title)' }}>{t('gas.results.ideal')}</div>
        <div style={{ fontSize: '24px', fontFamily: 'var(--as-font-mono)', color: 'var(--text-primary)', margin: '8px 0' }}>
          {idealGas.isValid ? `${formatScientific(idealGas.value)} ${idealGas.unit}` : t('gas.results.error')}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--as-text-muted)' }}>{t('gas.results.idealDesc', { symbol })}</div>
      </div>

      <div style={{ padding: '16px', background: 'rgba(239, 107, 91, 0.05)', border: '1px solid var(--as-accent-magenta)', borderRadius: '8px' }}>
        <div style={{ fontSize: '11px', color: 'color-mix(in srgb, var(--as-accent-magenta) 75%, var(--as-text-primary) 25%)', fontFamily: 'var(--as-font-title)' }}>{t('gas.results.vdw')}</div>
        <div style={{ fontSize: '24px', fontFamily: 'var(--as-font-mono)', color: 'var(--text-primary)', margin: '8px 0' }}>
          {vanDerWaals.isValid ? `${formatScientific(vanDerWaals.value)} ${vanDerWaals.unit}` : t('gas.results.error')}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--as-text-muted)' }}>{t('gas.results.vdwDesc', { symbol })}</div>
      </div>

      <div style={{ padding: '16px', background: 'var(--surface-card)', border: `1px solid ${getDivergenceColor()}`, borderRadius: '8px' }}>
        <div style={{ fontSize: '11px', color: `color-mix(in srgb, ${getDivergenceColor()} 75%, var(--as-text-primary) 25%)`, fontFamily: 'var(--as-font-title)' }}>{t('gas.results.divergenceLabel', { level: getDivergenceLabel() })}</div>
        <div style={{ fontSize: '24px', fontFamily: 'var(--as-font-mono)', color: 'var(--text-primary)', margin: '8px 0' }}>
          {relativeDivergence.toFixed(2)} %
        </div>
        <div style={{ fontSize: '10px', color: 'var(--as-text-muted)' }}>
          {t('gas.results.divergenceAbs')} {formatScientific(absoluteDivergence)} {idealGas.unit}
        </div>
      </div>

      <div style={{ padding: '16px', background: 'var(--surface-card)', border: '1px solid var(--as-border-inverse)', borderRadius: '8px' }}>
        <div style={{ fontSize: '11px', color: 'var(--as-text-secondary)', fontFamily: 'var(--as-font-title)' }}>{t('gas.results.compressibility')}</div>
        <div style={{ fontSize: '24px', fontFamily: 'var(--as-font-mono)', color: 'var(--text-primary)', margin: '8px 0' }}>
          {compressibilityFactorZ.toFixed(4)}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--as-text-muted)' }}>{t('gas.results.compressibilityDesc')}</div>
      </div>
    </div>
  );
};
