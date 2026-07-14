import React, { useEffect, useRef } from 'react';
import type { PhaseState, SubstanceParams } from '../types/phase.types';
import { ScientificPanel } from '../../../../../../components/shared/ScientificPanel';
import { useLanguage } from '../../../../../../hooks/useLanguage';

interface MolecularPhaseSimulationProps {
  phase: PhaseState;
  substance: SubstanceParams;
  temperature: number;
  pressure: number;
}

export const MolecularPhaseSimulation: React.FC<MolecularPhaseSimulationProps> = ({ phase, substance, temperature, pressure }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { t } = useLanguage('lab');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    
    // Normalize T and P to determine agitation and density
    const tRatio = (temperature - substance.minT) / (substance.maxT - substance.minT);
    const speed = 0.2 + tRatio * 2.0; 
    
    // Density affected by pressure, mostly visible in gas/supercritical
    const pRatio = Math.log10(pressure / substance.minP) / Math.log10(substance.maxP / substance.minP);
    const densitySpread = phase === 'gas' ? 20 - pRatio * 15 : phase === 'supercritical' ? 5 : 2;

    const draw = (tick: number) => {
      const w = canvas.width;
      const h = canvas.height;
      
      ctx.clearRect(0, 0, w, h);
      
      const numParticles = 64;
      ctx.fillStyle = substance.color;

      for (let i = 0; i < numParticles; i++) {
        const col = i % 8;
        const row = Math.floor(i / 8);
        
        let x = 40 + col * 20;
        let y = 40 + row * 20;

        if (phase === 'solid') {
          // Strict lattice with small vibration
          x += Math.sin(tick * 0.1 * speed + i) * 1.5;
          y += Math.cos(tick * 0.1 * speed + i) * 1.5;
        } else if (phase === 'liquid') {
          // Loose structure, particles slide over each other
          x += Math.sin(tick * 0.05 * speed + i) * 8;
          y += Math.cos(tick * 0.04 * speed + i) * 8;
          // Confine to bottom slightly
          y = Math.min(y + 10, h - 20);
        } else if (phase === 'gas' || phase === 'supercritical') {
          // Random bouncing (simplified with math waves)
          const spreadX = phase === 'supercritical' ? w : w * densitySpread;
          const spreadY = phase === 'supercritical' ? h : h * densitySpread;
          
          x = (i * 37 + tick * speed) % spreadX;
          y = (i * 23 + tick * speed * 1.2) % spreadY;
          
          // Wrap around for gas to fill space
          if (x > w) x = x % w;
          if (y > h) y = y % h;
        }

        ctx.beginPath();
        ctx.arc(x, y, phase === 'gas' ? 3 : 4.5, 0, Math.PI * 2);
        ctx.fill();
        
        if (phase === 'supercritical' || phase === 'liquid') {
          ctx.strokeStyle = `${substance.color}44`;
          ctx.beginPath();
          ctx.arc(x, y, 7, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [phase, substance, temperature, pressure]);

  return (
    <ScientificPanel title={t('phase.charts.molecularBehavior')} variant="glass">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <canvas 
          ref={canvasRef} width={250} height={250} 
          style={{ background: 'var(--as-surface-inverse)', borderRadius: '4px', maxWidth: '100%' }}
        />
      </div>
    </ScientificPanel>
  );
};
