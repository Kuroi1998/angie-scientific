import React, { useRef, useEffect } from 'react';
import type { SubstanceParams } from '../types/phase.types';
import { getSublimationPressure, getVaporizationPressure, getFusionPressure } from '../services/phaseCalculator.service';
import { ScientificPanel } from '../../../../../../components/shared/ScientificPanel';
import { resolveCssColor } from '../../../../../../utils/resolveCssColor';

interface PTDiagramChartProps {
  substance: SubstanceParams;
  temperature: number;
  pressure: number;
  onPointChange: (temp: number, press: number) => void;
}

export const PTDiagramChart: React.FC<PTDiagramChartProps> = ({ substance, temperature, pressure, onPointChange }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    
    ctx.clearRect(0, 0, w, h);
    
    // Log scale for Pressure
    const padLeft = 45;
    const padBottom = 30;
    
    const minLogP = Math.log10(substance.minP);
    const maxLogP = Math.log10(substance.maxP);
    
    const mapX = (t: number) => padLeft + ((t - substance.minT) / (substance.maxT - substance.minT)) * (w - padLeft - 10);
    const mapY = (p: number) => {
      const logP = Math.log10(Math.max(p, substance.minP));
      return h - padBottom - ((logP - minLogP) / (maxLogP - minLogP)) * (h - padBottom - 10);
    };

    // Axes
    ctx.strokeStyle = resolveCssColor('var(--surface-border)', '#8b99a6');
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padLeft, 10);
    ctx.lineTo(padLeft, h - padBottom);
    ctx.lineTo(w - 10, h - padBottom);
    ctx.stroke();

    ctx.fillStyle = resolveCssColor('var(--as-text-muted)', '#8b99a6');
    ctx.font = '10px monospace';
    ctx.fillText('Log(P)', 5, 15);
    ctx.fillText('T(K)', w - 30, h - 10);

    const drawCurve = (startT: number, endT: number, pFunc: (t: number) => number, color: string) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      let isFirst = true;
      for (let i = 0; i <= 100; i++) {
        const t = startT + (i / 100) * (endT - startT);
        const p = pFunc(t);
        if (p <= 0 || p > substance.maxP * 10) continue; // Skip out of bounds
        const x = mapX(t);
        const y = mapY(p);
        if (isFirst) {
          ctx.moveTo(x, y);
          isFirst = false;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    };

    const sublimationColor = resolveCssColor('var(--as-accent-cyan)', '#18b8c8');
    const vaporizationColor = resolveCssColor('var(--as-accent-coral)', '#ef6b5b');
    const fusionColor = resolveCssColor('var(--as-accent-amber)', '#f2b84b');

    // Sublimation curve
    drawCurve(substance.minT, substance.tripleT, t => getSublimationPressure(t, substance), sublimationColor);

    // Vaporization curve
    drawCurve(substance.tripleT, substance.criticalT, t => getVaporizationPressure(t, substance), vaporizationColor);

    // Fusion curve
    // Finding max T for fusion line display
    let fusionEndT = substance.maxT;
    if (substance.fusionSlope < 0) {
      fusionEndT = substance.minT; // For water, fusion line goes left
    }
    drawCurve(Math.min(substance.tripleT, fusionEndT), Math.max(substance.tripleT, fusionEndT), t => getFusionPressure(t, substance), fusionColor);

    // Points
    const drawPoint = (t: number, p: number, color: string, label: string) => {
      const x = mapX(t);
      const y = mapY(p);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '10px sans-serif';
      ctx.fillText(label, x + 6, y - 4);
    };

    drawPoint(substance.tripleT, substance.tripleP, resolveCssColor('var(--as-text-inverse)', '#ffffff'), 'PT');
    drawPoint(substance.criticalT, substance.criticalP, vaporizationColor, 'PC');

    // Current State Cursor
    const cx = mapX(temperature);
    const cy = mapY(pressure);
    ctx.strokeStyle = substance.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy); ctx.lineTo(cx + 8, cy);
    ctx.moveTo(cx, cy - 8); ctx.lineTo(cx, cy + 8);
    ctx.stroke();

  }, [substance, temperature, pressure]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const padLeft = 45;
    const padBottom = 30;
    const w = canvas.width;
    const h = canvas.height;

    // Inverse map
    const tRatio = (x - padLeft) / (w - padLeft - 10);
    let newT = substance.minT + tRatio * (substance.maxT - substance.minT);
    
    const pRatio = (h - padBottom - y) / (h - padBottom - 10);
    const minLogP = Math.log10(substance.minP);
    const maxLogP = Math.log10(substance.maxP);
    const newLogP = minLogP + pRatio * (maxLogP - minLogP);
    let newP = Math.pow(10, newLogP);

    newT = Math.max(substance.minT, Math.min(substance.maxT, newT));
    newP = Math.max(substance.minP, Math.min(substance.maxP, newP));

    onPointChange(newT, newP);
  };

  return (
    <ScientificPanel title="Diagramme P-T" variant="glass">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <canvas 
          ref={canvasRef} width={400} height={250} 
          onClick={handleClick}
          style={{ background: 'var(--as-surface-inverse)', borderRadius: '4px', maxWidth: '100%', cursor: 'crosshair' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '12px', fontSize: '10px', fontFamily: 'var(--as-font-mono)' }}>
        <span style={{ color: 'var(--as-accent-cyan)' }}>— Sublimation</span>
        <span style={{ color: 'var(--as-accent-amber)' }}>— Fusion</span>
        <span style={{ color: 'var(--as-accent-coral)' }}>— Vaporisation</span>
      </div>
    </ScientificPanel>
  );
};
