import React, { useRef, useEffect } from 'react';
import type { ConcentrationPoint, ReactionDefinition } from '../types/kinetics.types';
import { ScientificPanel } from '../../../../../../components/shared/ScientificPanel';
import { resolveCssColor } from '../../../../../../utils/resolveCssColor';
import { useLanguage } from '../../../../../../hooks/useLanguage';

interface ConcentrationChartProps {
  history: ConcentrationPoint[];
  reaction: ReactionDefinition;
}

export const ConcentrationChart: React.FC<ConcentrationChartProps> = ({ history, reaction }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { t } = useLanguage('lab');

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
    ctx.fillText('t', w - 15, h - 5);
    ctx.fillText('[C]', 5, 15);

    if (history.length < 2) return;

    // Find max concentration to scale Y axis
    let maxConc = 0;
    history.forEach(p => {
      maxConc = Math.max(maxConc, p.a, p.b, p.c, p.d);
    });
    maxConc = Math.max(maxConc, 1); // Avoid division by zero

    const mapX = (i: number) => 30 + (i / (history.length - 1)) * (w - 40);
    const mapY = (val: number) => h - 20 - (val / maxConc) * (h - 30);

    const drawCurve = (key: keyof ConcentrationPoint, color: string) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.moveTo(mapX(0), mapY(history[0][key] as number));
      for (let i = 1; i < history.length; i++) {
        ctx.lineTo(mapX(i), mapY(history[i][key] as number));
      }
      ctx.stroke();
    };

    drawCurve('a', reaction.colorA);
    if (reaction.colorB) drawCurve('b', reaction.colorB);
    drawCurve('c', reaction.colorC || '#ffffff');
    if (reaction.colorD) drawCurve('d', reaction.colorD);

  }, [history, reaction]);

  return (
    <ScientificPanel title={t('kinetics.charts.concentrationTitle')} variant="glass">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <canvas ref={canvasRef} width={400} height={200} style={{ background: 'var(--as-surface-inverse)', borderRadius: '4px', maxWidth: '100%' }} />
      </div>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '12px', fontSize: '10px', fontFamily: 'var(--as-font-mono)' }}>
        <span style={{ color: reaction.colorA }}>■ [A]</span>
        {reaction.colorB && <span style={{ color: reaction.colorB }}>■ [B]</span>}
        <span style={{ color: reaction.colorC }}>■ [C]</span>
        {reaction.colorD && <span style={{ color: reaction.colorD }}>■ [D]</span>}
      </div>
    </ScientificPanel>
  );
};
