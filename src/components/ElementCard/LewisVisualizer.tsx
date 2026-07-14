import React, { useEffect, useRef, useState } from 'react';
import { getBondDetails, predictVsepr } from '../../engines/bondingEngine';
import { useLanguage } from '../../hooks/useLanguage';
import {
  drawLewisStructure,
  drawVseprStructure,
  getRecommendedBondConfig,
  NO_BOND_ELEMENTS
} from './lewisVisualizerCanvas';
import {
  BondConfigurationPanel,
  GeometrySummary,
  NobleGasNotice,
  VisualsGrid
} from './LewisVisualizerPanels';

interface LewisVisualizerProps {
  centralSymbol: string;
}

export const LewisVisualizer: React.FC<LewisVisualizerProps> = ({ centralSymbol }) => {
  const { language: currentLanguage } = useLanguage();
  const language = currentLanguage ?? 'fr';
  const initialConfig = getRecommendedBondConfig(centralSymbol);
  const [ligand, setLigand] = useState<string>(initialConfig.ligand);
  const [count, setCount] = useState<number>(initialConfig.count);
  const lewisCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const vseprCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const bond = getBondDetails(centralSymbol, ligand);
  const vsepr = predictVsepr(centralSymbol, ligand, count);
  const geometryLabel = language === 'fr' ? vsepr.geometryFR : vsepr.geometryES;
  const bondCharacterLabel = language === 'fr' ? bond.characterFR : bond.characterES;

  useEffect(() => {
    const nextConfig = getRecommendedBondConfig(centralSymbol);
    setLigand(nextConfig.ligand);
    setCount(nextConfig.count);
  }, [centralSymbol]);

  useEffect(() => {
    if (!lewisCanvasRef.current) return;
    drawLewisStructure({
      canvas: lewisCanvasRef.current,
      centralSymbol,
      ligand,
      count,
      lonePairs: vsepr.lonePairs
    });
  }, [centralSymbol, ligand, count, vsepr.lonePairs]);

  useEffect(() => {
    if (!vseprCanvasRef.current) return;
    drawVseprStructure({
      canvas: vseprCanvasRef.current,
      centralSymbol,
      ligand,
      count,
      lonePairs: vsepr.lonePairs
    });
  }, [centralSymbol, ligand, count, vsepr.lonePairs]);

  if (NO_BOND_ELEMENTS.includes(centralSymbol)) {
    return React.createElement(NobleGasNotice, { centralSymbol, language });
  }

  return React.createElement('div', {
    className: 'lewis-vsepr-container animate-fade-in',
    style: { display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }
  },
    React.createElement('div', {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }
    },
      React.createElement(BondConfigurationPanel, {
        centralSymbol,
        ligand,
        count,
        bond,
        language,
        onLigandChange: setLigand,
        onCountChange: setCount
      }),
      React.createElement(VisualsGrid, {
        lewisCanvasRef,
        vseprCanvasRef,
        centralSymbol,
        ligand,
        count,
        vsepr,
        geometryLabel,
        language
      })
    ),
    React.createElement(GeometrySummary, {
      vsepr,
      geometryLabel,
      bondCharacterLabel,
      language
    })
  );
};
