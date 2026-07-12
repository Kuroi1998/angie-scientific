import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

export const KineticsEquilibrium: React.FC = () => {
  const { t } = useLanguage();
  
  const [temp, setTemp] = useState<number>(300); // Temperature K
  const [ea, setEa] = useState<number>(30); // Ea in kJ/mol

  // Concentrations
  const [concA, setConcA] = useState<number>(2.0);
  const [concB, setConcB] = useState<number>(2.0);
  const [concC, setConcC] = useState<number>(0.0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const historyRef = useRef<{ a: number; c: number }[]>([]);

  // Calculate rate constants from Arrhenius
  const R = 8.314;
  // Scaled constants to make simulation visible in real-time
  const kf = 1.2 * Math.exp(-ea * 1000 / (R * temp * 6.5));
  const kr = 0.3 * Math.exp(-(ea + 10) * 1000 / (R * temp * 6.5)); // exothermic, reverse Ea is ea + 10

  useEffect(() => {
    // Initialize history
    if (historyRef.current.length === 0) {
      historyRef.current = Array.from({ length: 150 }, () => ({ a: 2.0, c: 0.0 }));
    }
  }, []);

  // Simulation step running at ~30fps
  useEffect(() => {
    const interval = setInterval(() => {
      setConcA(currentA => {
        let currentC = 0;
        let currentB = 0;
        setConcC(c => { currentC = c; return c; });
        setConcB(b => { currentB = b; return b; });

        // Forward and reverse rates
        const vf = kf * currentA * currentB;
        const vr = kr * currentC;

        const dt = 0.1;
        const delta = (vf - vr) * dt;

        // Apply bounds to prevent negative concentrations
        const nextA = Math.max(currentA - delta, 0);
        const nextC = Math.max(currentC + delta, 0);
        
        // Update B correspondingly
        setConcB(b => Math.max(b - delta, 0));
        setConcC(nextC);

        // Save to history list
        const hist = historyRef.current;
        hist.push({ a: nextA, c: nextC });
        if (hist.length > 150) hist.shift();

        return nextA;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [kf, kr]);

  // Graph renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.02)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 30) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
    }
    for (let j = 0; j < h; j += 30) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(w, j); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(35, 10);
    ctx.lineTo(35, h - 25);
    ctx.lineTo(w - 10, h - 25);
    ctx.stroke();

    // Labels
    ctx.fillStyle = 'var(--text-secondary)';
    ctx.font = '9px var(--font-mono)';
    ctx.fillText('CONC (M)', 5, 18);
    ctx.fillText('TIME (t)', w - 50, h - 10);

    const hist = historyRef.current;
    if (hist.length < 2) return;

    const getX = (idx: number) => 35 + (idx * (w - 45)) / 150;
    // Map concentration range 0-3 M to height
    const getY = (val: number) => h - 25 - (val * (h - 40)) / 3.0;

    // Draw curve A (Reactant)
    ctx.beginPath();
    ctx.strokeStyle = 'var(--neon-magenta)';
    ctx.lineWidth = 2.5;
    ctx.moveTo(getX(0), getY(hist[0].a));
    for (let i = 1; i < hist.length; i++) {
      ctx.lineTo(getX(i), getY(hist[i].a));
    }
    ctx.stroke();

    // Draw curve C (Product)
    ctx.beginPath();
    ctx.strokeStyle = 'var(--neon-green)';
    ctx.lineWidth = 2.5;
    ctx.moveTo(getX(0), getY(hist[0].c));
    for (let i = 1; i < hist.length; i++) {
      ctx.lineTo(getX(i), getY(hist[i].c));
    }
    ctx.stroke();

  }, [concA, concC]);

  const injectReactantA = () => {
    // Add 1.0 M of reactant A instantly
    setConcA(prev => prev + 1.0);
    setConcB(prev => prev + 1.0);
  };

  return React.createElement('div', {
    className: 'glass-panel',
    style: {
      padding: '24px',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--neon-magenta)',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }
  },
    React.createElement('h3', { style: { fontFamily: 'var(--font-title)', fontSize: '15px', color: 'var(--neon-magenta)', letterSpacing: '1px', alignSelf: 'stretch', textAlign: 'center' } },
      t('phys.kinetics').toUpperCase()
    ),

    // Sliders
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', width: '100%' } },
      React.createElement('div', null,
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-title)', color: 'var(--text-secondary)', marginBottom: '6px' } },
          React.createElement('span', null, t('phys.kinetics.temp')),
          React.createElement('span', { style: { color: 'var(--neon-yellow)', fontFamily: 'var(--font-mono)' } }, `${temp} K`)
        ),
        React.createElement('input', {
          type: 'range',
          min: 150,
          max: 600,
          step: 10,
          value: temp,
          onChange: (e) => setTemp(parseInt(e.target.value)),
          style: { width: '100%', accentColor: 'var(--neon-yellow)' }
        })
      ),
      React.createElement('div', null,
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-title)', color: 'var(--text-secondary)', marginBottom: '6px' } },
          React.createElement('span', null, "ACTIVATION ENERGY (Ea)"),
          React.createElement('span', { style: { color: 'var(--neon-magenta)', fontFamily: 'var(--font-mono)' } }, `${ea} kJ/mol`)
        ),
        React.createElement('input', {
          type: 'range',
          min: 15,
          max: 65,
          step: 1,
          value: ea,
          onChange: (e) => setEa(parseInt(e.target.value)),
          style: { width: '100%', accentColor: 'var(--neon-magenta)' }
        })
      )
    ),

    // Graph Area & Injector
    React.createElement('div', {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
      }
    },
      React.createElement('canvas', {
        ref: canvasRef,
        width: 320,
        height: 180,
        style: { background: '#000', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }
      }),

      // Control stats & Inject button
      React.createElement('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          minWidth: '180px',
          fontFamily: 'var(--font-mono)'
        }
      },
        React.createElement('div', null,
          React.createElement('span', { style: { display: 'block', fontSize: '9px', color: 'var(--text-secondary)' } }, "RATE kf (FORWARD)"),
          React.createElement('span', { style: { color: 'var(--neon-green)', fontWeight: 'bold' } }, kf.toFixed(4))
        ),
        React.createElement('div', null,
          React.createElement('span', { style: { display: 'block', fontSize: '9px', color: 'var(--text-secondary)' } }, "RATE kr (REVERSE)"),
          React.createElement('span', { style: { color: 'var(--neon-magenta)', fontWeight: 'bold' } }, kr.toFixed(4))
        ),
        React.createElement('div', null,
          React.createElement('span', { style: { display: 'block', fontSize: '9px', color: 'var(--text-secondary)' } }, "EQUILIBRIUM CONST K"),
          React.createElement('span', { style: { color: 'var(--neon-yellow)', fontWeight: 'bold' } }, (kf / kr).toFixed(2))
        ),
        React.createElement('button', {
          onClick: injectReactantA,
          style: {
            padding: '8px 12px',
            background: 'transparent',
            border: '1px solid var(--neon-cyan)',
            borderRadius: '4px',
            color: 'var(--neon-cyan)',
            fontSize: '11px',
            fontFamily: 'var(--font-title)',
            cursor: 'pointer',
            boxShadow: 'var(--glow-cyan)',
            transition: 'all 0.2s',
            marginTop: '6px'
          }
        },
          t('phys.kinetics.inject').toUpperCase()
        )
      )
    ),

    // Legend
    React.createElement('div', {
      style: {
        display: 'flex',
        gap: '20px',
        fontSize: '10px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-secondary)',
        justifyContent: 'center',
        width: '100%',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: '10px'
      }
    },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
        React.createElement('div', { style: { width: '12px', height: '3px', background: 'var(--neon-magenta)' } }),
        `REACTANT A (${concA.toFixed(1)} M)`
      ),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
        React.createElement('div', { style: { width: '12px', height: '3px', background: 'var(--neon-magenta)', opacity: 0.6 } }),
        `REACTANT B (${concB.toFixed(1)} M)`
      ),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
        React.createElement('div', { style: { width: '12px', height: '3px', background: 'var(--neon-green)' } }),
        `PRODUCT C (${concC.toFixed(1)} M)`
      ),
      React.createElement('span', { style: { color: 'var(--neon-yellow)' } }, "REACTION: A + B ⇄ C")
    )
  );
};
