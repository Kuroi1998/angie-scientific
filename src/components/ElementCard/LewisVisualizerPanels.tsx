import React from 'react';
import { Activity, GitCommit } from 'lucide-react';
import type { BondDetails, VseprResult } from '../../engines/bondingEngine';
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

const pick = (language: string, fr: string, es: string) => language === 'fr' ? fr : es;

export const NobleGasNotice: React.FC<NobleGasNoticeProps> = ({ centralSymbol, language }) => {
  return React.createElement('div', { style: nobleNoticeStyle },
    React.createElement('span', {
      style: { fontFamily: 'var(--font-title)', fontSize: '22px', color: 'var(--neon-cyan)' }
    }, centralSymbol),
    React.createElement('p', {
      style: { fontFamily: 'var(--font-title)', fontSize: '12px', color: 'var(--neon-cyan)', margin: 0 }
    }, pick(language, 'GAZ NOBLE - COUCHE COMPLETE', 'GAS NOBLE - CAPA COMPLETA')),
    React.createElement('p', {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--text-secondary)',
        margin: 0,
        lineHeight: '1.5',
        maxWidth: '280px'
      }
    }, pick(
      language,
      `${centralSymbol} possede une configuration electronique stable et ne forme pas de liaisons covalentes standard.`,
      `${centralSymbol} tiene una configuracion electronica estable y no forma enlaces covalentes estandar.`
    ))
  );
};

export const BondConfigurationPanel: React.FC<BondConfigurationPanelProps> = (props) => {
  const { centralSymbol, ligand, count, bond, language, onLigandChange, onCountChange } = props;

  return React.createElement('div', { className: 'glass-panel', style: panelStyle },
    React.createElement('h4', { style: panelTitleStyle },
      React.createElement(GitCommit, { size: 14 }),
      pick(language, 'CONFIGURATION LIAISON', 'CONFIGURACION ENLACE')
    ),
    React.createElement('div', null,
      React.createElement('label', { style: fieldLabelStyle },
        pick(language, 'PARTENAIRE DE LIAISON', 'COMPANERO DE ENLACE')
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
    React.createElement('div', null,
      React.createElement('label', { style: sliderLabelStyle },
        React.createElement('span', null, pick(language, "NOMBRE D'ATOMES LIGAND", 'NUMERO DE ATOMOS LIGANDO')),
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
      metric('BOND TYPE', pick(language, bond.typeFR, bond.typeES), 'var(--neon-cyan)'),
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
  geometryLabel,
  language
}) => {
  return React.createElement('div', { style: visualsGridStyle },
    canvasPanel(
      pick(language, 'STRUCTURE DE LEWIS (2D)', 'ESTRUCTURA DE LEWIS (2D)'),
      lewisCanvasRef,
      `Structure de Lewis: ${centralSymbol} lie a ${count} ${ligand}, ${vsepr.lonePairs} doublet(s) non liant(s)`
    ),
    canvasPanel(
      pick(language, 'GEOMETRIE VSEPR (3D)', 'GEOMETRIA VSEPR (3D)'),
      vseprCanvasRef,
      `Geometrie VSEPR: ${geometryLabel}, angle de liaison ${vsepr.bondAngle}`
    )
  );
};

export const GeometrySummary: React.FC<GeometrySummaryProps> = ({
  vsepr,
  geometryLabel,
  bondCharacterLabel,
  language
}) => {
  return React.createElement('div', { className: 'glass-panel', style: summaryStyle },
    React.createElement('div', { style: summaryHeaderStyle },
      React.createElement(Activity, { size: 13 }),
      pick(language, 'ANALYSE DE GEOMETRIE QUANTIQUE & HYBRIDATION', 'ANALISIS DE GEOMETRIA CUANTICA E HIBRIDACION')
    ),
    React.createElement('div', { style: summaryGridStyle },
      React.createElement('div', null,
        metricLine('GEOMETRY', geometryLabel, '#fff'),
        metricLine('BOND ANGLE', vsepr.bondAngle, 'var(--neon-magenta)')
      ),
      React.createElement('div', null,
        metricLine('HYBRIDIZATION', vsepr.hybridization, '#fff'),
        metricLine('LONE PAIRS (LP)', vsepr.lonePairs, 'var(--neon-magenta)')
      )
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

const metricLine = (label: string, value: React.ReactNode, color: string) => {
  return React.createElement(React.Fragment, { key: label },
    React.createElement('span', { style: { color: 'var(--text-muted)' } }, `${label}: `),
    React.createElement('span', { style: { color, fontWeight: 'bold' } }, value),
    React.createElement('br')
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
