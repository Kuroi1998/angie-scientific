import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { getBondDetails, predictVsepr } from '../../engines/bondingEngine';
import { GitCommit, Activity } from 'lucide-react';

interface LewisVisualizerProps {
  centralSymbol: string;
}

export const LewisVisualizer: React.FC<LewisVisualizerProps> = ({ centralSymbol }) => {
  const { language } = useLanguage();
  const [ligand, setLigand] = useState<string>('H');
  const [count, setCount] = useState<number>(4);

  const lewisCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const vseprCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // If centralSymbol is Hydrogen or a Noble Gas, adjust defaults
  useEffect(() => {
    if (centralSymbol === 'H' || centralSymbol === 'He' || centralSymbol === 'Ne' || centralSymbol === 'Ar' || centralSymbol === 'Kr' || centralSymbol === 'Xe') {
      setLigand('O');
      setCount(2);
    } else {
      setLigand('H');
      setCount(4);
    }
  }, [centralSymbol]);

  const bond = getBondDetails(centralSymbol, ligand);
  const vsepr = predictVsepr(centralSymbol, ligand, count);

  // Draw Lewis structure in 2D
  useEffect(() => {
    const canvas = lewisCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Draw central atom symbol
    ctx.font = 'bold 20px var(--font-title)';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'var(--neon-cyan)';
    ctx.fillText(centralSymbol, cx, cy);
    ctx.shadowBlur = 0; // reset

    // Angles for ligands based on count
    const angles: number[] = [];
    if (count === 1) {
      angles.push(0);
    } else if (count === 2) {
      angles.push(0, Math.PI); // opposite sides
    } else if (count === 3) {
      angles.push(-Math.PI / 6, 5 * Math.PI / 6, 3 * Math.PI / 2);
    } else if (count === 4) {
      angles.push(0, Math.PI / 2, Math.PI, 3 * Math.PI / 2);
    } else {
      for (let i = 0; i < count; i++) {
        angles.push((i * 2 * Math.PI) / count);
      }
    }

    const dist = 55; // distance from center

    // Draw ligands and bonds
    angles.forEach((angle) => {
      const lx = cx + dist * Math.cos(angle);
      const ly = cy + dist * Math.sin(angle);

      // Draw Bond lines (Double bond if ligand is Oxygen and count <= 2, otherwise single)
      const isDouble = (ligand === 'O' && count <= 2);
      ctx.strokeStyle = 'var(--neon-cyan)';
      ctx.lineWidth = 2;

      if (isDouble) {
        // Draw double parallel lines
        const dx = Math.sin(angle) * 3;
        const dy = -Math.cos(angle) * 3;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * 15 + dx, cy + Math.sin(angle) * 15 + dy);
        ctx.lineTo(lx - Math.cos(angle) * 12 + dx, ly - Math.sin(angle) * 12 + dy);
        ctx.moveTo(cx + Math.cos(angle) * 15 - dx, cy + Math.sin(angle) * 15 - dy);
        ctx.lineTo(lx - Math.cos(angle) * 12 - dx, ly - Math.sin(angle) * 12 - dy);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * 15, cy + Math.sin(angle) * 15);
        ctx.lineTo(lx - Math.cos(angle) * 12, ly - Math.sin(angle) * 12);
        ctx.stroke();
      }

      // Draw ligand symbol
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = 'bold 15px var(--font-title)';
      ctx.fillText(ligand, lx, ly);
    });

    // Draw central lone pairs if any
    const lpCount = vsepr.lonePairs;
    if (lpCount > 0) {
      ctx.fillStyle = 'var(--neon-magenta)';
      // Place lone pairs in gaps between bonds
      const lpAngles: number[] = [];
      if (count === 1) {
        lpAngles.push(Math.PI, Math.PI / 2, 3 * Math.PI / 2);
      } else if (count === 2) {
        lpAngles.push(Math.PI / 2, 3 * Math.PI / 2);
      } else if (count === 3) {
        lpAngles.push(Math.PI / 2);
      } else if (count === 4) {
        // no obvious gaps, place them in diagonals
        lpAngles.push(Math.PI / 4, 5 * Math.PI / 4);
      }

      for (let i = 0; i < Math.min(lpCount, lpAngles.length); i++) {
        const lpAngle = lpAngles[i];
        const lpx1 = cx + 18 * Math.cos(lpAngle) - Math.sin(lpAngle) * 3;
        const lpy1 = cy + 18 * Math.sin(lpAngle) + Math.cos(lpAngle) * 3;
        const lpx2 = cx + 18 * Math.cos(lpAngle) + Math.sin(lpAngle) * 3;
        const lpy2 = cy + 18 * Math.sin(lpAngle) - Math.cos(lpAngle) * 3;

        ctx.beginPath();
        ctx.arc(lpx1, lpy1, 2, 0, 2 * Math.PI);
        ctx.arc(lpx2, lpy2, 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }, [centralSymbol, ligand, count, vsepr.lonePairs]);

  // Draw 3D VSEPR structure representation
  useEffect(() => {
    const canvas = vseprCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Draw Central Atom Sphere
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'var(--neon-purple)';
    ctx.fillStyle = 'rgba(157, 0, 255, 0.2)';
    ctx.strokeStyle = 'var(--neon-purple)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0; // reset

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px var(--font-title)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(centralSymbol, cx, cy);

    // Draw Ligands according to VSEPR coordinates
    // We map 3D projection: x' = x, y' = y * cos(alpha) - z * sin(alpha) etc.
    const getProjection = (x: number, y: number, z: number) => {
      // Rotate slightly for 3D depth
      const angleY = Math.PI / 8;
      const angleX = Math.PI / 12;

      // Rotate Y
      const x1 = x * Math.cos(angleY) - z * Math.sin(angleY);
      const z1 = x * Math.sin(angleY) + z * Math.cos(angleY);

      // Rotate X
      const y2 = y * Math.cos(angleX) - z1 * Math.sin(angleX);
      const z2 = y * Math.sin(angleX) + z1 * Math.cos(angleX);

      return {
        px: cx + x1 * 50,
        py: cy - y2 * 50,
        pz: z2
      };
    };

    const drawBond = (px: number, py: number, _pz: number, style: 'normal' | 'wedge' | 'dash') => {
      ctx.lineWidth = 2;
      if (style === 'normal') {
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(px, py);
        ctx.stroke();
      } else if (style === 'wedge') {
        // Draw solid wedge
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        const dx = Math.sin(Math.atan2(py - cy, px - cx)) * 4;
        const dy = -Math.cos(Math.atan2(py - cy, px - cx)) * 4;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(px + dx, py + dy);
        ctx.lineTo(px - dx, py - dy);
        ctx.closePath();
        ctx.fill();
      } else if (style === 'dash') {
        // Draw dashed bond
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(px, py);
        ctx.stroke();
        ctx.setLineDash([]); // reset
      }
    };

    const drawLigandSphere = (px: number, py: number, symbol: string) => {
      ctx.fillStyle = 'rgba(0, 243, 255, 0.1)';
      ctx.strokeStyle = 'var(--neon-cyan)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(px, py, 11, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px var(--font-title)';
      ctx.fillText(symbol, px, py);
    };

    // VSEPR Coordinates (x, y, z) unit vectors
    const coords: { x: number; y: number; z: number; style: 'normal' | 'wedge' | 'dash' }[] = [];

    if (count === 1) {
      coords.push({ x: 1, y: 0, z: 0, style: 'normal' });
    } else if (count === 2) {
      coords.push({ x: 1, y: 0, z: 0, style: 'normal' });
      coords.push({ x: -1, y: 0, z: 0, style: 'normal' });
    } else if (count === 3) {
      // Trigonal planar
      coords.push({ x: 0, y: 1, z: 0, style: 'normal' });
      coords.push({ x: Math.sqrt(3)/2, y: -0.5, z: 0, style: 'normal' });
      coords.push({ x: -Math.sqrt(3)/2, y: -0.5, z: 0, style: 'normal' });
    } else if (count === 4) {
      // Tetrahedral
      coords.push({ x: 0, y: 1, z: 0, style: 'normal' });
      coords.push({ x: Math.sqrt(8/9), y: -1/3, z: 0, style: 'normal' });
      coords.push({ x: -Math.sqrt(2/9), y: -1/3, z: Math.sqrt(2/3), style: 'wedge' });
      coords.push({ x: -Math.sqrt(2/9), y: -1/3, z: -Math.sqrt(2/3), style: 'dash' });
    } else if (count === 5) {
      // Trigonal bipyramidal
      coords.push({ x: 0, y: 1, z: 0, style: 'normal' }); // Axial
      coords.push({ x: 0, y: -1, z: 0, style: 'normal' }); // Axial
      coords.push({ x: 1, y: 0, z: 0, style: 'normal' }); // Equat
      coords.push({ x: -0.5, y: 0, z: Math.sqrt(3)/2, style: 'wedge' }); // Equat
      coords.push({ x: -0.5, y: 0, z: -Math.sqrt(3)/2, style: 'dash' }); // Equat
    } else if (count >= 6) {
      // Octahedral
      coords.push({ x: 0, y: 1, z: 0, style: 'normal' });
      coords.push({ x: 0, y: -1, z: 0, style: 'normal' });
      coords.push({ x: 1, y: 0, z: 0, style: 'normal' });
      coords.push({ x: -1, y: 0, z: 0, style: 'normal' });
      coords.push({ x: 0, y: 0, z: 1, style: 'wedge' });
      coords.push({ x: 0, y: 0, z: -1, style: 'dash' });
    }

    // Sort by depth (pz) so we draw back elements first (dash) then front (wedge)
    const projected = coords.map(c => {
      const proj = getProjection(c.x, c.y, c.z);
      return { ...proj, style: c.style };
    }).sort((a, b) => a.pz - b.pz);

    // Draw Bonds
    projected.forEach(p => {
      drawBond(p.px, p.py, p.pz, p.style);
    });

    // Draw Ligands
    projected.forEach(p => {
      drawLigandSphere(p.px, p.py, ligand);
    });

    // Draw lone pair lobes if any
    const lpCount = vsepr.lonePairs;
    if (lpCount > 0) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 0, 127, 0.4)';
      ctx.lineWidth = 1;
      // Place lone pairs on the opposite side of ligands
      const lpCoords: { x: number; y: number; z: number }[] = [];
      if (count === 2) {
        lpCoords.push({ x: 0, y: 1, z: 0 }, { x: 0, y: -1, z: 0 });
      } else if (count === 3) {
        lpCoords.push({ x: 0, y: 0, z: 1 });
      } else if (count === 4) {
        // place lone pairs in empty spaces
        lpCoords.push({ x: 0, y: 0, z: -1 });
      }

      lpCoords.slice(0, lpCount).forEach((lc) => {
        const proj = getProjection(lc.x * 0.7, lc.y * 0.7, lc.z * 0.7);
        // Draw tear-drop lobe
        ctx.fillStyle = 'rgba(255, 0, 127, 0.08)';
        ctx.beginPath();
        ctx.ellipse(proj.px, proj.py, 12, 7, Math.atan2(proj.py - cy, proj.px - cx), 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        // Draw double dots
        ctx.fillStyle = 'var(--neon-magenta)';
        ctx.beginPath();
        ctx.arc(proj.px - 2, proj.py, 1.5, 0, 2 * Math.PI);
        ctx.arc(proj.px + 2, proj.py, 1.5, 0, 2 * Math.PI);
        ctx.fill();
      });
      ctx.restore();
    }

  }, [centralSymbol, ligand, count, vsepr]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCount(parseInt(e.target.value));
  };

  const getGeometryLabel = () => {
    return language === 'fr' ? vsepr.geometryFR : vsepr.geometryES;
  };

  const getBondTypeLabel = () => {
    return language === 'fr' ? bond.typeFR : bond.typeES;
  };

  const getBondCharLabel = () => {
    return language === 'fr' ? bond.characterFR : bond.characterES;
  };

  return React.createElement('div', {
    className: 'lewis-vsepr-container animate-fade-in',
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '10px 0'
    }
  },
    React.createElement('div', {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }
    },
      // Left config panel
      React.createElement('div', {
        className: 'glass-panel',
        style: {
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }
      },
        React.createElement('h4', {
          style: {
            fontFamily: 'var(--font-title)',
            fontSize: '12px',
            color: 'var(--neon-cyan)',
            margin: '0 0 6px 0',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }
        },
          React.createElement(GitCommit, { size: 14 }),
          (language === 'fr' ? "CONFIGURATION LIAISON" : "CONFIGURACIÓN ENLACE").toUpperCase()
        ),

        // Ligand Selector
        React.createElement('div', null,
          React.createElement('label', { style: { display: 'block', fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px', fontFamily: 'var(--font-mono)' } },
            language === 'fr' ? "PARTENAIRE DE LIAISON" : "COMPAÑERO DE ENLACE"
          ),
          React.createElement('select', {
            value: ligand,
            onChange: (e) => setLigand((e.target as HTMLSelectElement).value),
            style: {
              width: '100%',
              padding: '6px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--glass-border)',
              borderRadius: '4px',
              color: '#fff',
              outline: 'none',
              fontSize: '11px'
            }
          },
            ['H', 'O', 'Cl', 'F', 'N'].map(sym => {
              if (sym === centralSymbol) return null;
              return React.createElement('option', { key: sym, value: sym }, sym);
            })
          )
        ),

        // Count Selector Slider
        React.createElement('div', null,
          React.createElement('label', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px', fontFamily: 'var(--font-mono)' } },
            React.createElement('span', null, language === 'fr' ? "NOMBRE D'ATOMES LIGAND" : "NÚMERO DE ÁTOMOS LIGANDO"),
            React.createElement('span', { style: { color: 'var(--neon-magenta)', fontWeight: 'bold' } }, count)
          ),
          React.createElement('input', {
            type: 'range',
            min: 1,
            max: 6,
            value: count,
            onChange: handleSliderChange,
            style: {
              width: '100%',
              accentColor: 'var(--neon-cyan)',
              cursor: 'pointer'
            }
          })
        ),

        // Telemetry stats
        React.createElement('div', {
          style: {
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px'
          }
        },
          React.createElement('div', null,
            React.createElement('span', { style: { color: 'var(--text-muted)' } }, "FORMULA: "),
            React.createElement('span', { style: { color: '#fff', fontWeight: 'bold' } }, `${centralSymbol}${count > 1 ? count : ''}${ligand}`)
          ),
          React.createElement('div', null,
            React.createElement('span', { style: { color: 'var(--text-muted)' } }, "BOND TYPE: "),
            React.createElement('span', { style: { color: 'var(--neon-cyan)' } }, getBondTypeLabel())
          ),
          React.createElement('div', null,
            React.createElement('span', { style: { color: 'var(--text-muted)' } }, "Δ ELECTRONEGATIVITY: "),
            React.createElement('span', { style: { color: '#fff' } }, bond.polarityDiff)
          ),
          React.createElement('div', null,
            React.createElement('span', { style: { color: 'var(--text-muted)' } }, "BOND ENERGY: "),
            React.createElement('span', { style: { color: 'var(--neon-yellow)' } }, `${bond.energy} kJ/mol`)
          ),
          React.createElement('div', null,
            React.createElement('span', { style: { color: 'var(--text-muted)' } }, "BOND LENGTH: "),
            React.createElement('span', { style: { color: 'var(--neon-yellow)' } }, `${bond.length} pm`)
          )
        )
      ),

      // Visuals grid
      React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px'
        }
      },
        // 2D Lewis Box
        React.createElement('div', {
          className: 'glass-panel',
          style: {
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.01)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }
        },
          React.createElement('span', { style: { fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '1px' } },
            language === 'fr' ? "STRUCTURE DE LEWIS (2D)" : "ESTRUCTURA DE LEWIS (2D)"
          ),
          React.createElement('canvas', {
            ref: lewisCanvasRef,
            width: 150,
            height: 150,
            style: {
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '6px',
              background: '#07080f'
            }
          })
        ),

        // 3D VSEPR Box
        React.createElement('div', {
          className: 'glass-panel',
          style: {
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.01)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }
        },
          React.createElement('span', { style: { fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '1px' } },
            language === 'fr' ? "GÉOMÉTRIE VSEPR (3D)" : "GEOMETRÍA VSEPR (3D)"
          ),
          React.createElement('canvas', {
            ref: vseprCanvasRef,
            width: 150,
            height: 150,
            style: {
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '6px',
              background: '#07080f'
            }
          })
        )
      )
    ),

    // Bottom explanations
    React.createElement('div', {
      className: 'glass-panel',
      style: {
        padding: '14px',
        background: 'rgba(255, 0, 127, 0.02)',
        border: '1px solid rgba(255, 0, 127, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }
    },
      React.createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--font-title)',
          fontSize: '11px',
          color: 'var(--neon-magenta)',
          letterSpacing: '1px'
        }
      },
        React.createElement(Activity, { size: 13 }),
        (language === 'fr' ? "ANALYSE DE GÉOMÉTRIE QUANTIQUE & HYBRIDATION" : "ANÁLISIS DE GEOMETRÍA CUÁNTICA E HIBRIDACIÓN").toUpperCase()
      ),
      React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--text-secondary)'
        }
      },
        React.createElement('div', null,
          React.createElement('span', { style: { color: 'var(--text-muted)' } }, "GEOMETRY: "),
          React.createElement('span', { style: { color: '#fff', fontWeight: 'bold' } }, getGeometryLabel()),
          React.createElement('br', null),
          React.createElement('span', { style: { color: 'var(--text-muted)' } }, "BOND ANGLE: "),
          React.createElement('span', { style: { color: 'var(--neon-magenta)' } }, vsepr.bondAngle)
        ),
        React.createElement('div', null,
          React.createElement('span', { style: { color: 'var(--text-muted)' } }, "HYBRIDIZATION: "),
          React.createElement('span', { style: { color: '#fff', fontWeight: 'bold' } }, vsepr.hybridization),
          React.createElement('br', null),
          React.createElement('span', { style: { color: 'var(--text-muted)' } }, "LONE PAIRS (LP): "),
          React.createElement('span', { style: { color: 'var(--neon-magenta)' } }, vsepr.lonePairs)
        )
      ),
      React.createElement('p', {
        style: {
          fontSize: '10px',
          color: 'var(--text-muted)',
          margin: '6px 0 0 0',
          lineHeight: '1.4'
        }
      },
        `// ${getBondCharLabel()}`
      )
    )
  );
};
