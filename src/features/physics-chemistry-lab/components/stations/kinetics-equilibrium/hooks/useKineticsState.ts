import { useState, useEffect, useRef } from 'react';
import type { KineticsState, ConcentrationPoint } from '../types/kinetics.types';
import { reactionDatabase } from '../data/reactionDatabase';
import { calculateKinetics } from '../services/kineticsCalculator.service';
import { advanceSimulationStep } from '../services/kineticsSimulation.service';

export function useKineticsState() {
  const [state, setState] = useState<KineticsState>({
    reactionId: 'synthesis',
    temperature: 300,
    concA: 2.0,
    concB: 2.0,
    concC: 0.0,
    concD: 0.0,
    catalystEaReduction: 0,
    isPaused: false,
    simulationSpeed: 1
  });

  const [history, setHistory] = useState<ConcentrationPoint[]>([]);
  const timeRef = useRef(0);

  const setVariable = (key: keyof KineticsState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const reaction = reactionDatabase[state.reactionId];
  
  const result = calculateKinetics(state);

  // Handle reaction change: reset history and time
  useEffect(() => {
    timeRef.current = 0;
    setHistory([{ time: 0, a: state.concA, b: state.concB, c: state.concC, d: state.concD }]);
    // We intentionally don't add concA/B/C/D to dependencies to only reset on reaction ID change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.reactionId]);

  // Simulation Loop
  useEffect(() => {
    if (state.isPaused) return;

    const intervalId = setInterval(() => {
      setState(current => {
        const currentResult = calculateKinetics(current);
        const dt = 0.05 * current.simulationSpeed; // base time step
        
        const nextConcs = advanceSimulationStep(current, currentResult, dt, reaction.type);
        timeRef.current += dt;

        setHistory(prev => {
          const newPoint = { 
            time: timeRef.current, 
            a: nextConcs.concA ?? 0, 
            b: nextConcs.concB ?? 0, 
            c: nextConcs.concC ?? 0, 
            d: nextConcs.concD ?? 0 
          };
          const nextHist = [...prev, newPoint];
          // Keep max 200 points to avoid memory issues and keep chart rendering fast
          if (nextHist.length > 200) nextHist.shift();
          return nextHist;
        });

        return { ...current, ...nextConcs };
      });
    }, 50);

    return () => clearInterval(intervalId);
  }, [state.isPaused, reaction.type]);

  const resetSimulation = () => {
    timeRef.current = 0;
    setState(prev => ({
      ...prev,
      concA: 2.0,
      concB: 2.0,
      concC: 0.0,
      concD: 0.0,
      isPaused: false,
      catalystEaReduction: 0
    }));
    setHistory([{ time: 0, a: 2.0, b: 2.0, c: 0.0, d: 0.0 }]);
  };

  const injectReactants = () => {
    setState(prev => ({
      ...prev,
      concA: prev.concA + 1.0,
      concB: reaction.type !== 'A_TO_B' ? prev.concB + 1.0 : prev.concB
    }));
  };

  return { state, setVariable, reaction, result, history, resetSimulation, injectReactants };
}
