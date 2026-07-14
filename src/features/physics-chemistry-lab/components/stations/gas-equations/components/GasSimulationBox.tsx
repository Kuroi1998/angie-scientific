import React, { useEffect, useRef, useState } from 'react';
import type { GasState } from '../types/gas.types';
import { gasDatabase } from '../data/gasDatabase';
import { animateGasCanvases } from '../services/gasSimulation.service';
import { useLanguage } from '../../../../../../hooks/useLanguage';

interface GasSimulationBoxProps {
  state: GasState;
  onUpdateState: (key: keyof GasState, val: any) => void;
}

export const GasSimulationBox: React.FC<GasSimulationBoxProps> = ({ state, onUpdateState }) => {
  const idealCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const vdwCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const { t } = useLanguage('lab');

  useEffect(() => {
    if (!idealCanvasRef.current || !vdwCanvasRef.current) return;
    const gas = gasDatabase[state.gasKey];
    
    const cleanup = animateGasCanvases({
      idealCanvas: idealCanvasRef.current,
      vdwCanvas: vdwCanvasRef.current,
      volume: state.volume,
      temp: state.temperature,
      gas,
      particlesMultiplier: state.particlesMultiplier,
      speed: state.simulationSpeed,
      isPaused
    });

    return cleanup;
  }, [state.volume, state.temperature, state.gasKey, state.particlesMultiplier, state.simulationSpeed, isPaused]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--as-font-title)', fontSize: '11px', color: 'color-mix(in srgb, var(--as-accent-cyan) 75%, var(--as-text-primary) 25%)', marginBottom: '8px' }}>{t('gas.simulation.idealTitle')}</span>
          <canvas
            ref={idealCanvasRef}
            width={240} height={200}
            style={{ background: 'var(--surface-inverse)', border: '1px solid var(--as-border-inverse)', borderRadius: '8px' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--as-font-title)', fontSize: '11px', color: 'color-mix(in srgb, var(--as-accent-magenta) 75%, var(--as-text-primary) 25%)', marginBottom: '8px' }}>{t('gas.simulation.vdwTitle')}</span>
          <canvas
            ref={vdwCanvasRef}
            width={240} height={200}
            style={{ background: 'var(--surface-inverse)', border: '1px solid var(--as-border-inverse)', borderRadius: '8px' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '8px', background: 'var(--surface-card)', borderRadius: '8px' }}>
        <button
          onClick={() => setIsPaused(!isPaused)}
          style={{ padding: '6px 12px', background: isPaused ? 'var(--as-accent-green)' : 'transparent', color: isPaused ? '#000' : 'var(--as-text-primary)', border: '1px solid var(--as-border-inverse)', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--as-font-title)', fontSize: '11px' }}
        >
          {isPaused ? t('gas.simulation.play') : t('gas.simulation.pause')}
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '16px' }}>
          <span style={{ fontSize: '10px', color: 'var(--as-text-muted)' }}>{t('gas.simulation.particleDensity')}</span>
          <input type="range" min={0.2} max={2} step={0.2} value={state.particlesMultiplier} onChange={e => onUpdateState('particlesMultiplier', parseFloat(e.target.value))} style={{ width: '60px' }} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
          <span style={{ fontSize: '10px', color: 'var(--as-text-muted)' }}>{t('gas.simulation.simSpeed')}</span>
          <input type="range" min={0.1} max={3} step={0.1} value={state.simulationSpeed} onChange={e => onUpdateState('simulationSpeed', parseFloat(e.target.value))} style={{ width: '60px' }} />
        </div>
      </div>
      
      <div style={{ fontSize: '10px', color: 'var(--as-text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
        {t('gas.simulation.disclaimer')}
      </div>
    </div>
  );
};
