import React, { useRef, useEffect } from 'react';
import type { AbsorptionMolecule } from '../types/spectroscopy.types';
import { ScientificPanel } from '../../../../../../components/shared/ScientificPanel';
import { resolveCssColor } from '../../../../../../utils/resolveCssColor';
import { resolveCssFont } from '../../../../../../utils/resolveCssFont';

interface AbsorptionSpectrumChartProps {
  molecule: AbsorptionMolecule;
  hoveredWavenumber: number | null;
  onHover: (wn: number | null) => void;
}

export const AbsorptionSpectrumChart: React.FC<AbsorptionSpectrumChartProps> = ({ molecule, hoveredWavenumber, onHover }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const maxWn = 4000;
  const minWn = 400; // IR typically goes from 4000 to 400 cm-1

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    
    ctx.clearRect(0, 0, w, h);

    // Map wavenumber (inverse axis!)
    const mapX = (wn: number) => w - ((wn - minWn) / (maxWn - minWn)) * w;
    const mapY = (t: number) => 20 + (1 - t) * (h - 60);

    const gridColor = resolveCssColor('var(--surface-border)', '#8b99a6');
    const mutedColor = resolveCssColor('var(--as-text-muted)', '#8b99a6');
    const gridFont = resolveCssFont('10px var(--as-font-mono)', 'monospace');

    // Draw Grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let wn = 1000; wn <= 4000; wn += 1000) {
      const x = mapX(wn);
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h - 30); ctx.stroke();
      ctx.fillStyle = mutedColor;
      ctx.font = gridFont;
      ctx.fillText(wn.toString(), x - 12, h - 15);
    }

    // Baseline (T = 1.0)
    ctx.strokeStyle = gridColor;
    ctx.beginPath(); ctx.moveTo(0, mapY(1.0)); ctx.lineTo(w, mapY(1.0)); ctx.stroke();

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
