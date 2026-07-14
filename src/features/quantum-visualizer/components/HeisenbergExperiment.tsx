import React, { useEffect, useRef, useState } from 'react';
import { ScientificPanel } from '../../../components/shared/ScientificPanel';
import { ParameterSlider } from '../../../components/shared/ParameterSlider';
import { FormulaDisplay } from '../../../components/shared/FormulaDisplay';
import { drawMomentumWavePacket, drawSpaceWavePacket } from '../services/heisenbergCanvas';
import { useLanguage } from '../../../hooks/useLanguage';

export const HeisenbergExperiment: React.FC = () => {
  const { t } = useLanguage();
  const [dx, setDx] = useState(25);
  const spaceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const momentumCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const dp = 500 / dx;

  useEffect(() => {
    if (spaceCanvasRef.current) {
      drawSpaceWavePacket(spaceCanvasRef.current, dx);
    }
  }, [dx]);

  useEffect(() => {
    if (momentumCanvasRef.current) {
      drawMomentumWavePacket(momentumCanvasRef.current, dp);
    }
  }, [dp]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <ScientificPanel title={t('heisenberg.title', { ns: 'quantum' })} variant="primary">
        
        <div style={{ marginBottom: '20px' }}>
          <ParameterSlider
            label={t('heisenberg.uncertaintyPosition', { ns: 'quantum' })}
            value={dx}
            min={5} max={100} step={1}
            unit="pm"
            onChange={setDx}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Espace réel */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--as-border-inverse)' }}>
            <div style={{ fontSize: '12px', color: 'var(--as-accent-cyan)', marginBottom: '8px', textTransform: 'uppercase' }}>
              {t('heisenberg.space', { ns: 'quantum' })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <canvas ref={spaceCanvasRef} width={300} height={150} style={{ width: '100%', maxWidth: '300px', background: '#080b12', borderRadius: '4px' }} />
            </div>
            <div style={{ marginTop: '12px', textAlign: 'center', fontFamily: 'var(--as-font-mono)', fontSize: '14px', color: 'var(--as-accent-cyan)' }}>
              Δx = {dx} pm
            </div>
          </div>

          {/* Espace des impulsions */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--as-border-inverse)' }}>
            <div style={{ fontSize: '12px', color: 'var(--as-accent-magenta)', marginBottom: '8px', textTransform: 'uppercase' }}>
              {t('heisenberg.momentum', { ns: 'quantum' })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <canvas ref={momentumCanvasRef} width={300} height={150} style={{ width: '100%', maxWidth: '300px', background: '#080b12', borderRadius: '4px' }} />
            </div>
            <div style={{ marginTop: '12px', textAlign: 'center', fontFamily: 'var(--as-font-mono)', fontSize: '14px', color: '#ff007f' }}>
              Δp = {dp.toFixed(1)} u
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <FormulaDisplay 
            name={t('heisenberg.inequality', { ns: 'quantum' })}
            formula="Δx · Δp ≥ ℏ/2"
            variant="accent"
            description={t('heisenberg.description', { ns: 'quantum' })}
          />
        </div>

      </ScientificPanel>
    </div>
  );
};
