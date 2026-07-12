import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

export const Heisenberg: React.FC = () => {
  const { t } = useLanguage();
  const [dx, setDx] = useState(25); // position uncertainty (represented visually)

  const spaceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const momentumCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute momentum uncertainty based on Heisenberg: dx * dp >= k
  const dp = 500 / dx;

  useEffect(() => {
    // 1. Draw Space Wave Packet
    const sCanvas = spaceCanvasRef.current;
    if (!sCanvas) return;
    const sCtx = sCanvas.getContext('2d');
    if (!sCtx) return;

    const w = sCanvas.width;
    const h = sCanvas.height;
    const midX = w / 2;
    const midY = h / 2;

    sCtx.clearRect(0, 0, w, h);
    
    // Draw grid
    sCtx.strokeStyle = 'rgba(0, 243, 255, 0.02)';
    sCtx.lineWidth = 1;
    for (let i = 0; i < w; i += 20) {
      sCtx.beginPath(); sCtx.moveTo(i, 0); sCtx.lineTo(i, h); sCtx.stroke();
    }

    // Draw wave envelope
    sCtx.beginPath();
    sCtx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
    sCtx.fillStyle = 'rgba(0, 243, 255, 0.03)';
    sCtx.lineWidth = 1;
    sCtx.moveTo(0, midY);
    for (let x = 0; x < w; x++) {
      const dist = x - midX;
      // Gaussian envelope: e^(-x^2 / (2 * dx^2))
      const env = Math.exp(-Math.pow(dist, 2) / (2 * Math.pow(dx, 2)));
      const amp = env * (h * 0.4);
      sCtx.lineTo(x, midY - amp);
    }
    for (let x = w - 1; x >= 0; x--) {
      const dist = x - midX;
      const env = Math.exp(-Math.pow(dist, 2) / (2 * Math.pow(dx, 2)));
      const amp = env * (h * 0.4);
      sCtx.lineTo(x, midY + amp);
    }
    sCtx.closePath();
    sCtx.fill();
    sCtx.stroke();

    // Draw wave oscillation inside envelope: psi(x) = envelope * cos(k * x)
    sCtx.beginPath();
    sCtx.strokeStyle = 'var(--neon-cyan)';
    sCtx.lineWidth = 2;
    const kSpace = 0.25; // wave number (frequency of oscillation)
    for (let x = 0; x < w; x++) {
      const dist = x - midX;
      const env = Math.exp(-Math.pow(dist, 2) / (2 * Math.pow(dx, 2)));
      const yVal = midY - Math.cos(dist * kSpace) * env * (h * 0.4);
      if (x === 0) sCtx.moveTo(x, yVal);
      else sCtx.lineTo(x, yVal);
    }
    sCtx.stroke();

    // Label uncertainty bounds
    sCtx.strokeStyle = 'var(--neon-cyan)';
    sCtx.lineWidth = 1.5;
    sCtx.beginPath();
    sCtx.moveTo(midX - dx, midY + 45);
    sCtx.lineTo(midX + dx, midY + 45);
    sCtx.stroke();
    // tick marks
    sCtx.beginPath();
    sCtx.moveTo(midX - dx, midY + 40); sCtx.lineTo(midX - dx, midY + 50);
    sCtx.moveTo(midX + dx, midY + 40); sCtx.lineTo(midX + dx, midY + 50);
    sCtx.stroke();
    sCtx.fillStyle = 'var(--neon-cyan)';
    sCtx.font = '9px var(--font-mono)';
    sCtx.fillText('Δx', midX - 5, midY + 38);

  }, [dx]);

  useEffect(() => {
    // 2. Draw Momentum Probability Density (Fourier Transform domain)
    const mCanvas = momentumCanvasRef.current;
    if (!mCanvas) return;
    const mCtx = mCanvas.getContext('2d');
    if (!mCtx) return;

    const w = mCanvas.width;
    const h = mCanvas.height;
    const midX = w / 2;
    const midY = h / 2;

    mCtx.clearRect(0, 0, w, h);

    // Draw grid
    mCtx.strokeStyle = 'rgba(255, 0, 127, 0.02)';
    mCtx.lineWidth = 1;
    for (let i = 0; i < w; i += 20) {
      mCtx.beginPath(); mCtx.moveTo(i, 0); mCtx.lineTo(i, h); mCtx.stroke();
    }

    // Draw momentum envelope (Gaussian curve representing momentum probability)
    mCtx.beginPath();
    mCtx.strokeStyle = 'rgba(255, 0, 127, 0.15)';
    mCtx.fillStyle = 'rgba(255, 0, 127, 0.03)';
    mCtx.lineWidth = 1;
    mCtx.moveTo(0, midY);
    for (let x = 0; x < w; x++) {
      const dist = x - midX;
      // dp is momentum width. Envelope: e^(-p^2 / (2 * dp^2))
      const env = Math.exp(-Math.pow(dist, 2) / (2 * Math.pow(dp, 2)));
      const amp = env * (h * 0.4);
      mCtx.lineTo(x, midY - amp);
    }
    for (let x = w - 1; x >= 0; x--) {
      const dist = x - midX;
      const env = Math.exp(-Math.pow(dist, 2) / (2 * Math.pow(dp, 2)));
      const amp = env * (h * 0.4);
      mCtx.lineTo(x, midY + amp);
    }
    mCtx.closePath();
    mCtx.fill();
    mCtx.stroke();

    // Draw momentum wave packet (high-frequency wave representing complex momentum phase)
    mCtx.beginPath();
    mCtx.strokeStyle = 'var(--neon-magenta)';
    mCtx.lineWidth = 2;
    // Frequency increases when momentum packet is wider
    const kMom = 0.03 * dp;
    for (let x = 0; x < w; x++) {
      const dist = x - midX;
      const env = Math.exp(-Math.pow(dist, 2) / (2 * Math.pow(dp, 2)));
      const yVal = midY - Math.cos(dist * kMom) * env * (h * 0.4);
      if (x === 0) mCtx.moveTo(x, yVal);
      else mCtx.lineTo(x, yVal);
    }
    mCtx.stroke();

    // Label dp bounds
    mCtx.strokeStyle = 'var(--neon-magenta)';
    mCtx.lineWidth = 1.5;
    mCtx.beginPath();
    mCtx.moveTo(midX - dp, midY + 45);
    mCtx.lineTo(midX + dp, midY + 45);
    mCtx.stroke();
    mCtx.beginPath();
    mCtx.moveTo(midX - dp, midY + 40); mCtx.lineTo(midX - dp, midY + 50);
    mCtx.moveTo(midX + dp, midY + 40); mCtx.lineTo(midX + dp, midY + 50);
    mCtx.stroke();
    mCtx.fillStyle = 'var(--neon-magenta)';
    mCtx.font = '9px var(--font-mono)';
    mCtx.fillText('Δp', midX - 5, midY + 38);

  }, [dp]);

  return React.createElement('div', {
    className: 'glass-panel',
    style: {
      padding: '24px',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--neon-magenta)',
      boxShadow: '0 0 15px rgba(255, 0, 127, 0.05)',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '100%'
    }
  },
    React.createElement('h3', { style: { fontFamily: 'var(--font-title)', fontSize: '15px', color: 'var(--neon-magenta)', letterSpacing: '1px', alignSelf: 'stretch', textAlign: 'center' } },
      t('quantum.heisenberg').toUpperCase()
    ),

    // Sliders
    React.createElement('div', { style: { width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' } },
        React.createElement('span', null, t('quantum.position')),
        React.createElement('span', { style: { color: 'var(--neon-cyan)', fontWeight: 'bold' } }, `${dx} pm`)
      ),
      React.createElement('input', {
        type: 'range',
        min: 6,
        max: 60,
        step: 1,
        value: dx,
        onChange: (e) => setDx(parseInt(e.target.value)),
        style: { width: '100%', accentColor: 'var(--neon-cyan)' }
      }),

      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginTop: '8px' } },
        React.createElement('span', null, t('quantum.momentum')),
        React.createElement('span', { style: { color: 'var(--neon-magenta)', fontWeight: 'bold' } }, `${dp.toFixed(1)} N·s × 10⁻²⁴`)
      )
    ),

    // Canvas Outputs (side by side or vertical stacked depending on width)
    React.createElement('div', {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center',
        width: '100%'
      }
    },
      // Space canvas
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
        React.createElement('span', { style: { fontSize: '11px', fontFamily: 'var(--font-title)', color: 'var(--neon-cyan)', marginBottom: '6px' } },
          t('quantum.wavePacket').toUpperCase()
        ),
        React.createElement('canvas', {
          ref: spaceCanvasRef,
          width: 250,
          height: 150,
          style: { background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '4px' }
        })
      ),

      // Momentum canvas
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
        React.createElement('span', { style: { fontSize: '11px', fontFamily: 'var(--font-title)', color: 'var(--neon-magenta)', marginBottom: '6px' } },
          t('quantum.fourier').toUpperCase()
        ),
        React.createElement('canvas', {
          ref: momentumCanvasRef,
          width: 250,
          height: 150,
          style: { background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '4px' }
        })
      )
    ),

    // Readout math details
    React.createElement('div', {
      style: {
        alignSelf: 'stretch',
        background: 'rgba(0,0,0,0.15)',
        padding: '12px',
        borderRadius: '4px',
        borderLeft: '2px solid var(--neon-magenta)',
        fontFamily: 'var(--font-mono)',
        fontSize: '11.5px',
        color: 'var(--text-secondary)',
        lineHeight: '1.4'
      }
    },
      React.createElement('span', { style: { display: 'block', color: '#fff', fontWeight: 'bold', marginBottom: '4px' } },
        `Δx · Δp ≈ ${(dx * dp).toFixed(0)}  (constante ℏ/2)`
      ),
      "Plus la position d'une particule est déterminée avec précision (petit Δx), moins sa quantité de mouvement est connue avec précision (grand Δp), et vice versa."
    )
  );
};
