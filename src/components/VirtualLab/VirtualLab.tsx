import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle, Play, RotateCcw } from 'lucide-react';
import { Badge, Button, Slider, Switch } from '../../design-system';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import { LabReadout, LabStation, SafetyList, StationPanel } from '../LabStation';
import { drawVirtualExperiment } from './virtualLabCanvas';
import { experiments, getProgressLabel, getRiskLevel } from './virtualLabData';
import './virtual-lab.css';

const isStringArray = (raw: unknown): raw is string[] =>
  Array.isArray(raw) && raw.every((item) => typeof item === 'string');

export const VirtualLab: React.FC = () => {
  const [selectedExpId, setSelectedExpId] = useState('h2o');
  const [temp, setTemp] = useState(298);
  const [press, setPress] = useState(1);
  const [m1, setM1] = useState(5);
  const [m2, setM2] = useState(5);
  const [hasIndicator, setHasIndicator] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [completedExperiments, setCompletedExperiments] = useLocalStorageState<string[]>(
    'virtualLabCompletedExperiments',
    [],
    { validate: isStringArray },
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const experiment = experiments.find((item) => item.id === selectedExpId) ?? experiments[0];
  const riskLevel = getRiskLevel(selectedExpId, temp, press, m1, m2);
  const statusLabel = getProgressLabel(isRunning, completed);

  useEffect(() => {
    setIsRunning(false);
    setProgress(0);
    setCompleted(false);
    setTemp(experiment.defaultTemp);
    setPress(experiment.defaultPress);
    setM1(5);
    setM2(5);
    setHasIndicator(false);
  }, [experiment.defaultPress, experiment.defaultTemp, selectedExpId]);

  useEffect(() => {
    if (!completed) return;
    setCompletedExperiments((items) =>
      items.includes(selectedExpId) ? items : [...items, selectedExpId],
    );
  }, [completed, selectedExpId, setCompletedExperiments]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawVirtualExperiment(canvas, {
      completed,
      experiment,
      hasIndicator,
      isRunning,
      m1,
      m2,
      progress,
      temp,
    });
  }, [completed, experiment, hasIndicator, isRunning, m1, m2, progress, temp]);

  useEffect(() => {
    if (!isRunning) return undefined;
    let frame = 0;
    const start = Date.now();
    const duration = selectedExpId === 'h2o' ? 1000 : 2400;
    const tick = () => {
      const nextProgress = Math.min(1, (Date.now() - start) / duration);
      setProgress(nextProgress);
      if (nextProgress < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      setIsRunning(false);
      setCompleted(true);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isRunning, selectedExpId]);

  const hazards = useMemo(() => {
    const items = [...experiment.hazards];
    if (press >= 3) items.push('Surpression de cuve');
    if (selectedExpId === 'h2o' && temp >= 450) items.push('Auto-allumage thermique');
    if (selectedExpId === 'neutralization' && (m1 >= 15 || m2 >= 15)) {
      items.push('Concentration corrosive elevee');
    }
    return items;
  }, [experiment.hazards, m1, m2, press, selectedExpId, temp]);

  const startExperiment = () => {
    if (isRunning) return;
    setCompleted(false);
    setProgress(0);
    setIsRunning(true);
  };

  return (
    <LabStation
      actions={<Badge tone={completed ? 'success' : 'info'}>{statusLabel}</Badge>}
      eyebrow="Laboratoire guide"
      metrics={[
        { label: 'Station', value: experiment.station, tone: 'info' },
        { label: 'Risque', value: riskLevel, tone: riskLevel === 'Eleve' ? 'error' : 'warning' },
        { label: 'Completes', value: `${completedExperiments.length}/${experiments.length}`, tone: 'success' },
      ]}
      subtitle="Preparer une experience, regler les parametres, observer la reaction et consigner le resultat."
      title="Labo Virtuel"
    >
      <div
        aria-label="Statut du labo virtuel"
        aria-live="polite"
        role="status"
        style={{
          border: 0,
          clip: 'rect(0, 0, 0, 0)',
          height: 1,
          margin: -1,
          overflow: 'hidden',
          padding: 0,
          position: 'absolute',
          whiteSpace: 'nowrap',
          width: 1,
        }}
      >
        {isRunning
          ? `Reaction en cours : ${experiment.name}.`
          : completed
            ? `Experience terminee : ${experiment.name} completee avec succes.`
            : ''}
      </div>

      <div className="lab-layout-grid">
        <div className="lab-station-column">
          <StationPanel eyebrow="Selection" title="Experiences">
            <div className="virtual-exp-list">
              {experiments.map((item) => (
                <button
                  aria-pressed={selectedExpId === item.id}
                  className="virtual-exp-button"
                  key={item.id}
                  onClick={() => setSelectedExpId(item.id)}
                  type="button"
                >
                  <strong>{item.name}</strong>
                  <small>{item.station}</small>
                  {completedExperiments.includes(item.id) && (
                    <Badge tone="success">Completee</Badge>
                  )}
                </button>
              ))}
            </div>
          </StationPanel>

          <StationPanel eyebrow="Parametres" title="Preparation">
            <Slider
              label="Temperature"
              max={800}
              min={100}
              onChange={(event) => setTemp(Number.parseInt(event.target.value, 10))}
              value={temp}
              valueLabel={`${temp} K`}
            />
            <Slider
              label="Pression"
              max={5}
              min={0.1}
              onChange={(event) => setPress(Number.parseFloat(event.target.value))}
              step={0.1}
              value={press}
              valueLabel={`${press.toFixed(1)} atm`}
            />
            <div className="lab-control-grid">
              <Slider
                label="Reactif A"
                max={20}
                min={1}
                onChange={(event) => setM1(Number.parseInt(event.target.value, 10))}
                value={m1}
                valueLabel={`${m1} g`}
              />
              <Slider
                label="Reactif B"
                max={20}
                min={1}
                onChange={(event) => setM2(Number.parseInt(event.target.value, 10))}
                value={m2}
                valueLabel={`${m2} g`}
              />
            </div>
            {selectedExpId === 'neutralization' && (
              <Switch
                checked={hasIndicator}
                label="Ajouter phenolphtaleine"
                onChange={(event) => setHasIndicator(event.target.checked)}
              />
            )}
          </StationPanel>
        </div>

        <div className="lab-station-column">
          <StationPanel
            actions={
              <Button
                disabled={isRunning}
                iconLeft={completed ? <CheckCircle size={16} /> : <Play size={16} />}
                onClick={startExperiment}
              >
                {completed ? "Experience completee" : isRunning ? 'Reaction en cours...' : "Lancer l'experience"}
              </Button>
            }
            eyebrow="Apercu"
            title={experiment.name}
          >
            <p className="virtual-explanation">{experiment.description}</p>
            <div className="lab-canvas-frame">
              <canvas
                aria-label={`${experiment.name}: ${statusLabel}`}
                height={260}
                ref={canvasRef}
                role="img"
                width={320}
              />
            </div>
            <div className="virtual-run-bar">
              <div className="virtual-progress-track" aria-hidden="true">
                <span style={{ width: `${Math.round(progress * 100)}%` }} />
              </div>
              <Badge tone={completed ? 'success' : 'info'}>{Math.round(progress * 100)}%</Badge>
            </div>
          </StationPanel>

          <StationPanel eyebrow="Resultat" title="Observation">
            <div className="lab-readout-grid">
              <LabReadout label="Reactifs" value={experiment.reactants} />
              <LabReadout label="Produit attendu" tone="success" value={experiment.product} />
              <LabReadout label="Etat" tone={completed ? 'success' : 'info'} value={statusLabel} />
            </div>
            <p className="virtual-explanation">{experiment.explanation}</p>
            <Button
              iconLeft={<RotateCcw size={16} />}
              onClick={() => {
                setProgress(0);
                setCompleted(false);
                setIsRunning(false);
              }}
              variant="outline"
            >
              Repreparer
            </Button>
          </StationPanel>
        </div>
      </div>

      <StationPanel eyebrow="Securite" title="Consignes actives">
        <SafetyList items={hazards} />
      </StationPanel>
    </LabStation>
  );
};
