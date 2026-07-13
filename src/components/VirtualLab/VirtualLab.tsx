import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import { ShieldAlert, Play, Beaker, CheckCircle } from 'lucide-react';
import { resolveCssColor } from '../../utils/resolveCssColor';

const isStringArray = (raw: unknown): raw is string[] =>
  Array.isArray(raw) && raw.every(item => typeof item === 'string');

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
  const [hasIndicator, setHasIndicator] = useState<boolean>(false);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  const [completedExperiments, setCompletedExperiments] = useLocalStorageState<string[]>(
    'virtualLabCompletedExperiments',
    [],
    { validate: isStringArray }
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const exp = EXPERIMENTS.find(e => e.id === selectedExpId) || EXPERIMENTS[0];

  useEffect(() => {
    if (!completed) return;
    setCompletedExperiments(prev => prev.includes(selectedExpId) ? prev : [...prev, selectedExpId]);
  }, [completed, selectedExpId, setCompletedExperiments]);

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

  useEffect(() => {
    if (!isRunning) return;
    let animId = 0;
    const start = Date.now();
    const duration = selectedExpId === 'h2o' ? 1000 : 3000;

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const neonOrange = resolveCssColor('var(--neon-orange)', '#ff6c00');
    ctx.clearRect(0, 0, w, h);

    const bx = w / 2;
    const by = h / 2 + 30;
    const bw = 100;
    const bh = 140;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(bx - bw / 2, by - bh);
    ctx.lineTo(bx - bw / 2, by);
    ctx.quadraticCurveTo(bx - bw / 2, by + 15, bx, by + 15);
    ctx.quadraticCurveTo(bx + bw / 2, by + 15, bx + bw / 2, by);
    ctx.lineTo(bx + bw / 2, by - bh);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1.5;
    for (let i = 1; i <= 4; i++) {
      const gy = by - (bh / 5) * i;
      ctx.beginPath();
      ctx.moveTo(bx - bw / 2 + 5, gy);
      ctx.lineTo(bx - bw / 2 + 20, gy);
      ctx.stroke();
    }

    if (selectedExpId === 'h2o') {
      if (!completed) {
        ctx.fillStyle = 'rgba(0, 243, 255, 0.6)';
        const pCount = Math.round(m1 * 3);
        for (let i = 0; i < pCount; i++) {
          const px = bx - bw / 2 + 10 + (Math.sin(Date.now() * 0.005 + i) * 0.5 + 0.5) * (bw - 20);
          const py = by - bh + 10 + (Math.cos(Date.now() * 0.003 + i) * 0.5 + 0.5) * (bh - 20);
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, 2 * Math.PI);
          ctx.fill();
        }

        ctx.fillStyle = 'rgba(255, 0, 127, 0.6)';
        const oCount = Math.round(m2 * 2);
        for (let i = 0; i < oCount; i++) {
          const px = bx - bw / 2 + 10 + (Math.cos(Date.now() * 0.004 + i * 2) * 0.5 + 0.5) * (bw - 20);
          const py = by - bh + 10 + (Math.sin(Date.now() * 0.006 + i * 2) * 0.5 + 0.5) * (bh - 20);
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      if (isRunning && progress < 0.4) {
        ctx.fillStyle = `rgba(255, 120, 0, ${1 - progress * 2.5})`;
        ctx.beginPath();
        ctx.arc(bx, by - bh / 2, bw * 0.8, 0, 2 * Math.PI);
        ctx.fill();
      }

      if (completed || (isRunning && progress >= 0.2)) {
        const opacity = isRunning ? (progress - 0.2) / 0.8 : 1;
        ctx.fillStyle = `rgba(0, 160, 255, ${opacity * 0.25})`;
        ctx.beginPath();
        ctx.moveTo(bx - bw / 2 + 2, by - 20);
        ctx.lineTo(bx - bw / 2 + 2, by);
        ctx.quadraticCurveTo(bx - bw / 2, by + 13, bx, by + 13);
        ctx.quadraticCurveTo(bx + bw / 2, by + 13, bx + bw / 2 - 2, by);
        ctx.lineTo(bx + bw / 2 - 2, by - 20);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = `rgba(0, 160, 255, ${opacity * 0.4})`;
        ctx.beginPath();
        ctx.ellipse(bx, by - 20, bw / 2 - 2, 4, 0, 0, 2 * Math.PI);
        ctx.fill();

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
      const sodSize = Math.max(8, m1 * 1.5);
      const isLiquid = temp >= 370;

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

      ctx.fillStyle = isRunning ? `rgb(255, 230, ${Math.round(200 * (1-progress))})` : 'rgba(160, 170, 180, 1)';
      ctx.strokeStyle = isRunning ? neonOrange : 'rgba(100, 110, 120, 1)';
      ctx.lineWidth = 1.5;

      if (isLiquid) {
        ctx.beginPath();
        ctx.ellipse(bx, by + 5, sodSize * 1.5, 4, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.rect(bx - sodSize / 2, by + 5 - sodSize, sodSize, sodSize);
        ctx.fill();
        ctx.stroke();
      }

      if (completed) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        for (let i = 0; i < 15; i++) {
          const sx = bx - bw / 2 + 10 + (Math.sin(i * 99) * 0.5 + 0.5) * (bw - 20);
          const sy = by + 10 + Math.cos(i * 12) * 3;
          ctx.fillRect(sx, sy, 3, 3);
        }
      }

    } else if (selectedExpId === 'neutralization') {
      const molesAcid = m1 / 36.46;
      const molesBase = m2 / 40;
      const isBasic = molesBase > molesAcid;

      let liquidColor = 'rgba(255,255,255,0.04)';
      let waveColor = 'rgba(255,255,255,0.08)';

      if (hasIndicator && isBasic) {
        liquidColor = 'rgba(255, 0, 127, 0.35)';
        waveColor = 'rgba(255, 0, 127, 0.5)';
      }

      ctx.fillStyle = liquidColor;
      ctx.beginPath();
      ctx.moveTo(bx - bw / 2 + 2, by - 60);
      ctx.lineTo(bx - bw / 2 + 2, by);
      ctx.quadraticCurveTo(bx - bw / 2, by + 13, bx, by + 13);
      ctx.quadraticCurveTo(bx + bw / 2, by + 13, bx + bw / 2 - 2, by);
      ctx.lineTo(bx + bw / 2 - 2, by - 60);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = waveColor;
      ctx.beginPath();
      ctx.ellipse(bx, by - 60, bw / 2 - 2, 5, 0, 0, 2 * Math.PI);
      ctx.fill();

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

  const showHighPressureRisk = press >= 3;
  const showExplosionRisk = selectedExpId === 'h2o' && temp >= 450;
  const showCorrosiveRisk = selectedExpId === 'neutralization' && (m1 >= 15 || m2 >= 15);
  const showToxicityRisk = selectedExpId === 'nacl' && !completed;

  const expName = language === 'fr' ? exp.nameFR : exp.nameES;
  const liveStatusMessage = isRunning
    ? (language === 'fr' ? `Réaction en cours : ${expName}.` : `Reacción en curso: ${expName}.`)
    : completed
      ? (language === 'fr' ? `Expérience terminée : ${expName} complétée avec succès.` : `Experimento completado: ${expName} completado con éxito.`)
      : '';

  return (
    <div className="virtual-lab-container responsive-card-grid animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', width: '100%' }}>
      
      {/* Screen-reader announcement of experiment progress/outcome */}
      <div role="status" aria-live="polite" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
        {liveStatusMessage}
      </div>

      {/* Left controls column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Experiment selector panel */}
        <div className="glass-panel" style={{ padding: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '13px', color: '#fff', marginBottom: '12px', letterSpacing: '1px' }}>
            {(language === 'fr' ? "EXPÉRIENCE DE LABORATOIRE" : "EXPERIMENTO DE LABORATORIO").toUpperCase()}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {EXPERIMENTS.map(e => {
              const active = selectedExpId === e.id;
              return (
                <button
                  key={e.id}
                  onClick={() => setSelectedExpId(e.id)}
                  className={`btn hover-lift ${active ? '' : 'btn-outline'}`}
                  aria-pressed={active}
                  style={{
                    padding: '10px 14px',
                    background: active ? 'rgba(0, 243, 255, 0.05)' : 'rgba(255,255,255,0.01)',
                    border: `1px solid ${active ? 'var(--neon-cyan)' : 'var(--glass-border)'}`,
                    borderRadius: '6px',
                    color: active ? '#fff' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-title)',
                    fontSize: '11px',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    width: '100%'
                  }}
                >
                  <Beaker size={13} style={{ color: active ? 'var(--neon-cyan)' : 'inherit', flexShrink: 0 }} aria-hidden="true" />
                  <span style={{ flex: 1 }}>{language === 'fr' ? e.nameFR : e.nameES}</span>
                  {completedExperiments.includes(e.id) && (
                    <CheckCircle
                      size={13}
                      aria-label={language === 'fr' ? 'Expérience déjà réalisée' : 'Experimento ya realizado'}
                      style={{ color: 'var(--neon-green)', flexShrink: 0 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dials and parameters panel */}
        <div className="glass-panel" style={{ padding: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '13px', color: '#fff', marginBottom: '4px', letterSpacing: '1px' }}>
            {(language === 'fr' ? "PARAMÈTRES THERMODYNAMIQUES" : "PARÁMETROS TERMODINÁMICOS").toUpperCase()}
          </h3>

          {/* Temperature Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
              <label htmlFor="temp-slider">{language === 'fr' ? "TEMPÉRATURE" : "TEMPERATURA"}</label>
              <span style={{ color: 'var(--neon-orange)' }} aria-hidden="true">{temp} K</span>
            </div>
            <input
              id="temp-slider"
              type="range"
              min={100}
              max={800}
              value={temp}
              onChange={(e) => setTemp(parseInt(e.target.value))}
              aria-valuetext={`${temp} Kelvin`}
              style={{ width: '100%', accentColor: 'var(--neon-orange)' }}
            />
          </div>

          {/* Pressure Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
              <label htmlFor="press-slider">{language === 'fr' ? "PRESSION" : "PRESIÓN"}</label>
              <span style={{ color: 'var(--neon-yellow)' }} aria-hidden="true">{press.toFixed(1)} atm</span>
            </div>
            <input
              id="press-slider"
              type="range"
              min={0.1}
              max={5.0}
              step={0.1}
              value={press}
              onChange={(e) => setPress(parseFloat(e.target.value))}
              aria-valuetext={`${press.toFixed(1)} atmosphères`}
              style={{ width: '100%', accentColor: 'var(--neon-yellow)' }}
            />
          </div>

          {/* Mass Reactant 1 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
              <label htmlFor="m1-slider">{language === 'fr' ? "RÉACTIF A (g)" : "REACTIVO A (g)"}</label>
              <span style={{ color: 'var(--neon-cyan)' }} aria-hidden="true">{m1} g</span>
            </div>
            <input
              id="m1-slider"
              type="range"
              min={1}
              max={20}
              value={m1}
              onChange={(e) => setM1(parseInt(e.target.value))}
              aria-valuetext={`${m1} grammes`}
              style={{ width: '100%', accentColor: 'var(--neon-cyan)' }}
            />
          </div>

          {/* Mass Reactant 2 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
              <label htmlFor="m2-slider">{language === 'fr' ? "RÉACTIF B (g)" : "REACTIVO B (g)"}</label>
              <span style={{ color: 'var(--neon-cyan)' }} aria-hidden="true">{m2} g</span>
            </div>
            <input
              id="m2-slider"
              type="range"
              min={1}
              max={20}
              value={m2}
              onChange={(e) => setM2(parseInt(e.target.value))}
              aria-valuetext={`${m2} grammes`}
              style={{ width: '100%', accentColor: 'var(--neon-cyan)' }}
            />
          </div>

          {/* Indicator Toggle (only for titration) */}
          {selectedExpId === 'neutralization' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#fff', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
              <input
                type="checkbox"
                id="indicator"
                checked={hasIndicator}
                onChange={(e) => setHasIndicator(e.target.checked)}
                style={{ accentColor: 'var(--neon-magenta)', cursor: 'pointer' }}
              />
              <label htmlFor="indicator" style={{ cursor: 'pointer' }}>
                {language === 'fr' ? "AJOUTER PHÉNOLPHTALÉINE (INDICATEUR)" : "AÑADIR FENOLFTALEÍNA (INDICADOR)"}
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Right visualization & results column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Beaker Canvas container */}
        <div className="glass-panel" style={{ padding: '20px', background: '#07080f', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '250px' }}>
          <canvas
            ref={canvasRef}
            width={250}
            height={230}
            role="img"
            aria-label={`${expName}: ${isRunning ? (language === 'fr' ? 'réaction en cours' : 'reacción en curso') : completed ? (language === 'fr' ? 'terminée' : 'completado') : (language === 'fr' ? 'en attente' : 'en espera')}`}
            style={{ background: 'transparent' }}
          />

          {/* Action Trigger Button */}
          <button
            onClick={handleStartExperiment}
            disabled={isRunning}
            className={`btn ${isRunning ? '' : 'btn-primary'} hover-lift`}
            style={{
              marginTop: '16px',
              width: '100%',
              maxWidth: '220px',
              padding: '10px 20px',
              background: isRunning ? 'rgba(255, 255, 255, 0.05)' : undefined,
              border: `1px solid ${isRunning ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
              color: isRunning ? 'var(--text-muted)' : undefined,
              fontSize: '11px',
              letterSpacing: '1px'
            }}
          >
            {completed ? <CheckCircle size={14} style={{ color: 'var(--neon-green)' }} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
            {completed
              ? (language === 'fr' ? "EXPÉRIENCE COMPLÉTÉE" : "EXPERIMENTO COMPLETADO")
              : (isRunning ? (language === 'fr' ? "REACTION EN COURS..." : "REACCION EN CURSO...") : (language === 'fr' ? "LANCER L'EXPÉRIENCE" : "INICIAR EXPERIMENTO"))}
          </button>
        </div>

        {/* Risk/Hazards Banner Panel */}
        <div className="glass-panel" style={{ padding: '14px', background: 'rgba(255, 0, 127, 0.02)', border: '1px solid rgba(255, 0, 127, 0.15)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h4 style={{ margin: 0, fontFamily: 'var(--font-title)', fontSize: '11px', color: 'var(--neon-magenta)', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldAlert size={14} aria-hidden="true" />
            {(language === 'fr' ? "ALERTES DE SÉCURITÉ CHIMIQUE" : "ALERTAS DE SEGURIDAD QUÍMICA").toUpperCase()}
          </h4>

          {/* Hazard Lists */}
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {(language === 'fr' ? exp.hazardsFR : exp.hazardsES).map((h, i) => <li key={i}>{h}</li>)}
            
            {/* Dynamic warnings */}
            {showHighPressureRisk && <li style={{ color: 'var(--neon-magenta)', fontWeight: 'bold' }}>
              {language === 'fr' ? "ATTENTION : SURPRESSION DE CUVETTE (> 3.0 atm) !" : "CUIDADO: ¡SOBREPRESIÓN EN RECIPIENTE (> 3.0 atm)!"}
            </li>}
            {showExplosionRisk && <li style={{ color: 'var(--neon-magenta)', fontWeight: 'bold' }}>
              {language === 'fr' ? "ATTENTION : DANGER D'AUTO-ALLUMAGE THERMIQUE EXPLOSIF !" : "CUIDADO: ¡PELIGRO DE AUTOENCENDIDO TÉRMICO EXPLOSIVO!"}
            </li>}
            {showCorrosiveRisk && <li style={{ color: 'var(--neon-yellow)', fontWeight: 'bold' }}>
              {language === 'fr' ? "AVERTISSEMENT : HAUTE CONCENTRATION CORROSIVE EN SOLUTION !" : "ADVERTENCIA: ¡ALTA CONCENTRACIÓN CORROSIVA EN SOLUCIÓN!"}
            </li>}
            {showToxicityRisk && <li style={{ color: 'var(--neon-magenta)' }}>
              {language === 'fr' ? "DANGER : RUPTURE DU DICHLARE GAZEUX TOXIQUE EN AIR LIBRE !" : "PELIGRO: ¡ESCAPE DE DICLORO GASEOSO TÓXICO EN EL AIRE!"}
            </li>}
          </ul>
        </div>
      </div>
    </div>
  );
};
