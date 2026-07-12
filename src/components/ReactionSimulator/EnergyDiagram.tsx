import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

interface EnergyDiagramProps {
  dH: number; // Enthalpy in kJ/mol
}

export const EnergyDiagram: React.FC<EnergyDiagramProps> = ({ dH }) => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1

  // Set activation energy
  const Ea = dH < 0 ? 50 : 50 + dH; // Activation energy estimation
  const reactantEnergy = 150; // reactant y coordinate
  const productEnergy = reactantEnergy + (dH * 0.5); // product y coordinate (dH is scaled)
  const peakEnergy = reactantEnergy - (Ea * 0.5); // transition state height

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      // Draw Grid Lines (cyberpunk look)
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.02)';
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 20) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
      }
      for (let j = 0; j < h; j += 20) {
        ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(w, j); ctx.stroke();
      }

      // Draw Axes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      // Y axis (Energy)
      ctx.moveTo(40, 20);
      ctx.lineTo(40, h - 30);
      // X axis (Reaction Coordinate)
      ctx.lineTo(w - 20, h - 30);
      ctx.stroke();

      // Axis Labels
      ctx.fillStyle = 'var(--text-secondary)';
      ctx.font = '10px var(--font-title)';
      ctx.fillText('ENERGY', 10, 15);
      ctx.fillText('COORDINATE', w - 90, h - 12);

      // Define Curve Coordinates
      const pR = { x: 50, y: reactantEnergy }; // Reactants
      const pTS = { x: w / 2, y: peakEnergy }; // Transition State
      const pP = { x: w - 60, y: productEnergy }; // Products

      // Draw Potential Energy Curve (Bezier)
      ctx.beginPath();
      ctx.moveTo(pR.x, pR.y);
      // Control points for smooth curves
      ctx.bezierCurveTo(w * 0.25, pR.y, w * 0.35, pTS.y, pTS.x, pTS.y);
      ctx.bezierCurveTo(w * 0.65, pTS.y, w * 0.75, pP.y, pP.x, pP.y);
      
      ctx.strokeStyle = dH < 0 ? 'var(--neon-cyan)' : 'var(--neon-magenta)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Add a neon glow to the curve
      ctx.strokeStyle = dH < 0 ? 'rgba(0, 243, 255, 0.2)' : 'rgba(255, 0, 127, 0.2)';
      ctx.lineWidth = 8;
      ctx.stroke();

      // Label Points
      ctx.fillStyle = '#fff';
      ctx.font = '9px var(--font-mono)';
      ctx.fillText('REACTANTS', pR.x - 20, pR.y - 12);
      ctx.fillText('PRODUCTS', pP.x - 20, pP.y - 12);
      ctx.fillText('T.S.', pTS.x - 8, pTS.y - 12);

      // Draw Energy Level lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      
      // Reactant energy line
      ctx.beginPath(); ctx.moveTo(pR.x, pR.y); ctx.lineTo(pP.x, pR.y); ctx.stroke();
      // Product energy line
      ctx.beginPath(); ctx.moveTo(pP.x, pP.y); ctx.lineTo(pP.x + 40, pP.y); ctx.stroke();
      
      ctx.setLineDash([]); // Reset dash

      // Draw Enthalpy ΔH Arrow
      ctx.strokeStyle = 'var(--neon-magenta)';
      ctx.fillStyle = 'var(--neon-magenta)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(pP.x + 20, pR.y);
      ctx.lineTo(pP.x + 20, pP.y);
      ctx.stroke();
      
      // Draw arrow head
      const arrowDir = dH > 0 ? -1 : 1; // direction of arrow
      ctx.beginPath();
      ctx.moveTo(pP.x + 16, pP.y - (4 * arrowDir));
      ctx.lineTo(pP.x + 20, pP.y);
      ctx.lineTo(pP.x + 24, pP.y - (4 * arrowDir));
      ctx.fill();

      // Label ΔH value next to arrow
      ctx.fillStyle = 'var(--neon-magenta)';
      ctx.fillText(`ΔH = ${dH} kJ`, pP.x + 28, (pR.y + pP.y) / 2 + 3);

      // 4. Animation Ball along Bezier Curve
      if (isPlaying) {
        // Calculate point on bezier curve at given progress t
        const t = progress;
        
        // Bezier formula splits curve into two halves for simpler coordinates
        let bx, by;
        if (t < 0.5) {
          const nt = t * 2;
          // Curve 1: Reactant to Transition State
          // P0 = pR, P1 = (w * 0.25, pR.y), P2 = (w * 0.35, pTS.y), P3 = pTS
          const cp1x = w * 0.25;
          const cp1y = pR.y;
          const cp2x = w * 0.35;
          const cp2y = pTS.y;
          
          bx = Math.pow(1 - nt, 3) * pR.x + 3 * Math.pow(1 - nt, 2) * nt * cp1x + 3 * (1 - nt) * Math.pow(nt, 2) * cp2x + Math.pow(nt, 3) * pTS.x;
          by = Math.pow(1 - nt, 3) * pR.y + 3 * Math.pow(1 - nt, 2) * nt * cp1y + 3 * (1 - nt) * Math.pow(nt, 2) * cp2y + Math.pow(nt, 3) * pTS.y;
        } else {
          const nt = (t - 0.5) * 2;
          // Curve 2: Transition State to Product
          // P0 = pTS, P1 = (w * 0.65, pTS.y), P2 = (w * 0.75, pP.y), P3 = pP
          const cp1x = w * 0.65;
          const cp1y = pTS.y;
          const cp2x = w * 0.75;
          const cp2y = pP.y;
          
          bx = Math.pow(1 - nt, 3) * pTS.x + 3 * Math.pow(1 - nt, 2) * nt * cp1x + 3 * (1 - nt) * Math.pow(nt, 2) * cp2x + Math.pow(nt, 3) * pP.x;
          by = Math.pow(1 - nt, 3) * pTS.y + 3 * Math.pow(1 - nt, 2) * nt * cp1y + 3 * (1 - nt) * Math.pow(nt, 2) * cp2y + Math.pow(nt, 3) * pP.y;
        }

        // Draw rolling particle
        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, 8);
        grad.addColorStop(0, '#fff');
        grad.addColorStop(0.3, dH < 0 ? 'var(--neon-cyan)' : 'var(--neon-magenta)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bx, by, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [dH, isPlaying, progress, peakEnergy, productEnergy]);

  // Handle animation trigger
  useEffect(() => {
    if (!isPlaying) return;

    let startTime = Date.now();
    const duration = 2000; // 2 seconds

    const updateAnim = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      setProgress(t);

      if (t < 1) {
        requestAnimationFrame(updateAnim);
      } else {
        setIsPlaying(false);
      }
    };

    updateAnim();
  }, [isPlaying]);

  const triggerAnimation = () => {
    if (isPlaying) return;
    setProgress(0);
    setIsPlaying(true);
  };

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' } },
    React.createElement('canvas', {
      ref: canvasRef,
      width: 450,
      height: 250,
      style: {
        width: '100%',
        maxWidth: '450px',
        background: 'rgba(0,0,0,0.15)',
        border: '1px solid var(--glass-border)',
        borderRadius: '4px'
      }
    }),
    React.createElement('button', {
      onClick: triggerAnimation,
      disabled: isPlaying,
      style: {
        marginTop: '12px',
        padding: '8px 20px',
        background: 'transparent',
        border: '1px solid var(--neon-cyan)',
        borderRadius: '4px',
        color: 'var(--neon-cyan)',
        fontFamily: 'var(--font-title)',
        fontSize: '11px',
        cursor: isPlaying ? 'not-allowed' : 'pointer',
        boxShadow: 'var(--glow-cyan)',
        transition: 'all 0.2s',
        opacity: isPlaying ? 0.6 : 1
      }
    },
      isPlaying ? "REACTION IN PROGRESS..." : t('fusion.simulate').toUpperCase()
    )
  );
};
