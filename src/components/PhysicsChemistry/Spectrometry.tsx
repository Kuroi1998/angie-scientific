import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

interface EmissionLine {
  wl: number; // wavelength in nm
  color: string;
}

const emissionDb: Record<string, { name: string; lines: EmissionLine[] }> = {
  h: {
    name: "Hydrogen Balmer Series",
    lines: [
      { wl: 656.3, color: '#ff0000' }, // H-alpha (Red)
      { wl: 486.1, color: '#00ffff' }, // H-beta (Cyan)
      { wl: 434.0, color: '#0000ff' }, // H-gamma (Blue)
      { wl: 410.2, color: '#7f00ff' }  // H-delta (Violet)
    ]
  },
  he: {
    name: "Helium Emission Spectrum",
    lines: [
      { wl: 667.8, color: '#ff0000' },
      { wl: 587.6, color: '#ffcc00' }, // Yellow-orange D3
      { wl: 501.5, color: '#00ff66' },
      { wl: 447.1, color: '#0066ff' },
      { wl: 402.6, color: '#6600ff' }
    ]
  },
  na: {
    name: "Sodium D-Line Doublet",
    lines: [
      { wl: 589.0, color: '#ffaa00' }, // D2 (Orange-Yellow)
      { wl: 589.6, color: '#ffaa00' }  // D1 (Orange-Yellow)
    ]
  }
};

const absorptionDb: Record<string, { name: string; dips: number[] }> = {
  h2o: {
    name: "Water (H₂O) Vapor IR",
    dips: [3750, 3650, 1590] // O-H stretch and bend wavenumbers
  },
  co2: {
    name: "Carbon Dioxide (CO₂) IR",
    dips: [2349, 667] // C=O stretch and bend wavenumbers
  }
};

export const Spectrometry: React.FC = () => {
  const { t } = useLanguage();
  const [elemKey, setElemKey] = useState<string>('h');
  const [moleculeKey, setMoleculeKey] = useState<string>('co2');

  const emissionCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const absorptionCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Wavelength to RGB approximation
  const wlToRgb = (wl: number) => {
    let r = 0, g = 0, b = 0;
    if (wl >= 380 && wl < 440) {
      r = -((wl - 440) / (440 - 380));
      b = 1.0;
    } else if (wl >= 440 && wl < 490) {
      g = (wl - 440) / (490 - 440);
      b = 1.0;
    } else if (wl >= 490 && wl < 510) {
      g = 1.0;
      b = -((wl - 510) / (510 - 490));
    } else if (wl >= 510 && wl < 580) {
      r = (wl - 510) / (580 - 510);
      g = 1.0;
    } else if (wl >= 580 && wl < 645) {
      r = 1.0;
      g = -((wl - 645) / (645 - 580));
    } else if (wl >= 645 && wl <= 780) {
      r = 1.0;
    }
    // Intensity factor
    let f = 1.0;
    if (wl >= 380 && wl < 420) f = 0.3 + 0.7 * (wl - 380) / (420 - 380);
    else if (wl > 700 && wl <= 780) f = 0.3 + 0.7 * (780 - wl) / (780 - 700);

    return `rgb(${Math.round(r * f * 255)}, ${Math.round(g * f * 255)}, ${Math.round(b * f * 255)})`;
  };

  // Draw emission spectrum
  useEffect(() => {
    const canvas = emissionCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw Continuous Background Rainbow (dimmed)
    const padding = 15;
    const spectrumW = w - padding * 2;
    const minWl = 380;
    const maxWl = 720;

    for (let x = 0; x < spectrumW; x++) {
      const wl = minWl + (x / spectrumW) * (maxWl - minWl);
      ctx.fillStyle = wlToRgb(wl);
      ctx.fillRect(padding + x, 10, 1, 30);
    }

    // Draw Black cover overlay (emission spectrum is discrete lines on black background)
    ctx.fillStyle = '#000';
    ctx.fillRect(padding, 50, spectrumW, 40);

    // Draw discrete emission lines
    const data = emissionDb[elemKey];
    data.lines.forEach(line => {
      const x = padding + ((line.wl - minWl) / (maxWl - minWl)) * spectrumW;
      
      // Draw glowing line
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 2;
      ctx.shadowColor = line.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(x, 50);
      ctx.lineTo(x, 90);
      ctx.stroke();

      // Reset shadow
      ctx.shadowBlur = 0;

      // Label wavelength
      ctx.fillStyle = 'var(--text-secondary)';
      ctx.font = '8px var(--font-mono)';
      ctx.fillText(`${line.wl.toFixed(1)}`, x - 10, 102);
    });

    // Draw scale ticks
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '9px var(--font-mono)';
    for (let wl = 400; wl <= 700; wl += 50) {
      const x = padding + ((wl - minWl) / (maxWl - minWl)) * spectrumW;
      ctx.fillRect(x, 42, 1, 4);
      ctx.fillText(`${wl}nm`, x - 10, 115);
    }

  }, [elemKey]);

  // Draw molecular absorption spectrum
  useEffect(() => {
    const canvas = absorptionCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 0, 127, 0.02)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 30) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
    }

    const padLeft = 35;
    const padBottom = 25;
    const plotW = w - padLeft - 10;
    const plotH = h - padBottom - 10;

    // Axis
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padLeft, 10);
    ctx.lineTo(padLeft, h - padBottom);
    ctx.lineTo(w - 10, h - padBottom);
    ctx.stroke();

    ctx.fillStyle = 'var(--text-secondary)';
    ctx.font = '9px var(--font-mono)';
    ctx.fillText('TRANS %', 2, 15);
    ctx.fillText('WAVENUMBER (cm⁻¹)', w - 90, h - 8);

    const minWn = 4000;
    const maxWn = 400; // IR standard wavenumber scales right to left!

    const data = absorptionDb[moleculeKey];

    // Compute curve path
    ctx.beginPath();
    ctx.strokeStyle = 'var(--neon-magenta)';
    ctx.lineWidth = 2;

    const getX = (wn: number) => padLeft + ((minWn - wn) / (minWn - maxWn)) * plotW;

    for (let x = 0; x < plotW; x++) {
      // Wavenumber sweeps from 4000 down to 400
      const wn = minWn - (x / plotW) * (minWn - maxWn);
      
      // Calculate transmittance: 100% background, subtract Gaussian peaks at absorption dips
      let trans = 0.95; // 95% baseline
      
      data.dips.forEach(dip => {
        // dip width
        const width = dip === 667 ? 80 : 150;
        // dip depth
        const depth = dip === 2349 ? 0.85 : 0.65;
        // Gaussian dip formula
        trans -= depth * Math.exp(-Math.pow(wn - dip, 2) / (2 * Math.pow(width, 2)));
      });

      trans = Math.max(trans, 0.05); // clip floor
      const cy = h - padBottom - trans * plotH;

      if (x === 0) ctx.moveTo(padLeft + x, cy);
      else ctx.lineTo(padLeft + x, cy);
    }
    ctx.stroke();

    // Label peaks
    ctx.fillStyle = 'var(--text-secondary)';
    ctx.font = '8px var(--font-mono)';
    data.dips.forEach(dip => {
      const cx = getX(dip);
      ctx.fillText(`${dip} cm⁻¹`, cx - 20, h - padBottom - 10);
    });

  }, [moleculeKey]);

  return React.createElement('div', {
    className: 'glass-panel',
    style: {
      padding: '24px',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--neon-cyan)',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }
  },
    React.createElement('h3', { style: { fontFamily: 'var(--font-title)', fontSize: '15px', color: 'var(--neon-cyan)', letterSpacing: '1px', alignSelf: 'stretch', textAlign: 'center' } },
      t('phys.spectrometry').toUpperCase()
    ),

    // 1. Atomic Emission Section
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
      React.createElement('h4', { style: { fontSize: '12px', fontFamily: 'var(--font-title)', color: 'var(--neon-cyan)', letterSpacing: '1px' } },
        t('phys.spectrometry.emission')
      ),
      // Select buttons
      React.createElement('div', { style: { display: 'flex', gap: '8px' } },
        Object.keys(emissionDb).map(key => {
          const active = elemKey === key;
          return React.createElement('button', {
            key,
            onClick: () => setElemKey(key),
            style: {
              padding: '4px 12px',
              background: active ? 'rgba(0, 243, 255, 0.1)' : 'var(--bg-tertiary)',
              border: `1px solid ${active ? 'var(--neon-cyan)' : 'var(--glass-border)'}`,
              borderRadius: '4px',
              color: active ? '#fff' : 'var(--text-secondary)',
              fontFamily: 'var(--font-title)',
              fontSize: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }
          }, emissionDb[key].name.toUpperCase());
        })
      ),
      // Canvas
      React.createElement('canvas', {
        ref: emissionCanvasRef,
        width: 450,
        height: 120,
        style: { width: '100%', maxWidth: '450px', background: '#000', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }
      })
    ),

    // 2. Molecular Absorption Section
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' } },
      React.createElement('h4', { style: { fontSize: '12px', fontFamily: 'var(--font-title)', color: 'var(--neon-magenta)', letterSpacing: '1px' } },
        t('phys.spectrometry.absorption')
      ),
      // Select buttons
      React.createElement('div', { style: { display: 'flex', gap: '8px' } },
        Object.keys(absorptionDb).map(key => {
          const active = moleculeKey === key;
          return React.createElement('button', {
            key,
            onClick: () => setMoleculeKey(key),
            style: {
              padding: '4px 12px',
              background: active ? 'rgba(255, 0, 127, 0.1)' : 'var(--bg-tertiary)',
              border: `1px solid ${active ? 'var(--neon-magenta)' : 'var(--glass-border)'}`,
              borderRadius: '4px',
              color: active ? '#fff' : 'var(--text-secondary)',
              fontFamily: 'var(--font-title)',
              fontSize: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }
          }, absorptionDb[key].name.toUpperCase());
        })
      ),
      // Canvas
      React.createElement('canvas', {
        ref: absorptionCanvasRef,
        width: 450,
        height: 150,
        style: { width: '100%', maxWidth: '450px', background: '#000', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }
      })
    )
  );
};
