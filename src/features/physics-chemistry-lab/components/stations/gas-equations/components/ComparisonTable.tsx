import React from 'react';
import type { GasModelsComparison, GasState } from '../types/gas.types';
import { ScientificPanel } from '../../../../../../components/shared/ScientificPanel';
import { formatScientific } from '../utils/gasUnitConversions';

export const ComparisonTable: React.FC<{ state: GasState, comparison: GasModelsComparison }> = ({ state, comparison }) => {
  const { idealGas, vanDerWaals, absoluteDivergence, relativeDivergence, compressibilityFactorZ } = comparison;

  return (
    <ScientificPanel title="Tableau Comparatif Détaillé" variant="glass">
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', fontFamily: 'var(--as-font-mono)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--as-border-inverse)', color: 'rgba(247, 250, 252, 0.75)', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Grandeur</th>
              <th style={{ padding: '8px' }}>Gaz Parfait</th>
              <th style={{ padding: '8px' }}>Van der Waals</th>
              <th style={{ padding: '8px' }}>Écart Absolu</th>
              <th style={{ padding: '8px' }}>Écart Relatif</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
              <td style={{ padding: '8px', color: 'rgba(247, 250, 252, 0.7)' }}>Pression (bar)</td>
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
              <td style={{ padding: '8px', color: 'rgba(247, 250, 252, 0.7)' }}>Volume (L)</td>
              <td style={{ padding: '8px', color: 'var(--as-accent-cyan)' }}>
                {state.calculatedVariable === 'volume' ? formatScientific(idealGas.value) : state.volume.toFixed(2)}
              </td>
              <td style={{ padding: '8px', color: 'var(--as-accent-magenta)' }}>
                {state.calculatedVariable === 'volume' ? formatScientific(vanDerWaals.value) : state.volume.toFixed(2)}
              </td>
              <td style={{ padding: '8px', color: 'rgba(247, 250, 252, 0.94)' }}>
                {state.calculatedVariable === 'volume' ? formatScientific(absoluteDivergence) : '0'}
              </td>
              <td style={{ padding: '8px', color: 'rgba(247, 250, 252, 0.94)' }}>
                {state.calculatedVariable === 'volume' ? `${relativeDivergence.toFixed(2)} %` : '0 %'}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
              <td style={{ padding: '8px', color: 'rgba(247, 250, 252, 0.7)' }}>Température (K)</td>
              <td style={{ padding: '8px', color: 'var(--as-accent-cyan)' }}>
                {state.calculatedVariable === 'temperature' ? formatScientific(idealGas.value) : state.temperature.toFixed(2)}
              </td>
              <td style={{ padding: '8px', color: 'var(--as-accent-magenta)' }}>
                {state.calculatedVariable === 'temperature' ? formatScientific(vanDerWaals.value) : state.temperature.toFixed(2)}
              </td>
              <td style={{ padding: '8px', color: 'rgba(247, 250, 252, 0.94)' }}>
                {state.calculatedVariable === 'temperature' ? formatScientific(absoluteDivergence) : '0'}
              </td>
              <td style={{ padding: '8px', color: 'rgba(247, 250, 252, 0.94)' }}>
                {state.calculatedVariable === 'temperature' ? `${relativeDivergence.toFixed(2)} %` : '0 %'}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', color: 'rgba(247, 250, 252, 0.7)' }}>Facteur Z</td>
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
