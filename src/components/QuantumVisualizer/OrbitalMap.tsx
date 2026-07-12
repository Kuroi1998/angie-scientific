import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { evaluateWavefunction, orbitalList } from '../../engines/quantumPhysics';
import type { OrbitalDef } from '../../engines/quantumPhysics';

export const OrbitalMap: React.FC = () => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedOrbital, setSelectedOrbital] = useState<OrbitalDef>(orbitalList[2]); // Default 2pz

  // Get formula text based on orbital selection
  const getFormula = (label: string) => {
    switch (label) {
      case '1s': return 'Ψ(r) ∝ e^(-r/a₀)';
      case '2s': return 'Ψ(r) ∝ (2 - r/a₀) · e^(-r/2a₀)';
      case '2pz': return 'Ψ(r, θ) ∝ (r/a₀) · cos(θ) · e^(-r/2a₀)';
      case '3s': return 'Ψ(r) ∝ (27 - 18r/a₀ + 2r²/a₀²) · e^(-r/3a₀)';
      case '3pz': return 'Ψ(r, θ) ∝ r(6 - r/a₀) · cos(θ) · e^(-r/3a₀)';
      case '3dz²': return 'Ψ(r, θ) ∝ r²(3cos²(θ) - 1) · e^(-r/3a₀)';
      default: return '';
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 300;
    canvas.width = size;
    canvas.height = size;
    const centerX = size / 2;
    const centerY = size / 2;

    ctx.clearRect(0, 0, size, size);

    // Draw background telemetry lines
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, size * 0.45, 0, Math.PI * 2);
    ctx.stroke();

    // Render heatmap (optimized resolution: 150x150 blocks of 2x2 pixels)
    const res = 150;
    const scale = size / res;

    for (let py = 0; py < res; py++) {
      for (let px = 0; px < res; px++) {
        // Convert screen pixel coordinates to wave coordinates relative to center
        const x = (px - res / 2) * scale;
        const y = (py - res / 2) * scale;

        const psi = evaluateWavefunction(
          selectedOrbital.n,
          selectedOrbital.l,
          selectedOrbital.m,
          x,
          y
        );

        const density = Math.pow(psi, 2);
        if (density < 0.001) continue;

        // Map density to opacity
        const opacity = Math.min(density * 1.5, 1.0);

        if (psi >= 0) {
          // Positive phase - Cyan glow
          ctx.fillStyle = `rgba(0, 243, 255, ${opacity})`;
        } else {
          // Negative phase - Magenta glow
          ctx.fillStyle = `rgba(255, 0, 127, ${opacity})`;
        }

        ctx.fillRect(px * scale, py * scale, scale, scale);
      }
    }

    // Overlay reference axis lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.moveTo(centerX - 10, centerY); ctx.lineTo(centerX + 10, centerY);
    ctx.moveTo(centerX, centerY - 10); ctx.lineTo(centerX, centerY + 10);
    ctx.stroke();

  }, [selectedOrbital]);

  return React.createElement('div', {
    className: 'glass-panel',
    style: {
      padding: '24px',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--neon-cyan)',
      boxShadow: '0 0 15px rgba(0, 243, 255, 0.05)',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px'
    }
  },
    React.createElement('h3', { style: { fontFamily: 'var(--font-title)', fontSize: '15px', color: 'var(--neon-cyan)', letterSpacing: '1px', alignSelf: 'stretch', textAlign: 'center' } },
      t('quantum.orbital').toUpperCase()
    ),

    // Orbital selectors
    React.createElement('div', {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'center',
        alignSelf: 'stretch'
      }
    },
      orbitalList.map(orb => {
        const active = selectedOrbital.label === orb.label;
        return React.createElement('button', {
          key: orb.label,
          onClick: () => setSelectedOrbital(orb),
          style: {
            padding: '8px 16px',
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
        }, orb.label.toUpperCase());
      })
    ),

    // Wavefunction Plot & Canvas
    React.createElement('div', { style: { position: 'relative' } },
      React.createElement('canvas', {
        ref: canvasRef,
        style: {
          display: 'block',
          borderRadius: '4px',
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid var(--glass-border)'
        }
      }),
      // Coordinate labels overlay
      React.createElement('span', { style: { position: 'absolute', top: '10px', left: '10px', fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.3)' } }, "+z"),
      React.createElement('span', { style: { position: 'absolute', bottom: '10px', left: '10px', fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.3)' } }, "-z"),
      React.createElement('span', { style: { position: 'absolute', bottom: '10px', right: '10px', fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.3)' } }, "+x")
    ),

    // Formula and Legend
    React.createElement('div', {
      style: {
        alignSelf: 'stretch',
        background: 'rgba(0,0,0,0.15)',
        padding: '12px',
        borderRadius: '4px',
        borderLeft: '2px solid var(--neon-cyan)',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px'
      }
    },
      React.createElement('div', { style: { color: 'var(--neon-yellow)', marginBottom: '8px', fontWeight: 'bold' } },
        getFormula(selectedOrbital.label)
      ),
      React.createElement('div', { style: { display: 'flex', gap: '20px', fontSize: '10px', color: 'var(--text-secondary)' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
          React.createElement('div', { style: { width: '8px', height: '8px', background: 'var(--neon-cyan)', borderRadius: '1px' } }),
          "PHASE (+)"
        ),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
          React.createElement('div', { style: { width: '8px', height: '8px', background: 'var(--neon-magenta)', borderRadius: '1px' } }),
          "PHASE (-)"
        ),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
          "INTENSITY ∝ |Ψ|² (PROBABILITY)"
        )
      )
    )
  );
};
