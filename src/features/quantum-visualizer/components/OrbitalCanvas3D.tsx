import React, { useRef, useEffect } from 'react';
import { evaluateWavefunction } from '../services/wavefunctionCalculations';
import { useTheme } from '../../../theme/hooks/useTheme';

interface OrbitalCanvas3DProps {
  n: number;
  l: number;
  m: number;
  viewMode: 'heatmap' | 'density' | 'phase';
}

export const OrbitalCanvas3D: React.FC<OrbitalCanvas3DProps> = ({ n, l, m, viewMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const size = 400; // Increase resolution
    canvas.width = size;
    canvas.height = size;
    const cx = size / 2;
    const cy = size / 2;

    // Clear background
    ctx.clearRect(0, 0, size, size);

    // Draw reference rings
    ctx.strokeStyle = 'var(--surface-border)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.25, 0, Math.PI * 2);
    ctx.arc(cx, cy, size * 0.45, 0, Math.PI * 2);
    ctx.stroke();

    // Render slice (Heatmap/Density optimization)
    // We render a 2D slice at z=0 
    const res = 200;
    const scale = size / res;
    
    // Create ImageData for faster pixel manipulation
    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;

    for (let cy = 0; cy < res; cy++) {
      for (let cx = 0; cx < res; cx++) {
        // Map to world coordinates
        const u = (cx - res / 2) * scale;
        const v = (cy - res / 2) * scale;
        
        let x = 0, y = 0, z = 0;
        let sliceLabel = '';
        if (m === 0) {
          // pz, dz2 -> lobes on Z axis. Slice XZ plane (y=0)
          x = u;
          z = v;
          sliceLabel = 'COUPE 2D (Y=0)';
        } else if (m === -1) {
          // py -> lobes on Y axis. Slice YZ plane (x=0)
          y = u;
          z = v;
          sliceLabel = 'COUPE 2D (X=0)';
        } else {
          // px, s -> lobes on X axis or spherical. Slice XY plane (z=0)
          x = u;
          y = v;
          sliceLabel = 'COUPE 2D (Z=0)';
        }
        
        // Pass sliceLabel to drawing or save it for the UI
        canvas.dataset.sliceLabel = sliceLabel;

        const psi = evaluateWavefunction(n, l, m, x, y, z);
        const density = psi * psi;
        
        if (density < 0.0001) continue;

        let r = 0, g = 0, b = 0, a = 0;
        
        if (viewMode === 'phase' || viewMode === 'heatmap') {
          // Opacity mapping
          const intensity = Math.min(density * 2.5 * 255, 255);
          a = intensity;
          
          if (psi >= 0) {
            // Positive Phase -> Cyan
            r = 0; g = 243; b = 255;
          } else {
            // Negative Phase -> Magenta
            r = 255; g = 0; b = 127;
          }
        } else if (viewMode === 'density') {
          // Density -> Monochrome heatmap
          const intensity = Math.min(density * 3.0 * 255, 255);
          r = 255; g = 255; b = 255;
          a = intensity;
        }

        // Fill 2x2 block for this resolution cell
        const startX = Math.floor(cx * scale);
        const startY = Math.floor(cy * scale);
        const endX = Math.floor((cx + 1) * scale);
        const endY = Math.floor((cy + 1) * scale);
        
        for (let iy = startY; iy < endY; iy++) {
          for (let ix = startX; ix < endX; ix++) {
            const idx = (iy * size + ix) * 4;
            data[idx] = r;
            data[idx+1] = g;
            data[idx+2] = b;
            data[idx+3] = a;
          }
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Overlay Axes
    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--surface-border').trim() || 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy); ctx.lineTo(cx + 20, cy);
    ctx.moveTo(cx, cy - 20); ctx.lineTo(cx, cy + 20);
    ctx.stroke();

  }, [n, l, m, viewMode, theme]);

  let sliceLabel = 'COUPE 2D (Z=0)';
  if (m === 0) sliceLabel = 'COUPE 2D (Y=0)';
  else if (m === -1) sliceLabel = 'COUPE 2D (X=0)';

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          maxWidth: '400px',
          aspectRatio: '1',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          border: '1px solid var(--as-border-inverse)'
        }}
        aria-label={`Visualisation orbitale quantique n=${n}, l=${l}, m=${m}`}
      />
      <div style={{ position: 'absolute', bottom: '10px', left: '20px', color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontFamily: 'var(--as-font-mono)' }}>
        {sliceLabel}
      </div>
    </div>
  );
};
