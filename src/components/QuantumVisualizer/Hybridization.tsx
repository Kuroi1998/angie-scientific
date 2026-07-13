import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { resolveCssColor } from '../../utils/resolveCssColor';
import { resolveCssFont } from '../../utils/resolveCssFont';

type HybridType = 'sp' | 'sp2' | 'sp3';

export const Hybridization: React.FC = () => {
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
    const monoFont = resolveCssFont('10px var(--font-mono)');

    ctx.clearRect(0, 0, w, h);

    // Draw background telemetry circle
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.03)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, w * 0.4, 0, Math.PI * 2);
    ctx.stroke();

    // Helper: Draw a single orbital lobe pointing at an angle
    const drawLobe = (angle: number, color1: string, color2: string, scale: number = 1) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      ctx.beginPath();
      // Lobe is mathematically approximated as r = (cos(theta) + 0.5)^2 for asymmetric s+p blend
      const points = 100;
      for (let i = 0; i <= points; i++) {
        // sweep theta from -PI/2 to PI/2
        const theta = -Math.PI / 2 + (Math.PI * i) / points;
        // asymmetric profile
        const r = 60 * scale * Math.pow(Math.cos(theta) + 0.35, 2);
        const lx = r * Math.cos(theta);
        const ly = r * Math.sin(theta);

        if (i === 0) ctx.moveTo(lx, ly);
        else ctx.lineTo(lx, ly);
      }
      ctx.closePath();

      // Create a nice gradient
      const resolvedColor1 = resolveCssColor(color1, '#00f3ff');
      const resolvedColor2 = resolveCssColor(color2, 'rgba(0, 243, 255, 0.1)');
      const grad = ctx.createRadialGradient(25, 0, 0, 20, 0, 60);
      grad.addColorStop(0, resolvedColor1);
      grad.addColorStop(1, resolvedColor2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Add a thin border
      ctx.strokeStyle = resolvedColor1;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
    };

    if (hybrid === 'sp') {
      // Linear: 2 lobes at 0 and 180 degrees
      drawLobe(0, 'var(--neon-cyan)', 'rgba(0, 243, 255, 0.1)');
      drawLobe(Math.PI, 'var(--neon-magenta)', 'rgba(255, 0, 127, 0.1)');

      // Draw angle text
      ctx.fillStyle = '#fff';
      ctx.font = monoFont;
      ctx.fillText('180°', cx - 12, cy - 20);
    } 
    else if (hybrid === 'sp2') {
      // Trigonal planar: 3 lobes at 0, 120 (2PI/3) and 240 (4PI/3)
      drawLobe(0, 'var(--neon-cyan)', 'rgba(0, 243, 255, 0.1)');
      drawLobe((2 * Math.PI) / 3, 'var(--neon-magenta)', 'rgba(255, 0, 127, 0.1)');
      drawLobe((4 * Math.PI) / 3, 'var(--neon-purple)', 'rgba(157, 0, 255, 0.1)');

      // Draw angle arc
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, (2 * Math.PI) / 3);
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = monoFont;
      ctx.fillText('120°', cx + 18, cy + 24);
    } 
    else if (hybrid === 'sp3') {
      // Tetrahedral: 4 lobes (represented in projected 3D perspective)
      // Straight up
      drawLobe(-Math.PI / 2, 'var(--neon-cyan)', 'rgba(0, 243, 255, 0.1)', 0.95);
      // Down-left
      drawLobe((5 * Math.PI) / 6, 'var(--neon-magenta)', 'rgba(255, 0, 127, 0.1)', 0.95);
      // Down-right
      drawLobe(Math.PI / 6, 'var(--neon-purple)', 'rgba(157, 0, 255, 0.1)', 0.95);
      // Behind (smaller scale and transparency to simulate depth)
      drawLobe((3 * Math.PI) / 4, 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0.05)', 0.6);

      // Label angle
      ctx.fillStyle = '#fff';
      ctx.font = monoFont;
      ctx.fillText('109.5°', cx - 18, cy + 25);
    }

    // Draw central carbon nucleus dot
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();

  }, [hybrid]);

  const getDetails = () => {
    switch (hybrid) {
      case 'sp':
        return {
          formula: 'h_i = 1/√2 (s ± p_x)',
          geom: 'Linéaire / Lineal',
          angle: '180°',
          desc: 'Formée par la combinaison d\'une orbitale s et d\'une orbitale p. Présente dans l\'éthyne (acétylène) et le dioxyde de carbone.'
        };
      case 'sp2':
        return {
          formula: 'h_1 = 1/√3 s + √2/3 p_x',
          geom: 'Trigonale Plane / Trigonal Planar',
          angle: '120°',
          desc: 'Formée par la combinaison d\'une orbitale s et de deux orbitales p. Présente dans l\'éthène (éthylène) et le graphite.'
        };
      case 'sp3':
        return {
          formula: 'h_1 = 1/2 (s + p_x + p_y + p_z)',
          geom: 'Tétraédrique / Tetraédrico',
          angle: '109.5°',
          desc: 'Formée par la combinaison d\'une orbitale s et de trois orbitales p. Présente dans le méthane et le diamant.'
        };
    }
  };

  const details = getDetails();

  return React.createElement('div', {
    className: 'glass-panel',
    style: {
      padding: '24px',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--neon-purple)',
      boxShadow: '0 0 15px rgba(157, 0, 255, 0.05)',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      width: '100%'
    }
  },
    React.createElement('h3', { style: { fontFamily: 'var(--font-title)', fontSize: '15px', color: 'var(--neon-purple)', letterSpacing: '1px', alignSelf: 'stretch', textAlign: 'center' } },
      t('quantum.hybrid').toUpperCase()
    ),

    // Hybridization tabs
    React.createElement('div', {
      style: {
        display: 'flex',
        gap: '12px'
      }
    },
      (['sp', 'sp2', 'sp3'] as const).map(t => {
        const active = hybrid === t;
        return React.createElement('button', {
          key: t,
          onClick: () => setHybrid(t),
          style: {
            padding: '6px 20px',
            background: active ? 'rgba(157, 0, 255, 0.1)' : 'var(--bg-tertiary)',
            border: `1px solid ${active ? 'var(--neon-purple)' : 'var(--glass-border)'}`,
            borderRadius: '4px',
            color: active ? '#fff' : 'var(--text-secondary)',
            fontFamily: 'var(--font-title)',
            fontSize: '11px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: active ? 'var(--glow-purple)' : 'none'
          }
        }, t.toUpperCase());
      })
    ),

    // Canvas Plot
    React.createElement('canvas', {
      ref: canvasRef,
      width: 250,
      height: 200,
      role: 'img',
      'aria-label': `${t('quantum.hybrid')} ${hybrid.toUpperCase()} — ${details?.geom ?? ''}, ${details?.angle ?? ''}`,
      style: {
        display: 'block',
        borderRadius: '4px',
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid var(--glass-border)'
      }
    }),

    // Formula & details
    React.createElement('div', {
      style: {
        alignSelf: 'stretch',
        background: 'rgba(0,0,0,0.15)',
        padding: '12px',
        borderRadius: '4px',
        borderLeft: '2px solid var(--neon-purple)',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px'
      }
    },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' } },
        React.createElement('span', { style: { color: 'var(--text-secondary)' } }, "GEOMETRY:"),
        React.createElement('span', { style: { color: '#fff', fontWeight: 'bold' } }, details.geom.toUpperCase())
      ),
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' } },
        React.createElement('span', { style: { color: 'var(--text-secondary)' } }, "BOND ANGLE:"),
        React.createElement('span', { style: { color: 'var(--neon-purple)', fontWeight: 'bold' } }, details.angle)
      ),
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' } },
        React.createElement('span', { style: { color: 'var(--text-secondary)' } }, "WAVEFUNCTION:"),
        React.createElement('span', { style: { color: 'var(--neon-yellow)' } }, details.formula)
      ),
      React.createElement('p', { style: { fontSize: '11px', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px', lineHeight: '1.4' } },
        details.desc
      )
    )
  );
};
