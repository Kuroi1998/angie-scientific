import React, { useRef, useEffect } from 'react';
import type { EmissionElement } from '../types/spectroscopy.types';
import { wavelengthToRgbHex } from '../services/photonCalculator.service';
import { ScientificPanel } from '../../../../../../components/shared/ScientificPanel';
import { resolveCssColor } from '../../../../../../utils/resolveCssColor';
import { resolveCssFont } from '../../../../../../utils/resolveCssFont';

interface EmissionSpectrumChartProps {
  element: EmissionElement;
  hoveredWavelength: number | null;
  onHover: (wl: number | null) => void;
}

export const EmissionSpectrumChart: React.FC<EmissionSpectrumChartProps> = ({ element, hoveredWavelength, onHover }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const minWl = 380;
  const maxWl = 750;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    
    ctx.clearRect(0, 0, w, h);

    // Draw continuous background (very faint)
    for (let x = 0; x < w; x++) {
      const wl = minWl + (x / w) * (maxWl - minWl);
      ctx.fillStyle = wavelengthToRgbHex(wl);
      ctx.globalAlpha = 0.05;
      ctx.fillRect(x, 10, 1, h - 40);
    }
    ctx.globalAlpha = 1.0;

    // Draw lines
    element.lines.forEach(line => {
      const x = ((line.wl - minWl) / (maxWl - minWl)) * w;
      
      // Glow
      const intensity = line.intensity ?? 0.8;
      ctx.shadowColor = line.color;
      ctx.shadowBlur = 15 * intensity;
      ctx.fillStyle = line.color;
      ctx.fillRect(x - 1, 10, 3, h - 40);
      
      ctx.shadowBlur = 0;
      
      // Label
      ctx.fillStyle = resolveCssColor('var(--as-text-secondary)', '#c2c9d1');
      ctx.font = resolveCssFont('9px var(--as-font-mono)', 'monospace');
      ctx.fillText(line.wl.toFixed(1), x - 12, h - 15);
    });

    // Draw cursor
    if (hoveredWavelength !== null) {
      const x = ((hoveredWavelength - minWl) / (maxWl - minWl)) * w;
      ctx.strokeStyle = resolveCssColor('var(--as-text-inverse)', '#ffffff');
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(x, 5);
      ctx.lineTo(x, h - 5);
      ctx.stroke();
      ctx.setLineDash([]);
    }

  }, [element, hoveredWavelength]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const wl = minWl + (x / canvas.width) * (maxWl - minWl);
    onHover(Math.max(minWl, Math.min(maxWl, wl)));
  };

  const handleMouseLeave = () => onHover(null);

  return (
    <ScientificPanel title={`Spectre d'émission : ${element.name}`} variant="glass">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <canvas 
          ref={canvasRef} width={600} height={180} 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ background: 'var(--as-surface-inverse)', borderRadius: '4px', maxWidth: '100%', cursor: 'crosshair', border: '1px solid var(--as-border-inverse)' }}
        />
        <div style={{ marginTop: '12px', fontSize: '12px', fontFamily: 'var(--as-font-mono)', color: 'rgba(247, 250, 252, 0.7)' }}>
          Longueur d'onde λ (nm)
        </div>
      </div>
    </ScientificPanel>
  );
};
