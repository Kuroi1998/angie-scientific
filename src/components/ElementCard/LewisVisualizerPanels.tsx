import React from 'react';
import { Activity, GitCommit } from 'lucide-react';
import type { BondDetails, VseprResult } from '../../engines/bondingEngine';
import { useLanguage } from '../../hooks/useLanguage';
import {
  canvasPanelStyle,
  canvasStyle,
  canvasTitleStyle,
  fieldLabelStyle,
  nobleNoticeStyle,
  panelStyle,
  panelTitleStyle,
  rangeStyle,
  selectStyle,
  sliderLabelStyle,
  summaryGridStyle,
  summaryHeaderStyle,
  summaryStyle,
  telemetryStyle,
  visualsGridStyle
} from './lewisPanelStyles';

type CanvasRef = React.RefObject<HTMLCanvasElement | null>;

interface NobleGasNoticeProps {
  centralSymbol: string;
  language: string;
}

interface BondConfigurationPanelProps {
  centralSymbol: string;
  ligand: string;
  count: number;
  bond: BondDetails;
  language: string;
  onLigandChange: (ligand: string) => void;
  onCountChange: (count: number) => void;
}

interface VisualsGridProps {
  lewisCanvasRef: CanvasRef;
  vseprCanvasRef: CanvasRef;
  centralSymbol: string;
  ligand: string;
  count: number;
  vsepr: VseprResult;
  geometryLabel: string;
  language: string;
}

interface GeometrySummaryProps {
  vsepr: VseprResult;
  geometryLabel: string;
  bondCharacterLabel: string;
  language: string;
}

export const NobleGasNotice: React.FC<NobleGasNoticeProps> = ({ centralSymbol }) => {
  const { t } = useLanguage('periodicTable');
  return React.createElement('div', { style: nobleNoticeStyle },
    React.createElement('span', {
      style: { fontFamily: 'var(--font-title)', fontSize: '22px', color: 'var(--neon-cyan)' }
    }, centralSymbol),
    React.createElement('p', {
      style: { fontFamily: 'var(--font-title)', fontSize: '12px', color: 'var(--neon-cyan)', margin: 0 }
    }, t('lewis.nobleGasTitle')),
    React.createElement('p', {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--text-secondary)',
        margin: 0,
        lineHeight: '1.5',
        maxWidth: '280px'
      }
    }, t('lewis.nobleGasDesc', { symbol: centralSymbol }))
  );
};

export const BondConfigurationPanel: React.FC<BondConfigurationPanelProps> = (props) => {
  const { centralSymbol, ligand, count, bond, language, onLigandChange, onCountChange } = props;
  const { t } = useLanguage('periodicTable');

  return React.createElement('div', { className: 'glass-panel', style: panelStyle },
    React.createElement('h4', { style: panelTitleStyle },
      React.createElement(GitCommit, { size: 14 }),
      t('lewis.configTitle')
    ),
    React.createElement('div', null,
      React.createElement('label', { style: fieldLabelStyle },
        t('lewis.ligand')
      ),
      React.createElement('select', {
        value: ligand,
        onChange: (event) => onLigandChange((event.target as HTMLSelectElement).value),
        style: selectStyle
      },
        ['H', 'O', 'Cl', 'F', 'N'].map((symbol) => {
          if (symbol === centralSymbol) return null;
          return React.createElement('option', { key: symbol, value: symbol }, symbol);
        })
      )
    ),
    React.createElement('div', { style: { marginTop: '16px' } },
      React.createElement('div', { style: sliderLabelStyle },
        React.createElement('span', null, t('lewis.bondCount')),
        React.createElement('span', { style: { color: 'var(--neon-magenta)', fontWeight: 'bold' } }, count)
      ),
      React.createElement('input', {
        type: 'range',
        min: 1,
        max: 6,
        value: count,
        onChange: (event) => onCountChange(parseInt((event.target as HTMLInputElement).value)),
        style: rangeStyle
      })
    ),
    React.createElement('div', { style: telemetryStyle },
      metric('FORMULA', `${centralSymbol}${count > 1 ? count : ''}${ligand}`, '#fff'),
      metric('BOND TYPE', language === 'es' ? bond.typeES : bond.typeFR, 'var(--neon-cyan)'),
      metric('DELTA ELECTRONEGATIVITY', bond.polarityDiff, '#fff'),
      metric('BOND ENERGY', `${bond.energy} kJ/mol`, 'var(--neon-yellow)'),
      metric('BOND LENGTH', `${bond.length} pm`, 'var(--neon-yellow)')
    )
  );
};

export const VisualsGrid: React.FC<VisualsGridProps> = ({
  lewisCanvasRef,
  vseprCanvasRef,
  centralSymbol,
  ligand,
  count,
  vsepr,
  geometryLabel
}) => {
  const { t } = useLanguage('periodicTable');
  return React.createElement('div', { style: visualsGridStyle },
    canvasPanel(
      t('lewis.lewisStructure'),
      lewisCanvasRef,
      `Structure de Lewis: ${centralSymbol} lie a ${count} ${ligand}, ${vsepr.lonePairs} doublet(s) non liant(s)`
    ),
    canvasPanel(
      t('lewis.vseprGeometry'),
      vseprCanvasRef,
      `Geometrie VSEPR: ${geometryLabel}, angle de liaison ${vsepr.bondAngle}`
    )
  );
};

export const GeometrySummary: React.FC<GeometrySummaryProps> = ({
  vsepr,
  geometryLabel,
  bondCharacterLabel
}) => {
  const { t } = useLanguage('periodicTable');
  return React.createElement('div', { style: summaryStyle },
    React.createElement('div', null,
      React.createElement('div', { style: summaryHeaderStyle },
        React.createElement(Activity, { size: 14 }),
        React.createElement('span', null, t('lewis.geometryTitle'))
      ),
      React.createElement('div', { style: summaryGridStyle },
        React.createElement('div', { style: { color: 'var(--neon-green)', fontWeight: 'bold' } },
          geometryLabel
        ),
        React.createElement('div', { style: { color: 'var(--text-secondary)' } },
          `${vsepr.stericNumber - vsepr.lonePairs} liantes, ${vsepr.lonePairs} non-liantes`
        )
      )
    ),
    React.createElement('div', null,
      React.createElement('div', { style: summaryHeaderStyle },
        React.createElement(GitCommit, { size: 14 }),
        React.createElement('span', null, t('lewis.bondCharacter'))
      ),
    ),
    React.createElement('p', {
      style: { fontSize: '10px', color: 'var(--text-muted)', margin: '6px 0 0 0', lineHeight: '1.4' }
    }, `// ${bondCharacterLabel}`)
  );
};

const metric = (label: string, value: React.ReactNode, color: string) => {
  return React.createElement('div', { key: label },
    React.createElement('span', { style: { color: 'var(--text-muted)' } }, `${label}: `),
    React.createElement('span', { style: { color, fontWeight: 'bold' } }, value)
  );
};



const canvasPanel = (title: string, canvasRef: CanvasRef, ariaLabel: string) => {
  return React.createElement('div', { className: 'glass-panel', key: title, style: canvasPanelStyle },
    React.createElement('span', { style: canvasTitleStyle }, title),
    React.createElement('canvas', {
      ref: canvasRef,
      width: 150,
      height: 150,
      role: 'img',
      'aria-label': ariaLabel,
      style: canvasStyle
    })
  );
};
