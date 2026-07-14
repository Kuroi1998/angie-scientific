import React, { useRef, useEffect } from 'react';
import type { EmissionElement } from '../types/spectroscopy.types';
import { ScientificPanel } from '../../../../../../components/shared/ScientificPanel';
import { wavelengthToRgbHex } from '../services/photonCalculator.service';
import { useLanguage } from '../../../../../../../hooks/useLanguage';

interface EmissionSpectrumChartProps {
  element: EmissionElement;
  hoveredWavelength: number | null;
  onHover: (wl: number | null) => void;
}

export const EmissionSpectrumChart: React.FC<EmissionSpectrumChartProps> = ({ element, hoveredWavelength, onHover }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { t } = useLanguage('lab');
  const minWl = 380;
  const maxWl = 750;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    
    // Clear & background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, w, h);

    const pad = 20;
    const chartW = w - 2 * pad;
    const chartH = h - 40;

    const mapX = (wl: number) => pad + ((wl - minWl) / (maxWl - minWl)) * chartW;

    // Background gradient (faint full spectrum)
    const grad = ctx.createLinearGradient(pad, 0, w - pad, 0);
    for (let i = 0; i <= 100; i++) {
      const wl = minWl + (i / 100) * (maxWl - minWl);
      grad.addColorStop(i / 100, `${wavelengthToRgbHex(wl)}33`); // 20% opacity
    }
    ctx.fillStyle = grad;
    ctx.fillRect(pad, 10, chartW, chartH);

    // Draw spectral lines
    element.lines.forEach(line => {
      const x = mapX(line.wl);
      const color = wavelengthToRgbHex(line.wl);
      
      // Glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.fillStyle = color;
      
      // Line width based on relative intensity
      const lineWidth = Math.max(1, ((line.intensity || 0.8) / 100) * 4);
      ctx.fillRect(x - lineWidth/2, 10, lineWidth, chartH);
      
      ctx.shadowBlur = 0; // reset
    });

    // Draw axis
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(pad, chartH + 10);
    ctx.lineTo(w - pad, chartH + 10);
    ctx.stroke();

    ctx.fillStyle = '#888';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    for (let wl = 400; wl <= 700; wl += 50) {
      ctx.fillText(wl.toString(), mapX(wl), chartH + 25);
      ctx.beginPath();
      ctx.moveTo(mapX(wl), chartH + 10);
      ctx.lineTo(mapX(wl), chartH + 15);
      ctx.stroke();
    }
    ctx.fillText('λ (nm)', w - pad + 15, chartH + 25);

    // Draw hovered line
    if (hoveredWavelength !== null) {
      const x = mapX(hoveredWavelength);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(x, 10);
      ctx.lineTo(x, h - 10);
      ctx.stroke();
      ctx.setLineDash([]);
    }

  }, [element, hoveredWavelength]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    const pad = 20;
    if (x < pad || x > canvas.width - pad) {
      onHover(null);
      return;
    }

    const ratio = (x - pad) / (canvas.width - 2 * pad);
    const wl = minWl + ratio * (maxWl - minWl);
    
    // Snap to nearest line if close
    let closestWl = wl;
    let minDiff = 10; // snap threshold in nm
    element.lines.forEach(line => {
      const diff = Math.abs(line.wl - wl);
      if (diff < minDiff) {
        minDiff = diff;
        closestWl = line.wl;
      }
    });

    onHover(closestWl);
  };

  return (
    <ScientificPanel title={t('spectroscopy.charts.emissionTitle')} variant="glass">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <canvas 
          ref={canvasRef} width={600} height={200} 
          onMouseMove={handleMouseMove}
          onMouseLeave={() => onHover(null)}
          style={{ background: 'var(--as-surface-inverse)', borderRadius: '4px', maxWidth: '100%', cursor: 'crosshair' }}
        />
      </div>
    </ScientificPanel>
  );
};
