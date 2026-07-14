import React, { useRef, useEffect } from 'react';
import type { AbsorptionMolecule } from '../types/spectroscopy.types';
import { ScientificPanel } from '../../../../../../components/shared/ScientificPanel';
import { resolveCssColor } from '../../../../../../utils/resolveCssColor';
import { resolveCssFont } from '../../../../../../utils/resolveCssFont';
import { useLanguage } from '../../../../../../../hooks/useLanguage';

interface AbsorptionSpectrumChartProps {
  molecule: AbsorptionMolecule;
  hoveredWavenumber: number | null;
  onHover: (wn: number | null) => void;
}

export const AbsorptionSpectrumChart: React.FC<AbsorptionSpectrumChartProps> = ({ molecule, hoveredWavenumber, onHover }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { t } = useLanguage('lab');
  const minWn = 4000;
  const maxWn = 400; // Reversed axis for IR!

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    
    ctx.clearRect(0, 0, w, h);

    const padX = 40;
    const padY = 30;
    const chartW = w - 2 * padX;
    const chartH = h - 2 * padY;

    const mapX = (wn: number) => padX + ((wn - minWn) / (maxWn - minWn)) * chartW;
    const mapY = (transmittance: number) => padY + ((100 - transmittance) / 100) * chartH;

    // Axes
    ctx.strokeStyle = resolveCssColor('var(--surface-border)', '#8b99a6');
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padX, padY);
    ctx.lineTo(padX, h - padY);
    ctx.lineTo(w - padX, h - padY);
    ctx.stroke();

    ctx.fillStyle = resolveCssColor('var(--as-text-muted)', '#8b99a6');
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    
    // X Axis Labels (reversed)
    for (let wn = 4000; wn >= 500; wn -= 500) {
      const x = mapX(wn);
      ctx.fillText(wn.toString(), x, h - padY + 15);
      ctx.beginPath();
      ctx.moveTo(x, h - padY);
      ctx.lineTo(x, h - padY + 5);
      ctx.stroke();
    }
    ctx.fillText('cm⁻¹', w / 2, h - 5);

    // Y Axis Labels
    ctx.textAlign = 'right';
    for (let t = 0; t <= 100; t += 50) {
      const y = mapY(t);
      ctx.fillText(t.toString(), padX - 5, y + 3);
    }
    ctx.save();
    ctx.translate(15, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(t('spectroscopy.charts.transmittance'), 0, 0);
    ctx.restore();

    // Draw Curve
    ctx.beginPath();
    ctx.strokeStyle = resolveCssColor('var(--as-accent-amber)', '#f2b84b');
    ctx.lineWidth = 2;
    
    for (let x = 0; x <= w; x += 2) {
      const wn = maxWn - (x / w) * (maxWn - minWn);
      
      // Calculate transmittance by multiplying dips (simplified Lorentzian shape)
      let t = 1.0;
      molecule.dips.forEach(dip => {
        const dx = wn - dip.wavenumber;
        // Lorentzian function: A * (gamma^2 / (dx^2 + gamma^2))
        const depth = 1.0 - dip.transmittance;
        const gamma = dip.width;
        const absorption = depth * (gamma * gamma) / (dx * dx + gamma * gamma);
        t -= absorption;
      });
      t = Math.max(0, t); // Clamp
      
      const y = mapY(t);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw Labels for Dips
    molecule.dips.forEach(dip => {
      const x = mapX(dip.wavenumber);
      const y = mapY(dip.transmittance);
      
      ctx.fillStyle = resolveCssColor('var(--as-accent-violet)', '#7c6ee6');
      ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();

      ctx.font = resolveCssFont('10px var(--as-font-mono)', 'monospace');
      ctx.fillText(dip.vibrationType, x - 30, y + 20);
    });

    // Draw cursor
    if (hoveredWavenumber !== null) {
      const x = mapX(hoveredWavenumber);
      ctx.strokeStyle = resolveCssColor('var(--as-text-inverse)', '#ffffff');
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(x, 5); ctx.lineTo(x, h - 5); ctx.stroke();
      ctx.setLineDash([]);
    }

  }, [molecule, hoveredWavenumber]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const wn = maxWn - (x / canvas.width) * (maxWn - minWn);
    onHover(Math.max(minWn, Math.min(maxWn, wn)));
  };

  const handleMouseLeave = () => onHover(null);

  return (
    <ScientificPanel title={`Spectre IR : ${molecule.name}`} variant="glass">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <canvas 
          ref={canvasRef} width={600} height={220} 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ background: 'var(--as-surface-inverse)', borderRadius: '4px', maxWidth: '100%', cursor: 'crosshair', border: '1px solid var(--as-border-inverse)' }}
        />
        <div style={{ marginTop: '12px', fontSize: '12px', fontFamily: 'var(--as-font-mono)', color: 'rgba(247, 250, 252, 0.7)' }}>
          Nombre d'onde ν̄ (cm⁻¹)
        </div>
      </div>
    </ScientificPanel>
  );
};
