import { useState, useMemo } from 'react';
import { orbitalList } from '../services/wavefunctionCalculations';

export interface QuantumState {
  n: number;
  l: number;
  m: number;
}

export const useQuantumState = () => {
  const [state, setState] = useState<QuantumState>({ n: 2, l: 1, m: 0 }); // Default 2pz
  const [viewMode, setViewMode] = useState<'heatmap' | 'density' | 'phase'>('heatmap');
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<{x: number, y: number}>({ x: 0, y: 0 });

  const currentOrbitalDef = useMemo(() => {
    return orbitalList.find(o => o.n === state.n && o.l === state.l && o.m === state.m) || 
      { n: state.n, l: state.l, m: state.m, label: `${state.n}${getLChar(state.l)}` };
  }, [state]);

  const updateQuantumNumbers = (n: number, l: number, m: number) => {
    // Validate physical constraints
    const validN = Math.max(1, Math.min(n, 7));
    const validL = Math.max(0, Math.min(l, validN - 1));
    const validM = Math.max(-validL, Math.min(m, validL));
    
    setState({ n: validN, l: validL, m: validM });
  };

  const resetCamera = () => {
    setZoom(1);
    setRotation({ x: 0, y: 0 });
  };

  return {
    state,
    currentOrbitalDef,
    viewMode,
    zoom,
    rotation,
    updateQuantumNumbers,
    setViewMode,
    setZoom,
    setRotation,
    resetCamera
  };
};

function getLChar(l: number): string {
  if (l === 0) return 's';
  if (l === 1) return 'p';
  if (l === 2) return 'd';
  if (l === 3) return 'f';
  return 'g';
}
