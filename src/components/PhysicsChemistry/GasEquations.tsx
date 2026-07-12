import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

interface GasParams {
  name: string;
  a: number; // bar L^2 / mol^2 (intermolecular attraction)
  b: number; // L / mol (molecular volume)
}

const gasDb: Record<string, GasParams> = {
  he: { name: "Helium (He)", a: 0.0346, b: 0.0238 },
  n2: { name: "Nitrogen (N₂)", a: 1.370, b: 0.0387 },
  co2: { name: "Carbon Dioxide (CO₂)", a: 3.640, b: 0.0426 }
};

export const GasEquations: React.FC = () => {
  const { t } = useLanguage();
  
  const [selectedGasKey, setSelectedGasKey] = useState<string>('co2');
  const [volume, setVolume] = useState<number>(5.0); // L
  const [temp, setTemp] = useState<number>(300); // K
  
  const gas = gasDb[selectedGasKey];
  const R = 0.08314; // L * bar / (mol * K)
  const n = 1.0; // 1 mole

  // Calculate pressures
  const pIdeal = (n * R * temp) / volume;
  const pVdw = (n * R * temp) / (volume - n * gas.b) - (gas.a * n * n) / (volume * volume);

  const idealCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const vdwCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animation logic for particles inside the container
  useEffect(() => {
    const idealCanvas = idealCanvasRef.current;
    const vdwCanvas = vdwCanvasRef.current;
    if (!idealCanvas || !vdwCanvas) return;

    const iCtx = idealCanvas.getContext('2d');
    const vCtx = vdwCanvas.getContext('2d');
    if (!iCtx || !vCtx) return;

    let animId: number;

    const pCount = 35;
    // Particle arrays
    const iParticles = Array.from({ length: pCount }, () => ({
      x: Math.random() * 180 + 10,
      y: Math.random() * 180 + 10,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2
    }));

    const vParticles = Array.from({ length: pCount }, () => ({
      x: Math.random() * 180 + 10,
      y: Math.random() * 180 + 10,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2
    }));

    const draw = () => {
      const iw = idealCanvas.width;
      const ih = idealCanvas.height;
      const vw = vdwCanvas.width;
      const vh = vdwCanvas.height;

      iCtx.clearRect(0, 0, iw, ih);
      vCtx.clearRect(0, 0, vw, vh);

      // Draw container walls
      const drawContainer = (ctx: CanvasRenderingContext2D, w: number, h: number, v: number) => {
        // height representing piston height. Piston height decreases as volume decreases.
        const topY = 20 + (10 - v) * 12;

        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(10, topY, w - 20, h - topY - 10);

        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, topY, w - 20, h - topY - 10);

        // Draw Piston
        ctx.fillStyle = 'var(--bg-tertiary)';
        ctx.strokeStyle = 'var(--neon-cyan)';
        ctx.fillRect(8, topY - 8, w - 16, 8);
        ctx.strokeRect(8, topY - 8, w - 16, 8);

        return topY;
      };

      const iTopY = drawContainer(iCtx, iw, ih, volume);
      const vTopY = drawContainer(vCtx, vw, vh, volume);

      // Speed factor based on Temperature
      const speedFactor = Math.sqrt(temp / 300) * 1.5;

      // 1. Update & Draw Ideal Particles (point-like, no attraction)
      iParticles.forEach(p => {
        p.x += p.vx * speedFactor;
        p.y += p.vy * speedFactor;

        // Bounce walls
        if (p.x < 14) { p.x = 14; p.vx *= -1; }
        if (p.x > iw - 14) { p.x = iw - 14; p.vx *= -1; }
        if (p.y < iTopY + 4) { p.y = iTopY + 4; p.vy *= -1; }
        if (p.y > ih - 14) { p.y = ih - 14; p.vy *= -1; }

        iCtx.fillStyle = 'var(--neon-cyan)';
        iCtx.beginPath();
        iCtx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        iCtx.fill();
      });

      // 2. Update & Draw Van der Waals Particles (finite volume, molecular attraction)
      const particleRadius = 3 + gas.b * 40; // size scales with exclusion volume b

      vParticles.forEach((p, idx) => {
        p.x += p.vx * speedFactor;
        p.y += p.vy * speedFactor;

        // Bounce walls (accounting for radius)
        if (p.x < 10 + particleRadius) { p.x = 10 + particleRadius; p.vx *= -1; }
        if (p.x > vw - 10 - particleRadius) { p.x = vw - 10 - particleRadius; p.vx *= -1; }
        if (p.y < vTopY + particleRadius) { p.y = vTopY + particleRadius; p.vy *= -1; }
        if (p.y > vh - 10 - particleRadius) { p.y = vh - 10 - particleRadius; p.vy *= -1; }

        // Molecular Attractions (draw slight lines when close)
        for (let next = idx + 1; next < pCount; next++) {
          const np = vParticles[next];
          const dx = np.x - p.x;
          const dy = np.y - p.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          
          if (d < 35) {
            // Draw attraction line (alpha depends on gas.a attraction constant)
            const strength = Math.min((1 - d / 35) * (gas.a / 4), 0.4);
            vCtx.strokeStyle = `rgba(255, 0, 127, ${strength})`;
            vCtx.lineWidth = 1;
            vCtx.beginPath();
            vCtx.moveTo(p.x, p.y);
            vCtx.lineTo(np.x, np.y);
            vCtx.stroke();
            
            // Apply slight attractive force pull (drag towards each other)
            const force = 0.005 * gas.a;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
            np.vx -= (dx / d) * force;
            np.vy -= (dy / d) * force;
          }
        }

        // Draw Particle
        vCtx.fillStyle = 'var(--neon-magenta)';
        vCtx.beginPath();
        vCtx.arc(p.x, p.y, particleRadius, 0, Math.PI * 2);
        vCtx.fill();
        vCtx.strokeStyle = 'rgba(255,255,255,0.4)';
        vCtx.lineWidth = 0.5;
        vCtx.stroke();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [volume, temp, selectedGasKey, gas]);

  return React.createElement('div', {
    className: 'glass-panel',
    style: {
      padding: '24px',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--neon-cyan)',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }
  },
    React.createElement('h3', { style: { fontFamily: 'var(--font-title)', fontSize: '15px', color: 'var(--neon-cyan)', letterSpacing: '1px', alignSelf: 'stretch', textAlign: 'center' } },
      t('phys.gas').toUpperCase()
    ),

    // Selector
    React.createElement('div', { style: { display: 'flex', gap: '8px', justifyContent: 'center' } },
      Object.keys(gasDb).map(key => {
        const active = selectedGasKey === key;
        return React.createElement('button', {
          key,
          onClick: () => setSelectedGasKey(key),
          style: {
            padding: '6px 16px',
            background: active ? 'rgba(0, 243, 255, 0.1)' : 'var(--bg-tertiary)',
            border: `1px solid ${active ? 'var(--neon-cyan)' : 'var(--glass-border)'}`,
            borderRadius: '4px',
            color: active ? '#fff' : 'var(--text-secondary)',
            fontFamily: 'var(--font-title)',
            fontSize: '11px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: active ? 'var(--glow-cyan)' : 'none'
          }
        }, gasDb[key].name.toUpperCase());
      })
    ),

    // Sliders
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', width: '100%' } },
      React.createElement('div', null,
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-title)', color: 'var(--text-secondary)', marginBottom: '6px' } },
          React.createElement('span', null, "VOLUME (V)"),
          React.createElement('span', { style: { color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)' } }, `${volume.toFixed(1)} L`)
        ),
        React.createElement('input', {
          type: 'range',
          min: 1.5,
          max: 9.5,
          step: 0.1,
          value: volume,
          onChange: (e) => setVolume(parseFloat(e.target.value)),
          style: { width: '100%', accentColor: 'var(--neon-cyan)' }
        })
      ),
      React.createElement('div', null,
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-title)', color: 'var(--text-secondary)', marginBottom: '6px' } },
          React.createElement('span', null, "TEMPERATURE (T)"),
          React.createElement('span', { style: { color: 'var(--neon-yellow)', fontFamily: 'var(--font-mono)' } }, `${temp} K`)
        ),
        React.createElement('input', {
          type: 'range',
          min: 80,
          max: 600,
          step: 10,
          value: temp,
          onChange: (e) => setTemp(parseInt(e.target.value)),
          style: { width: '100%', accentColor: 'var(--neon-yellow)' }
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
      // Ideal Gas Piston
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
        React.createElement('span', { style: { fontSize: '11px', fontFamily: 'var(--font-title)', color: 'var(--neon-cyan)', marginBottom: '6px' } },
          t('phys.gas.ideal').toUpperCase()
        ),
        React.createElement('canvas', {
          ref: idealCanvasRef,
          width: 200,
          height: 180,
          style: { background: '#000', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }
        }),
        React.createElement('span', { style: { marginTop: '8px', fontSize: '14px', fontFamily: 'var(--font-mono)', fontWeight: 'bold', color: 'var(--neon-cyan)' } },
          `P = ${pIdeal.toFixed(2)} bar`
        ),
        React.createElement('span', { style: { fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' } },
          "PV = nRT"
        )
      ),

      // Van der Waals Piston
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
        React.createElement('span', { style: { fontSize: '11px', fontFamily: 'var(--font-title)', color: 'var(--neon-magenta)', marginBottom: '6px' } },
          t('phys.gas.vdw').toUpperCase()
        ),
        React.createElement('canvas', {
          ref: vdwCanvasRef,
          width: 200,
          height: 180,
          style: { background: '#000', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }
        }),
        React.createElement('span', { style: { marginTop: '8px', fontSize: '14px', fontFamily: 'var(--font-mono)', fontWeight: 'bold', color: 'var(--neon-magenta)' } },
          `P = ${pVdw.toFixed(2)} bar`
        ),
        React.createElement('span', { style: { fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textAlign: 'center' } },
          `a = ${gas.a}, b = ${gas.b}`
        )
      )
    ),

    // Readout analysis
    React.createElement('div', {
      style: {
        alignSelf: 'stretch',
        background: 'rgba(0,0,0,0.15)',
        padding: '12px',
        borderRadius: '4px',
        borderLeft: '2px solid var(--neon-cyan)',
        fontFamily: 'var(--font-mono)',
        fontSize: '11.5px',
        color: 'var(--text-secondary)',
        lineHeight: '1.4'
      }
    },
      React.createElement('span', { style: { display: 'block', color: '#fff', fontWeight: 'bold', marginBottom: '4px' } },
        `Divergence: ${Math.abs(((pIdeal - pVdw) / pIdeal) * 100).toFixed(1)}%`
      ),
      "Le modèle de Van der Waals prend en compte la taille finie des molécules (b) qui augmente la pression effective, et l'attraction moléculaire (a) qui la diminue. La divergence s'accentue à faible volume et basse température."
    )
  );
};
