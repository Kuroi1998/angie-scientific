import React from 'react';
import type { GasModelsComparison, GasState } from '../types/gas.types';
import { ScientificPanel } from '../../../../../../components/shared/ScientificPanel';
import { formatScientific } from '../utils/gasUnitConversions';
import { useLanguage } from '../../../../../../hooks/useLanguage';

export const ComparisonTable: React.FC<{ state: GasState, comparison: GasModelsComparison }> = ({ state, comparison }) => {
  const { t } = useLanguage('lab');
  const { idealGas, vanDerWaals, absoluteDivergence, relativeDivergence, compressibilityFactorZ } = comparison;

  return (
    <ScientificPanel title={t('gas.comparisonTable.title')} variant="glass">
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', fontFamily: 'var(--as-font-mono)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--as-border-inverse)', color: 'rgba(247, 250, 252, 0.75)', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>{t('gas.comparisonTable.headers.magnitude')}</th>
              <th style={{ padding: '8px' }}>{t('gas.comparisonTable.headers.idealGas')}</th>
              <th style={{ padding: '8px' }}>{t('gas.comparisonTable.headers.vdw')}</th>
              <th style={{ padding: '8px' }}>{t('gas.comparisonTable.headers.absDivergence')}</th>
              <th style={{ padding: '8px' }}>{t('gas.comparisonTable.headers.relDivergence')}</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
              <td style={{ padding: '8px', color: 'rgba(247, 250, 252, 0.7)' }}>{t('gas.comparisonTable.rows.pressure')}</td>
              <td style={{ padding: '8px', color: 'var(--as-accent-cyan)' }}>
                {state.calculatedVariable === 'pressure' ? formatScientific(idealGas.value) : state.pressure.toFixed(2)}
              </td>
              <td style={{ padding: '8px', color: 'var(--as-accent-magenta)' }}>
                {state.calculatedVariable === 'pressure' ? formatScientific(vanDerWaals.value) : state.pressure.toFixed(2)}
              </td>
              <td style={{ padding: '8px', color: 'rgba(247, 250, 252, 0.94)' }}>
                {state.calculatedVariable === 'pressure' ? formatScientific(absoluteDivergence) : '0'}
              </td>
              <td style={{ padding: '8px', color: 'rgba(247, 250, 252, 0.94)' }}>
                {state.calculatedVariable === 'pressure' ? `${relativeDivergence.toFixed(2)} %` : '0 %'}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
              <td style={{ padding: '8px', color: 'rgba(247, 250, 252, 0.7)' }}>{t('gas.comparisonTable.rows.volume')}</td>
              <td style={{ padding: '8px', color: 'var(--as-accent-cyan)' }}>
                {state.calculatedVariable === 'volume' ? formatScientific(idealGas.value) : state.volume.toFixed(2)}
              </td>
              <td style={{ padding: '8px', color: 'var(--as-accent-magenta)' }}>
                {state.calculatedVariable === 'volume' ? formatScientific(vanDerWaals.value) : state.volume.toFixed(2)}
              </td>
              <td style={{ padding: '8px', color: 'var(--as-text-muted)' }}>
                {state.calculatedVariable === 'volume' ? formatScientific(absoluteDivergence) : '-'}
              </td>
              <td style={{ padding: '8px', color: 'var(--as-text-muted)' }}>
                {state.calculatedVariable === 'volume' ? `${relativeDivergence.toFixed(2)} %` : '-'}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
              <td style={{ padding: '8px', color: 'rgba(247, 250, 252, 0.7)' }}>{t('gas.comparisonTable.rows.temperature')}</td>
              <td style={{ padding: '8px', color: 'var(--as-accent-cyan)' }}>
                {state.calculatedVariable === 'temperature' ? formatScientific(idealGas.value) : state.temperature.toFixed(2)}
              </td>
              <td style={{ padding: '8px', color: 'var(--as-accent-magenta)' }}>
                {state.calculatedVariable === 'temperature' ? formatScientific(vanDerWaals.value) : state.temperature.toFixed(2)}
              </td>
              <td style={{ padding: '8px', color: 'var(--as-text-muted)' }}>
                {state.calculatedVariable === 'temperature' ? formatScientific(absoluteDivergence) : '-'}
              </td>
              <td style={{ padding: '8px', color: 'var(--as-text-muted)' }}>
                {state.calculatedVariable === 'temperature' ? `${relativeDivergence.toFixed(2)} %` : '-'}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', color: 'rgba(247, 250, 252, 0.7)' }}>{t('gas.comparisonTable.rows.zFactor')}</td>
              <td style={{ padding: '8px', color: 'var(--as-accent-cyan)' }}>1.0000</td>
              <td style={{ padding: '8px', color: 'var(--as-accent-magenta)' }}>{compressibilityFactorZ.toFixed(4)}</td>
              <td style={{ padding: '8px', color: 'rgba(247, 250, 252, 0.94)' }}>{Math.abs(1 - compressibilityFactorZ).toFixed(4)}</td>
              <td style={{ padding: '8px', color: 'rgba(247, 250, 252, 0.94)' }}>{Math.abs((1 - compressibilityFactorZ) * 100).toFixed(2)} %</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ScientificPanel>
  );
};
