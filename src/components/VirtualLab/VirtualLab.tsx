import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { ShieldAlert, Play, Beaker, CheckCircle } from 'lucide-react';

interface Experiment {
  id: string;
  nameFR: string;
  nameES: string;
  descFR: string;
  descES: string;
  reactantsFR: string;
  reactantsES: string;
  defaultTemp: number; // K
  defaultPress: number; // atm
  hazardsFR: string[];
  hazardsES: string[];
}

const EXPERIMENTS: Experiment[] = [
  {
    id: 'h2o',
    nameFR: 'Synthèse de l\'Eau (Combustion Explosive)',
    nameES: 'Síntesis de Agua (Combustión Explosiva)',
    descFR: 'Combustion de H₂ et O₂ initiée par étincelle thermique.',
    descES: 'Combustión de H₂ y O₂ iniciada por chispa térmica.',
    reactantsFR: 'H₂ (gaz) + O₂ (gaz)',
    reactantsES: 'H₂ (gas) + O₂ (gas)',
    defaultTemp: 298,
    defaultPress: 1,
    hazardsFR: ['Risque élevé d\'explosion', 'Gaz hautement inflammable', 'Dégagement de chaleur intense'],
    hazardsES: ['Alto riesgo de explosión', 'Gas altamente inflamable', 'Liberación de calor intenso']
  },
  {
    id: 'nacl',
    nameFR: 'Fusion du Sodium dans le Chlore',
    nameES: 'Fusión de Sodio en Cloro',
    descFR: 'Le sodium métallique brûle vigoureusement dans le chlore gazeux pour former du sel de table.',
    descES: 'El sodio metálico se quema vigorosamente en gas cloro para formar sal de mesa.',
    reactantsFR: 'Na (solide) + Cl₂ (gaz toxique)',
    reactantsES: 'Na (sólido) + Cl₂ (gas tóxico)',
    defaultTemp: 300,
    defaultPress: 1.2,
    hazardsFR: ['Chlore gazeux extrêmement toxique', 'Sodium réactif à l\'eau', 'Flamme aveuglante'],
    hazardsES: ['Gas cloro extremadamente tóxico', 'Sodio reactivo con agua', 'Llama cegadora']
  },
  {
    id: 'neutralization',
    nameFR: 'Titrage Acide-Base (Indicateur Phénolphtaléine)',
    nameES: 'Titulación Ácido-Base (Indicador Fenolftaleína)',
    descFR: 'Neutralisation de l\'acide chlorhydrique par la soude avec virage coloré.',
    descES: 'Neutralización del ácido clorhídrico por sosa con viraje de color.',
    reactantsFR: 'HCl (acide) + NaOH (base)',
    reactantsES: 'HCl (ácido) + NaOH (base)',
    defaultTemp: 298,
    defaultPress: 1,
    hazardsFR: ['Acides et bases corrosifs', 'Réaction exothermique modérée'],
    hazardsES: ['Ácidos y bases corrosivos', 'Reacción exotérmica moderada']
  }
];

export const VirtualLab: React.FC = () => {
  const { language } = useLanguage();
  const [selectedExpId, setSelectedExpId] = useState<string>('h2o');
  const [temp, setTemp] = useState<number>(298); // K
  const [press, setPress] = useState<number>(1);   // atm
  const [m1, setM1] = useState<number>(5);       // mass reactant 1 (g)
  const [m2, setM2] = useState<number>(5);       // mass reactant 2 (g)
  const [hasIndicator, setHasIndicator] = useState<boolean>(false); // only for neutralization

  // Simulation play state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0); // 0 to 1
  const [completed, setCompleted] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const exp = EXPERIMENTS.find(e => e.id === selectedExpId) || EXPERIMENTS[0];

  // Reset progress when switching experiments
  useEffect(() => {
    setIsRunning(false);
    setProgress(0);
    setCompleted(false);
    setTemp(exp.defaultTemp);
    setPress(exp.defaultPress);
    setM1(5);
    setM2(5);
    setHasIndicator(false);
  }, [selectedExpId, exp]);

  // Animation Loop
  useEffect(() => {
    if (!isRunning) return;
    let animId = 0;
    const start = Date.now();
    const duration = selectedExpId === 'h2o' ? 1000 : 3000; // Water synthesis is fast/explosive!

    const tick = () => {
      const elapsed = Date.now() - start;
      const nextProgress = Math.min(1, elapsed / duration);
      setProgress(nextProgress);

      if (nextProgress < 1) {
        animId = requestAnimationFrame(tick);
      } else {
        setIsRunning(false);
        setCompleted(true);
      }
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isRunning, selectedExpId]);

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const bx = w / 2;
    const by = h / 2 + 30;
    const bw = 100; // beaker width
    const bh = 140; // beaker height

    // Draw Beaker Glass Frame
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(bx - bw / 2, by - bh);
    ctx.lineTo(bx - bw / 2, by);
    ctx.quadraticCurveTo(bx - bw / 2, by + 15, bx, by + 15);
    ctx.quadraticCurveTo(bx + bw / 2, by + 15, bx + bw / 2, by);
    ctx.lineTo(bx + bw / 2, by - bh);
    ctx.stroke();

    // Draw graduation lines on beaker
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1.5;
    for (let i = 1; i <= 4; i++) {
      const gy = by - (bh / 5) * i;
      ctx.beginPath();
      ctx.moveTo(bx - bw / 2 + 5, gy);
      ctx.lineTo(bx - bw / 2 + 20, gy);
      ctx.stroke();
    }

    // Render contents based on selected experiment and progress
    if (selectedExpId === 'h2o') {
      // GAS PHASE (H2 & O2)
      // Draw unreacted floating particles (moving randomly)
      if (!completed) {
        ctx.fillStyle = 'rgba(0, 243, 255, 0.6)'; // H2
        const pCount = Math.round(m1 * 3);
        for (let i = 0; i < pCount; i++) {
          const px = bx - bw / 2 + 10 + (Math.sin(Date.now() * 0.005 + i) * 0.5 + 0.5) * (bw - 20);
          const py = by - bh + 10 + (Math.cos(Date.now() * 0.003 + i) * 0.5 + 0.5) * (bh - 20);
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, 2 * Math.PI);
          ctx.fill();
        }

        ctx.fillStyle = 'rgba(255, 0, 127, 0.6)'; // O2
        const oCount = Math.round(m2 * 2);
        for (let i = 0; i < oCount; i++) {
          const px = bx - bw / 2 + 10 + (Math.cos(Date.now() * 0.004 + i * 2) * 0.5 + 0.5) * (bw - 20);
          const py = by - bh + 10 + (Math.sin(Date.now() * 0.006 + i * 2) * 0.5 + 0.5) * (bh - 20);
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      // EXPLOSION FLASH
      if (isRunning && progress < 0.4) {
        ctx.fillStyle = `rgba(255, 120, 0, ${1 - progress * 2.5})`;
        ctx.beginPath();
        ctx.arc(bx, by - bh / 2, bw * 0.8, 0, 2 * Math.PI);
        ctx.fill();
      }

      // PRODUCT WATER LAYER
      if (completed || (isRunning && progress >= 0.2)) {
        const opacity = isRunning ? (progress - 0.2) / 0.8 : 1;
        // Draw liquid layer at the bottom
        ctx.fillStyle = `rgba(0, 160, 255, ${opacity * 0.25})`;
        ctx.beginPath();
        ctx.moveTo(bx - bw / 2 + 2, by - 20);
        ctx.lineTo(bx - bw / 2 + 2, by);
        ctx.quadraticCurveTo(bx - bw / 2, by + 13, bx, by + 13);
        ctx.quadraticCurveTo(bx + bw / 2, by + 13, bx + bw / 2 - 2, by);
        ctx.lineTo(bx + bw / 2 - 2, by - 20);
        ctx.closePath();
        ctx.fill();

        // Wave top
        ctx.fillStyle = `rgba(0, 160, 255, ${opacity * 0.4})`;
        ctx.beginPath();
        ctx.ellipse(bx, by - 20, bw / 2 - 2, 4, 0, 0, 2 * Math.PI);
        ctx.fill();

        // Droplets on walls
        ctx.fillStyle = `rgba(0, 243, 255, ${opacity * 0.5})`;
        const dropY = [by - bh + 30, by - bh + 60, by - bh + 80, by - bh + 45];
        const dropX = [bx - bw / 2 + 8, bx + bw / 2 - 12, bx - bw / 2 + 15, bx + bw / 2 - 8];
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.arc(dropX[i], dropY[i] + Math.sin(Date.now() * 0.002 + i) * 2, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

    } else if (selectedExpId === 'nacl') {
      // SODIUM METALLIC SOLID
      const sodSize = Math.max(8, m1 * 1.5);
      const isLiquid = temp >= 370;

      // Chlorine Gas Background color (yellow green)
      if (!completed) {
        const gasOpacity = Math.max(0.05, 0.4 * (1 - progress));
        ctx.fillStyle = `rgba(180, 255, 0, ${gasOpacity})`;
        ctx.beginPath();
        ctx.moveTo(bx - bw / 2 + 2, by - bh);
        ctx.lineTo(bx - bw / 2 + 2, by);
        ctx.quadraticCurveTo(bx - bw / 2, by + 13, bx, by + 13);
        ctx.quadraticCurveTo(bx + bw / 2, by + 13, bx + bw / 2 - 2, by);
        ctx.lineTo(bx + bw / 2 - 2, by - bh);
        ctx.closePath();
        ctx.fill();
      }

      // Draw reaction glow & smoke
      if (isRunning) {
        ctx.fillStyle = `rgba(255, 255, 255, ${progress * 0.3})`;
        for (let i = 0; i < 8; i++) {
          const rx = bx + Math.sin(Date.now() * 0.01 + i) * 20;
          const ry = by - 15 - i * 12;
          ctx.beginPath();
          ctx.arc(rx, ry, 6 + i * 2, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      // Draw Sodium chunk at bottom
      ctx.fillStyle = isRunning ? `rgb(255, 230, ${Math.round(200 * (1-progress))})` : 'rgba(160, 170, 180, 1)';
      ctx.strokeStyle = isRunning ? 'var(--neon-orange)' : 'rgba(100, 110, 120, 1)';
      ctx.lineWidth = 1.5;

      if (isLiquid) {
        // Flat liquid pool of melted sodium
        ctx.beginPath();
        ctx.ellipse(bx, by + 5, sodSize * 1.5, 4, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      } else {
        // Solid grey cube lump
        ctx.beginPath();
        ctx.rect(bx - sodSize / 2, by + 5 - sodSize, sodSize, sodSize);
        ctx.fill();
        ctx.stroke();
      }

      // Draw white NaCl salt precipitate at the bottom
      if (completed) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        for (let i = 0; i < 15; i++) {
          const sx = bx - bw / 2 + 10 + (Math.sin(i * 99) * 0.5 + 0.5) * (bw - 20);
          const sy = by + 10 + Math.cos(i * 12) * 3;
          ctx.fillRect(sx, sy, 3, 3);
        }
      }

    } else if (selectedExpId === 'neutralization') {
      // Neutralization Liquid
      // If indicator is present:
      // - Acidic (default): clear/transparent
      // - Basic (added NaOH makes moles NaOH > moles HCl): pink!
      // HCl moles estimated from m1 (Molar mass ~ 36.46)
      // NaOH moles estimated from m2 (Molar mass ~ 40)
      const molesAcid = m1 / 36.46;
      const molesBase = m2 / 40;
      const isBasic = molesBase > molesAcid;

      let liquidColor = 'rgba(255,255,255,0.04)'; // transparent water
      let waveColor = 'rgba(255,255,255,0.08)';

      if (hasIndicator) {
        if (isBasic) {
          liquidColor = 'rgba(255, 0, 127, 0.35)'; // hot pink basic phénolphtaléine
          waveColor = 'rgba(255, 0, 127, 0.5)';
        }
      }

      // Draw liquid fill
      ctx.fillStyle = liquidColor;
      ctx.beginPath();
      ctx.moveTo(bx - bw / 2 + 2, by - 60);
      ctx.lineTo(bx - bw / 2 + 2, by);
      ctx.quadraticCurveTo(bx - bw / 2, by + 13, bx, by + 13);
      ctx.quadraticCurveTo(bx + bw / 2, by + 13, bx + bw / 2 - 2, by);
      ctx.lineTo(bx + bw / 2 - 2, by - 60);
      ctx.closePath();
      ctx.fill();

      // Top wave surface
      ctx.fillStyle = waveColor;
      ctx.beginPath();
      ctx.ellipse(bx, by - 60, bw / 2 - 2, 5, 0, 0, 2 * Math.PI);
      ctx.fill();

      // Draw pouring drops if isRunning
      if (isRunning) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        const dropY = by - bh + progress * bh * 0.6;
        if (dropY < by - 60) {
          ctx.beginPath();
          ctx.arc(bx, dropY, 3, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
  }, [selectedExpId, temp, press, m1, m2, hasIndicator, isRunning, progress, completed]);

  const handleStartExperiment = () => {
    if (isRunning) return;
    setCompleted(false);
    setProgress(0);
    setIsRunning(true);
  };

  const selectExperiment = (id: string) => {
    setSelectedExpId(id);
  };

  // Safe checks for warning triggers
  const showHighPressureRisk = press >= 3;
  const showExplosionRisk = selectedExpId === 'h2o' && temp >= 450;
  const showCorrosiveRisk = selectedExpId === 'neutralization' && (m1 >= 15 || m2 >= 15);
  const showToxicityRisk = selectedExpId === 'nacl' && !completed;

  return React.createElement('div', {
    className: 'virtual-lab-container animate-fade-in',
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      width: '100%'
    }
  },
    // Left controls column
    React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }
    },
      // Experiment selector panel
      React.createElement('div', {
        className: 'glass-panel',
        style: {
          padding: '16px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--glass-border)'
        }
      },
        React.createElement('h3', { style: { fontFamily: 'var(--font-title)', fontSize: '13px', color: '#fff', marginBottom: '12px', letterSpacing: '1px' } },
          (language === 'fr' ? "EXPÉRIENCE DE LABORATOIRE" : "EXPERIMENTO DE LABORATORIO").toUpperCase()
        ),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
          EXPERIMENTS.map(e => {
            const active = selectedExpId === e.id;
            return React.createElement('button', {
              key: e.id,
              onClick: () => selectExperiment(e.id),
              style: {
                padding: '10px 14px',
                background: active ? 'rgba(0, 243, 255, 0.05)' : 'rgba(255,255,255,0.01)',
                border: `1px solid ${active ? 'var(--neon-cyan)' : 'var(--glass-border)'}`,
                borderRadius: '6px',
                color: active ? '#fff' : 'var(--text-secondary)',
                fontFamily: 'var(--font-title)',
                fontSize: '11px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }
            },
              React.createElement(Beaker, { size: 13, style: { color: active ? 'var(--neon-cyan)' : 'inherit' } }),
              language === 'fr' ? e.nameFR : e.nameES
            );
          })
        )
      ),

      // Dials and parameters panel
      React.createElement('div', {
        className: 'glass-panel',
        style: {
          padding: '16px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }
      },
        React.createElement('h3', { style: { fontFamily: 'var(--font-title)', fontSize: '13px', color: '#fff', marginBottom: '4px', letterSpacing: '1px' } },
          (language === 'fr' ? "PARAMÈTRES THERMODYNAMIQUES" : "PARÁMETROS TERMODINÁMICOS").toUpperCase()
        ),

        // Temperature Slider
        React.createElement('div', null,
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '4px' } },
            React.createElement('span', null, language === 'fr' ? "TEMPÉRATURE" : "TEMPERATURA"),
            React.createElement('span', { style: { color: 'var(--neon-orange)' } }, `${temp} K`)
          ),
          React.createElement('input', {
            type: 'range',
            min: 100,
            max: 800,
            value: temp,
            onChange: (e) => setTemp(parseInt(e.target.value)),
            style: { width: '100%', accentColor: 'var(--neon-orange)' }
          })
        ),

        // Pressure Slider
        React.createElement('div', null,
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '4px' } },
            React.createElement('span', null, language === 'fr' ? "PRESSION" : "PRESIÓN"),
            React.createElement('span', { style: { color: 'var(--neon-yellow)' } }, `${press.toFixed(1)} atm`)
          ),
          React.createElement('input', {
            type: 'range',
            min: 0.1,
            max: 5.0,
            step: 0.1,
            value: press,
            onChange: (e) => setPress(parseFloat(e.target.value)),
            style: { width: '100%', accentColor: 'var(--neon-yellow)' }
          })
        ),

        // Mass Reactant 1
        React.createElement('div', null,
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '4px' } },
            React.createElement('span', null, language === 'fr' ? "RÉACTIF A (g)" : "REACTIVO A (g)"),
            React.createElement('span', { style: { color: 'var(--neon-cyan)' } }, `${m1} g`)
          ),
          React.createElement('input', {
            type: 'range',
            min: 1,
            max: 20,
            value: m1,
            onChange: (e) => setM1(parseInt(e.target.value)),
            style: { width: '100%', accentColor: 'var(--neon-cyan)' }
          })
        ),

        // Mass Reactant 2
        React.createElement('div', null,
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '4px' } },
            React.createElement('span', null, language === 'fr' ? "RÉACTIF B (g)" : "REACTIVO B (g)"),
            React.createElement('span', { style: { color: 'var(--neon-cyan)' } }, `${m2} g`)
          ),
          React.createElement('input', {
            type: 'range',
            min: 1,
            max: 20,
            value: m2,
            onChange: (e) => setM2(parseInt(e.target.value)),
            style: { width: '100%', accentColor: 'var(--neon-cyan)' }
          })
        ),

        // Indicator Toggle (only for titration)
        selectedExpId === 'neutralization' && React.createElement('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: '#fff',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: '10px'
          }
        },
          React.createElement('input', {
            type: 'checkbox',
            id: 'indicator',
            checked: hasIndicator,
            onChange: (e) => setHasIndicator(e.target.checked),
            style: { accentColor: 'var(--neon-magenta)', cursor: 'pointer' }
          }),
          React.createElement('label', { htmlFor: 'indicator', style: { cursor: 'pointer' } },
            language === 'fr' ? "AJOUTER PHÉNOLPHTALÉINE (INDICATEUR)" : "AÑADIR FENOLFTALEÍNA (INDICADOR)"
          )
        )
      )
    ),

    // Right visualization & results column
    React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }
    },
      // Beaker Canvas container
      React.createElement('div', {
        className: 'glass-panel',
        style: {
          padding: '20px',
          background: '#07080f',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '250px'
        }
      },
        React.createElement('canvas', {
          ref: canvasRef,
          width: 250,
          height: 230,
          style: { background: 'transparent' }
        }),

        // Action Trigger Button
        React.createElement('button', {
          onClick: handleStartExperiment,
          disabled: isRunning,
          style: {
            marginTop: '16px',
            width: '100%',
            maxWidth: '220px',
            padding: '10px 20px',
            background: isRunning ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 243, 255, 0.1)',
            border: `1px solid ${isRunning ? 'rgba(255,255,255,0.1)' : 'var(--neon-cyan)'}`,
            borderRadius: '6px',
            color: isRunning ? 'var(--text-muted)' : '#fff',
            fontFamily: 'var(--font-title)',
            fontSize: '11px',
            fontWeight: 'bold',
            letterSpacing: '1px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            boxShadow: isRunning ? 'none' : 'var(--glow-cyan)',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }
        },
          completed 
            ? React.createElement(CheckCircle, { size: 14, style: { color: 'var(--neon-green)' } })
            : React.createElement(Play, { size: 14 }),
          completed
            ? (language === 'fr' ? "EXPÉRIENCE COMPLÉTÉE" : "EXPERIMENTO COMPLETADO")
            : (isRunning ? (language === 'fr' ? "REACTION EN COURS..." : "REACCION EN CURSO...") : (language === 'fr' ? "LANCER L'EXPÉRIENCE" : "INICIAR EXPERIMENTO"))
        )
      ),

      // Risk/Hazards Banner Panel
      React.createElement('div', {
        className: 'glass-panel',
        style: {
          padding: '14px',
          background: 'rgba(255, 0, 127, 0.02)',
          border: '1px solid rgba(255, 0, 127, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }
      },
        React.createElement('h4', {
          style: {
            margin: 0,
            fontFamily: 'var(--font-title)',
            fontSize: '11px',
            color: 'var(--neon-magenta)',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }
        },
          React.createElement(ShieldAlert, { size: 14 }),
          (language === 'fr' ? "ALERTES DE SÉCURITÉ CHIMIQUE" : "ALERTAS DE SEGURIDAD QUÍMICA").toUpperCase()
        ),

        // Hazard Lists
        React.createElement('ul', {
          style: {
            margin: 0,
            paddingLeft: '16px',
            fontSize: '10.5px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }
        },
          (language === 'fr' ? exp.hazardsFR : exp.hazardsES).map((h, i) => React.createElement('li', { key: i }, h)),
          
          // Dynamic warnings
          showHighPressureRisk && React.createElement('li', { style: { color: 'var(--neon-magenta)', fontWeight: 'bold' } },
            language === 'fr' ? "ATTENTION : SURPRESSION DE CUVETTE (> 3.0 atm) !" : "CUIDADO: ¡SOBREPRESIÓN EN RECIPIENTE (> 3.0 atm)!"
          ),
          showExplosionRisk && React.createElement('li', { style: { color: 'var(--neon-magenta)', fontWeight: 'bold' } },
            language === 'fr' ? "ATTENTION : DANGER D'AUTO-ALLUMAGE THERMIQUE EXPLOSIF !" : "CUIDADO: ¡PELIGRO DE AUTOENCENDIDO TÉRMICO EXPLOSIVO!"
          ),
          showCorrosiveRisk && React.createElement('li', { style: { color: 'var(--neon-yellow)', fontWeight: 'bold' } },
            language === 'fr' ? "AVERTISSEMENT : HAUTE CONCENTRATION CORROSIVE EN SOLUTION !" : "ADVERTENCIA: ¡ALTA CONCENTRACIÓN CORROSIVA EN SOLUCIÓN!"
          ),
          showToxicityRisk && React.createElement('li', { style: { color: 'var(--neon-magenta)' } },
            language === 'fr' ? "DANGER : RUPTURE DU DICHLARE GAZEUX TOXIQUE EN AIR LIBRE !" : "PELIGRO: ¡ESCAPE DE DICLORO GASEOSO TÓXICO EN EL AIRE!"
          )
        )
      )
    )
  );
};
