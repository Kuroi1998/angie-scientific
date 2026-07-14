import React, { useRef, useEffect } from 'react';
import type { GasState, GasModelsComparison } from '../types/gas.types';
import { gasDatabase } from '../data/gasDatabase';
import { ScientificPanel } from '../../../../../../components/shared/ScientificPanel';
import { resolveCssColor } from '../../../../../../utils/resolveCssColor';

export const PVChart: React.FC<{ state: GasState, comparison: GasModelsComparison }> = ({ state, comparison }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    
    // Clear
    ctx.clearRect(0, 0, w, h);
    
    // Axes
    ctx.strokeStyle = resolveCssColor('var(--surface-border)', '#8b99a6');
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 10);
    ctx.lineTo(30, h - 20);
    ctx.lineTo(w - 10, h - 20);
    ctx.stroke();

    // Labels
    ctx.fillStyle = resolveCssColor('var(--as-text-muted)', '#8b99a6');
    ctx.font = '10px monospace';
    ctx.fillText('V', w - 15, h - 5);
    ctx.fillText('P', 10, 15);

    const gas = gasDatabase[state.gasKey];
    const n = state.moles;
    const t = state.temperature;
    const R = 0.08314;
    
    // Draw isotherms
    // V from 0.1 to 50
    const mapX = (v: number) => 30 + (v / 50) * (w - 40);
    const mapY = (p: number) => h - 20 - (p / 200) * (h - 30); // Max P = 200

    ctx.beginPath();
    ctx.strokeStyle = resolveCssColor('var(--as-accent-cyan)', '#18b8c8');
    ctx.lineWidth = 2;
    for (let v = 0.5; v <= 50; v += 0.5) {
      const pId = (n * R * t) / v;
      if (pId <= 200) {
        ctx.lineTo(mapX(v), mapY(pId));
      }
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = resolveCssColor('var(--as-accent-violet)', '#7c6ee6');
    for (let v = n * gas.b + 0.1; v <= 50; v += 0.5) {
      const pVdw = (n * R * t) / (v - n * gas.b) - (gas.a * n * n) / (v * v);
      if (pVdw >= 0 && pVdw <= 200) {
        ctx.lineTo(mapX(v), mapY(pVdw));
      }
    }
    ctx.stroke();

    // Draw current point
    const currV = state.calculatedVariable === 'volume' ? comparison.vanDerWaals.value : state.volume;
    const currP = state.calculatedVariable === 'pressure' ? comparison.vanDerWaals.value : state.pressure;

    if (currV >= 0 && currV <= 50 && currP >= 0 && currP <= 200) {
      ctx.fillStyle = resolveCssColor('var(--as-accent-amber)', '#f2b84b');
      ctx.beginPath();
      ctx.arc(mapX(currV), mapY(currP), 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [state, comparison]);

  return (
    <ScientificPanel title="Isotherme Pression-Volume" variant="glass">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <canvas ref={canvasRef} width={300} height={200} style={{ background: 'var(--as-surface-inverse)', borderRadius: '4px' }} />
      </div>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '12px', fontSize: '10px', fontFamily: 'var(--as-font-mono)' }}>
        <span style={{ color: 'var(--as-accent-cyan)' }}>■ Gaz Parfait</span>
        <span style={{ color: 'color-mix(in srgb, var(--as-accent-violet) 85%, white 15%)' }}>■ Van der Waals</span>
      </div>
    </ScientificPanel>
  );
};
