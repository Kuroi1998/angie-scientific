import React, { useEffect, useRef, useState } from 'react';
import { FormulaDisplay } from '../../../components/shared/FormulaDisplay';
import { ScientificPanel } from '../../../components/shared/ScientificPanel';
import { useLanguage } from '../../../hooks/useLanguage';

type HybridType = 'sp' | 'sp2' | 'sp3';

export const HybridizationModule: React.FC = () => {
  const { t } = useLanguage();
  const [hybrid, setHybrid] = useState<HybridType>('sp2');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, w * 0.4, 0, Math.PI * 2);
    ctx.stroke();

    const drawLobe = (angle: number, color1: string, color2: string, scale = 1) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      ctx.beginPath();
      const points = 100;
      for (let i = 0; i <= points; i++) {
        const theta = -Math.PI / 2 + (Math.PI * i) / points;
        const r = 60 * scale * Math.pow(Math.cos(theta) + 0.35, 2);
        const lx = r * Math.cos(theta);
        const ly = r * Math.sin(theta);
        if (i === 0) ctx.moveTo(lx, ly);
        else ctx.lineTo(lx, ly);
      }
      ctx.closePath();

      const grad = ctx.createRadialGradient(25, 0, 0, 20, 0, 60);
      grad.addColorStop(0, color1);
      grad.addColorStop(1, color2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = color1;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    };

    ctx.fillStyle = '#fff';
    ctx.font = '10px monospace';

    if (hybrid === 'sp') {
      drawLobe(0, '#18b8c8', 'rgba(24, 184, 200, 0.1)');
      drawLobe(Math.PI, '#ef6b5b', 'rgba(239, 107, 91, 0.1)');
      ctx.fillText('180°', cx - 12, cy - 20);
    } else if (hybrid === 'sp2') {
      drawLobe(0, '#18b8c8', 'rgba(24, 184, 200, 0.1)');
      drawLobe((2 * Math.PI) / 3, '#ef6b5b', 'rgba(239, 107, 91, 0.1)');
      drawLobe((4 * Math.PI) / 3, '#7c6ee6', 'rgba(124, 110, 230, 0.1)');
      ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() || 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, (2 * Math.PI) / 3);
      ctx.stroke();
      ctx.fillText('120°', cx + 18, cy + 24);
    } else if (hybrid === 'sp3') {
      drawLobe(-Math.PI / 2, '#18b8c8', 'rgba(24, 184, 200, 0.1)', 0.95);
      drawLobe((5 * Math.PI) / 6, '#ef6b5b', 'rgba(239, 107, 91, 0.1)', 0.95);
      drawLobe(Math.PI / 6, '#7c6ee6', 'rgba(124, 110, 230, 0.1)', 0.95);
      drawLobe((3 * Math.PI) / 4, 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0.12)', 0.6);
      ctx.fillText('109.5°', cx - 18, cy + 25);
    }

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.stroke();
  }, [hybrid]);

  const getDetails = () => {
    switch (hybrid) {
      case 'sp':
        return { formula: 'h_i = 1/√2 (s ± p_x)', geom: t('hybrid.geom_sp', { ns: 'quantum' }), angle: '180°', desc: t('hybrid.desc_sp', { ns: 'quantum' }) };
      case 'sp2':
        return { formula: 'h_i = 1/√3 s + √2/√3 p_i', geom: t('hybrid.geom_sp2', { ns: 'quantum' }), angle: '120°', desc: t('hybrid.desc_sp2', { ns: 'quantum' }) };
      case 'sp3':
        return { formula: 'h_i = 1/2 (s + p_x + p_y + p_z)', geom: t('hybrid.geom_sp3', { ns: 'quantum' }), angle: '109.5°', desc: t('hybrid.desc_sp3', { ns: 'quantum' }) };
    }
  };

  const details = getDetails();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', width: '100%' }}>
      <ScientificPanel title={t('hybrid.title', { ns: 'quantum' })} variant="primary">
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {(['sp', 'sp2', 'sp3'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setHybrid(type)}
              style={{
                flex: 1, padding: '10px',
                background: hybrid === type ? 'var(--as-surface-inverse)' : 'transparent',
                color: hybrid === type ? 'var(--as-text-inverse)' : 'var(--as-text-muted)',
                border: `1px solid ${hybrid === type ? 'var(--as-accent-cyan)' : 'var(--as-border-inverse)'}`,
                borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--as-font-mono)', fontSize: '14px'
              }}
            >
              {type}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '8px' }}>
            <canvas ref={canvasRef} width={250} height={250} style={{ width: '100%', maxWidth: '250px', filter: 'drop-shadow(0 0 10px rgba(24,184,200,0.2))' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--as-surface-2)', padding: '16px', borderRadius: '4px', border: '1px solid var(--as-border-subtle)' }}>
              <div style={{ fontSize: '12px', color: 'var(--as-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>{t('hybrid.geometry', { ns: 'quantum' })}</div>
              <div style={{ fontSize: '20px', color: 'var(--as-text-primary)' }}>{details.geom} ({details.angle})</div>
            </div>

            <FormulaDisplay
              name={t('hybrid.hybridType', { ns: 'quantum' }) + ` ${hybrid}`}
              formula={details.formula}
              description={details.desc}
            />
          </div>
        </div>
      </ScientificPanel>
    </div>
  );
};
