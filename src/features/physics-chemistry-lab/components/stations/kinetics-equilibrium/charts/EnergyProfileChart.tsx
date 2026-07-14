import React, { useRef, useEffect } from 'react';
import type { ReactionDefinition } from '../types/kinetics.types';
import { ScientificPanel } from '../../../../../../components/shared/ScientificPanel';
import { resolveCssColor } from '../../../../../../utils/resolveCssColor';
import { useLanguage } from '../../../../../../hooks/useLanguage';

interface EnergyProfileChartProps {
  reaction: ReactionDefinition;
  catalystEaReduction: number;
}

export const EnergyProfileChart: React.FC<EnergyProfileChartProps> = ({ reaction, catalystEaReduction }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { t } = useLanguage('lab');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    
    ctx.clearRect(0, 0, w, h);
    
    // Axes
    ctx.strokeStyle = resolveCssColor('var(--surface-border)', '#8b99a6');
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 10);
    ctx.lineTo(30, h - 20);
    ctx.lineTo(w - 10, h - 20);
    ctx.stroke();

    ctx.fillStyle = resolveCssColor('var(--as-text-muted)', '#8b99a6');
    ctx.font = '10px monospace';
    ctx.fillText('CR', w - 20, h - 5); // Coordonnée de réaction
    ctx.fillText('E', 10, 15);

    const E_reactants = 50; 
    const E_products = E_reactants + reaction.enthalpy;
    const E_activation = E_reactants + reaction.activationEnergyForward;
    const E_cat_activation = E_activation - catalystEaReduction;

    // Scale to fit canvas height (0 to max(E_activation, E_products) + 20)
    const maxE = Math.max(E_activation, E_products, E_reactants) + 10;
    const minE = Math.min(E_products, E_reactants) - 20;
    
    const mapY = (e: number) => h - 20 - ((e - minE) / (maxE - minE)) * (h - 40);

    const drawProfile = (activationEnergy: number, color: string, isDashed = false) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      if (isDashed) ctx.setLineDash([5, 5]);
      else ctx.setLineDash([]);
      
      // Reactants line
      ctx.moveTo(30, mapY(E_reactants));
      ctx.lineTo(70, mapY(E_reactants));
      
      // Curve to transition state
      ctx.quadraticCurveTo(w / 2 - 20, mapY(activationEnergy), w / 2, mapY(activationEnergy));
      
      // Curve to products
      ctx.quadraticCurveTo(w / 2 + 20, mapY(activationEnergy), w - 50, mapY(E_products));
      
      // Products line
      ctx.lineTo(w - 10, mapY(E_products));
      ctx.stroke();
      ctx.setLineDash([]);
    };

    // Draw Uncatalyzed — text-inverse (not text-primary) contrasts correctly
    // against the canvas's own surface-inverse background in both themes.
    drawProfile(E_activation, resolveCssColor('var(--as-text-inverse)', '#f7fafc'));

    // Draw Catalyzed
    if (catalystEaReduction > 0) {
      drawProfile(E_cat_activation, resolveCssColor('var(--as-accent-green)', '#39a76d'), true);
    }

    // Draw Delta H
    ctx.beginPath();
    ctx.strokeStyle = resolveCssColor(
      reaction.enthalpy < 0 ? 'var(--as-accent-cyan)' : 'var(--as-error)',
      reaction.enthalpy < 0 ? '#18b8c8' : '#c9473a'
    );
    ctx.lineWidth = 1;
    ctx.moveTo(w - 40, mapY(E_reactants));
    ctx.lineTo(w - 40, mapY(E_products));
    ctx.stroke();

    ctx.fillStyle = ctx.strokeStyle;
    ctx.fillText(`ΔH = ${reaction.enthalpy} kJ`, w - 100, mapY((E_reactants + E_products) / 2));

  }, [reaction, catalystEaReduction]);

  return (
    <ScientificPanel title={t('kinetics.charts.energyProfileTitle')} variant="glass">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <canvas ref={canvasRef} width={300} height={200} style={{ background: 'var(--as-surface-inverse)', borderRadius: '4px', maxWidth: '100%' }} />
      </div>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '12px', fontSize: '10px', fontFamily: 'var(--as-font-mono)' }}>
        <span style={{ color: 'rgba(247, 250, 252, 0.75)' }}>— Sans catalyseur</span>
        {catalystEaReduction > 0 && <span style={{ color: 'var(--as-accent-green)' }}>- - Avec catalyseur</span>}
      </div>
    </ScientificPanel>
  );
};
