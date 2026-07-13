import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { resolveCssColor } from '../../utils/resolveCssColor';
import { resolveCssFont } from '../../utils/resolveCssFont';

interface SubstanceParams {
  name: string;
  tripleT: number; // K
  tripleP: number; // bar
  criticalT: number; // K
  criticalP: number; // bar
  minT: number;
  maxT: number;
  minP: number;
  maxP: number;
}

const substances: Record<string, SubstanceParams> = {
  co2: {
    name: "Carbon Dioxide (CO₂)",
    tripleT: 216.6,
    tripleP: 5.18,
    criticalT: 304.2,
    criticalP: 73.8,
    minT: 150,
    maxT: 350,
    minP: 0.1,
    maxP: 100
  },
  water: {
    name: "Water (H₂O)",
    tripleT: 273.16,
    tripleP: 0.006,
    criticalT: 647.1,
    criticalP: 220.6,
    minT: 200,
    maxT: 750,
    minP: 0.001,
    maxP: 250
  }
};

export const PhaseDiagram: React.FC = () => {
  const { t } = useLanguage();
  const [subKey, setSubKey] = useState<string>('co2');
  const sub = substances[subKey];

  const [temp, setTemp] = useState<number>(250); // Kelvin
  const [pressure, setPressure] = useState<number>(30); // bar

  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const molecCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync temp and pressure limits when substance changes.
  // `sub` is a lookup into the static `substances` map, so its fields only
  // ever change together with `subKey` — listing them is safe and removes
  // the exhaustive-deps warning without altering when this effect fires.
  useEffect(() => {
    setTemp(Math.round((sub.minT + sub.maxT) / 2));
    setPressure(Math.round((sub.minP + sub.maxP) / 2));
  }, [subKey, sub.minT, sub.maxT, sub.minP, sub.maxP]);

  // Safe reference variable for evaluation
  const getPhaseSafe = (T: number, P: number): 'solid' | 'liquid' | 'gas' | 'supercritical' => {
    if (T >= sub.criticalT && P >= sub.criticalP) return 'supercritical';
    if (T < sub.tripleT) {
      const k = subKey === 'co2' ? 10 : 15;
      const P_sub = sub.tripleP * Math.exp(k * (1 - sub.tripleT / T));
      return P > P_sub ? 'solid' : 'gas';
    }
    const k_vap = subKey === 'co2' ? 8 : 13;
    const P_vap = sub.tripleP * Math.exp(k_vap * (1 - sub.tripleT / T));
    let P_melt = 0;
    if (subKey === 'water') {
      P_melt = sub.tripleP - 1500 * (T - sub.tripleT);
    } else {
      P_melt = sub.tripleP + 12 * (T - sub.tripleT);
    }
    if (P > P_melt) return 'solid';
    if (T > sub.tripleT && P > P_vap) return 'liquid';
    return 'gas';
  };

  const currentPhase = getPhaseSafe(temp, pressure);

  // Render P-T Grid
  useEffect(() => {
    const canvas = gridCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const textSecondary = resolveCssColor('var(--text-secondary)', '#8f9bb3');
    const neonMagenta = resolveCssColor('var(--neon-magenta)', '#ff007f');
    const neonCyan = resolveCssColor('var(--neon-cyan)', '#00f3ff');
    const neonYellow = resolveCssColor('var(--neon-yellow)', '#ffe600');
    const neonGreen = resolveCssColor('var(--neon-green)', '#39ff14');
    const monoFont = resolveCssFont('9px var(--font-mono)');
    const smallMonoFont = resolveCssFont('8px var(--font-mono)');
    const titleFont = resolveCssFont('bold 11px var(--font-title)');

    const padLeft = 45;
    const padBottom = 30;

    const getX = (tVal: number) => padLeft + ((tVal - sub.minT) / (sub.maxT - sub.minT)) * (w - padLeft - 15);
    const getY = (pVal: number) => h - padBottom - ((pVal - sub.minP) / (sub.maxP - sub.minP)) * (h - padBottom - 15);

    // Draw borders & axes
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padLeft, 10);
    ctx.lineTo(padLeft, h - padBottom);
    ctx.lineTo(w - 10, h - padBottom);
    ctx.stroke();

    // Axes labels
    ctx.fillStyle = textSecondary;
    ctx.font = monoFont;
    ctx.fillText('P (bar)', 5, 15);
    ctx.fillText('T (K)', w - 30, h - 12);

    // Draw Phase Boundary Curves
    const drawCurve = (startT: number, endT: number, func: (t: number) => number, color: string, dashed: boolean = false) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      if (dashed) ctx.setLineDash([4, 4]);
      ctx.beginPath();
      
      const steps = 50;
      for (let i = 0; i <= steps; i++) {
        const tVal = startT + (i / steps) * (endT - startT);
        const pVal = func(tVal);
        
        const cx = getX(tVal);
        const cy = getY(pVal);

        if (i === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      }
      ctx.stroke();
      ctx.setLineDash([]); // Reset
    };

    // Vaporization Curve
    const k_vap = subKey === 'co2' ? 8 : 13;
    const getP_vap = (t: number) => sub.tripleP * Math.exp(k_vap * (1 - sub.tripleT / t));
    drawCurve(sub.tripleT, sub.criticalT, getP_vap, neonMagenta);

    // Sublimation Curve
    const k_sub = subKey === 'co2' ? 10 : 15;
    const getP_sub = (t: number) => sub.tripleP * Math.exp(k_sub * (1 - sub.tripleT / t));
    drawCurve(sub.minT, sub.tripleT, getP_sub, neonCyan);

    // Melting Curve
    const getP_melt = (t: number) => {
      if (subKey === 'water') return sub.tripleP - 1500 * (t - sub.tripleT);
      return sub.tripleP + 12 * (t - sub.tripleT);
    };
    drawCurve(sub.tripleT, sub.maxT, getP_melt, neonYellow);

    // Highlight Triple Point
    const tx = getX(sub.tripleT);
    const ty = getY(sub.tripleP);
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(tx, ty, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = textSecondary;
    ctx.font = smallMonoFont;
    ctx.fillText('TRIPLE', tx + 6, ty - 2);

    // Highlight Critical Point
    const cx = getX(sub.criticalT);
    const cy = getY(sub.criticalP);
    ctx.fillStyle = neonCyan;
    ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillText('CRITICAL', cx + 6, cy - 2);

    // Label Regions
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = titleFont;
    ctx.fillText('SOLID', getX(sub.minT + 20), getY(sub.maxP - 20));
    ctx.fillText('LIQUID', getX((sub.tripleT + sub.criticalT) / 2), getY(sub.criticalP + 10));
    ctx.fillText('GAS', getX(sub.criticalT - 30), getY(sub.tripleP - 3));
    ctx.fillText('S.C.F.', getX(sub.criticalT + 15), getY(sub.criticalP + 20));

    // Draw active target crosshair
    const targetX = getX(temp);
    const targetY = getY(pressure);

    ctx.strokeStyle = neonGreen;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(targetX - 8, targetY); ctx.lineTo(targetX + 8, targetY);
    ctx.moveTo(targetX, targetY - 8); ctx.lineTo(targetX, targetY + 8);
    ctx.stroke();

    ctx.fillStyle = 'rgba(57, 255, 20, 0.2)';
    ctx.beginPath();
    ctx.arc(targetX, targetY, 6, 0, Math.PI * 2);
    ctx.fill();

  }, [temp, pressure, subKey, sub]);

  // Render Molecular Arrangements
  useEffect(() => {
    const canvas = molecCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const w = canvas.width;
    const h = canvas.height;
    const neonCyan = resolveCssColor('var(--neon-cyan)', '#00f3ff');
    const neonMagenta = resolveCssColor('var(--neon-magenta)', '#ff007f');
    const neonYellow = resolveCssColor('var(--neon-yellow)', '#ffe600');
    const neonGreen = resolveCssColor('var(--neon-green)', '#39ff14');

    // Create particles
    const pCount = 50;
    const particles = Array.from({ length: pCount }, () => ({
      x: Math.random() * (w - 20) + 10,
      y: Math.random() * (h - 20) + 10,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      originX: 0,
      originY: 0
    }));

    // Initialize solid grid origins
    let gridCols = 8;
    let gridSpacing = w / (gridCols + 1);
    particles.forEach((p, idx) => {
      const col = idx % gridCols;
      const row = Math.floor(idx / gridCols);
      p.originX = gridSpacing + col * gridSpacing;
      p.originY = gridSpacing + row * gridSpacing;
    });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Background indicator
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(0, 0, w, h);

      // Animate particles depending on phase
      particles.forEach(p => {
        if (currentPhase === 'solid') {
          p.x = p.originX + (Math.random() - 0.5) * 1.5;
          p.y = p.originY + (Math.random() - 0.5) * 1.5;
          ctx.fillStyle = neonCyan;
        }
        else if (currentPhase === 'liquid') {
          p.x += p.vx * 0.4;
          p.y += p.vy * 0.4;

          if (p.x < 6 || p.x > w - 6) p.vx *= -1;
          if (p.y < 6 || p.y > h - 6) p.vy *= -1;
          ctx.fillStyle = neonMagenta;
        }
        else if (currentPhase === 'gas') {
          p.x += p.vx * 2.0;
          p.y += p.vy * 2.0;

          if (p.x < 4) { p.x = 4; p.vx *= -1; }
          if (p.x > w - 4) { p.x = w - 4; p.vx *= -1; }
          if (p.y < 4) { p.y = 4; p.vy *= -1; }
          if (p.y > h - 4) { p.y = h - 4; p.vy *= -1; }
          ctx.fillStyle = neonYellow;
        }
        else {
          p.x += p.vx * 1.8;
          p.y += p.vy * 1.8;

          if (p.x < 5 || p.x > w - 5) p.vx *= -1;
          if (p.y < 5 || p.y > h - 5) p.vy *= -1;
          ctx.fillStyle = neonGreen;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentPhase === 'gas' ? 3 : 5, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [currentPhase]);

  // Click on PT Diagram to set coords
  const handleGridClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = gridCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const padLeft = 45;
    const padBottom = 30;

    const clickT = sub.minT + ((clickX - padLeft) / (canvas.width - padLeft - 15)) * (sub.maxT - sub.minT);
    const clickP = sub.minP + ((canvas.height - padBottom - clickY) / (canvas.height - padBottom - 15)) * (sub.maxP - sub.minP);

    const T = Math.min(Math.max(clickT, sub.minT), sub.maxT);
    const P = Math.min(Math.max(clickP, sub.minP), sub.maxP);

    setTemp(Math.round(T));
    setPressure(Math.round(P * 10) / 10);
  };

  return React.createElement('div', {
    className: 'glass-panel',
    style: {
      padding: '24px',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--neon-yellow)',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }
  },
    React.createElement('h3', { style: { fontFamily: 'var(--font-title)', fontSize: '15px', color: 'var(--neon-yellow)', letterSpacing: '1px', alignSelf: 'stretch', textAlign: 'center' } },
      t('phys.phase').toUpperCase()
    ),

    // Substance Select
    React.createElement('div', { style: { display: 'flex', gap: '8px', justifyContent: 'center' } },
      Object.keys(substances).map(key => {
        const active = subKey === key;
        return React.createElement('button', {
          key,
          onClick: () => setSubKey(key),
          style: {
            padding: '6px 16px',
            background: active ? 'rgba(255, 230, 0, 0.1)' : 'var(--bg-tertiary)',
            border: `1px solid ${active ? 'var(--neon-yellow)' : 'var(--glass-border)'}`,
            borderRadius: '4px',
            color: active ? '#fff' : 'var(--text-secondary)',
            fontFamily: 'var(--font-title)',
            fontSize: '11px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: active ? 'var(--glow-yellow)' : 'none'
          }
        }, substances[key].name.toUpperCase());
      })
    ),

    // Sliders
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', width: '100%' } },
      React.createElement('div', null,
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-title)', color: 'var(--text-secondary)', marginBottom: '6px' } },
          React.createElement('span', null, "TEMPERATURE (T)"),
          React.createElement('span', { style: { color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)' } }, `${temp} K`)
        ),
        React.createElement('input', {
          type: 'range',
          min: sub.minT,
          max: sub.maxT,
          step: 2,
          value: temp,
          onChange: (e) => setTemp(parseInt(e.target.value)),
          style: { width: '100%', accentColor: 'var(--neon-cyan)' }
        })
      ),
      React.createElement('div', null,
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-title)', color: 'var(--text-secondary)', marginBottom: '6px' } },
          React.createElement('span', null, "PRESSURE (P)"),
          React.createElement('span', { style: { color: 'var(--neon-magenta)', fontFamily: 'var(--font-mono)' } }, `${pressure} bar`)
        ),
        React.createElement('input', {
          type: 'range',
          min: sub.minP,
          max: sub.maxP,
          step: 1,
          value: pressure,
          onChange: (e) => setPressure(parseInt(e.target.value)),
          style: { width: '100%', accentColor: 'var(--neon-magenta)' }
        })
      )
    ),

    // Canvas Container
    React.createElement('div', {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center',
        width: '100%'
      }
    },
      // PT Coordinate Diagram
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
        React.createElement('span', { style: { fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '6px' } },
          "CLICK GRID TO CHOOSE COORDS"
        ),
        React.createElement('canvas', {
          ref: gridCanvasRef,
          width: 250,
          height: 180,
          onClick: handleGridClick,
          'aria-label': `Diagramme de phase (P-T). Point actuel : ${temp} K, ${pressure} bar. Utilisez les curseurs Température et Pression ci-dessus pour ajuster au clavier.`,
          style: { background: '#000', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', cursor: 'crosshair' }
        })
      ),

      // Molecular representation
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
        React.createElement('span', { style: { fontSize: '11px', fontFamily: 'var(--font-title)', color: 'var(--neon-green)', marginBottom: '6px' } },
          "MOLECULAR STRUCTURE"
        ),
        React.createElement('canvas', {
          ref: molecCanvasRef,
          width: 180,
          height: 180,
          role: 'img',
          'aria-label': `Structure moléculaire animée: état ${currentPhase}`,
          style: { border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }
        })
      )
    ),

    // Analysis
    React.createElement('div', {
      style: {
        alignSelf: 'stretch',
        background: 'rgba(0,0,0,0.15)',
        padding: '12px',
        borderRadius: '4px',
        borderLeft: '2px solid var(--neon-yellow)',
        fontFamily: 'var(--font-mono)',
        fontSize: '11.5px',
        color: 'var(--text-secondary)',
        lineHeight: '1.4',
        textAlign: 'center'
      }
    },
      React.createElement('span', { style: { fontSize: '13px', display: 'block', color: 'var(--neon-green)', fontWeight: 'bold', marginBottom: '4px' } },
        `STATE: ${currentPhase.toUpperCase()}`
      ),
      t('phys.phase.desc')
    )
  );
};
