import { useState, useMemo } from 'react';
import type { GasState, GasModelsComparison } from '../types/gas.types';
import { gasDatabase } from '../data/gasDatabase';
import { calculateIdealPressure, calculateIdealVolume, calculateIdealTemperature } from '../services/idealGas.service';
import { calculateVdwPressure, calculateVdwVolume, calculateVdwTemperature } from '../services/vanDerWaals.service';
import { calculateCompressibilityZ, compareGasModels } from '../services/gasValidation.service';

export function useGasState() {
  const [state, setState] = useState<GasState>({
    gasKey: 'co2',
    calculatedVariable: 'pressure',
    pressure: 5,
    volume: 5,
    temperature: 300,
    moles: 1,
    particlesMultiplier: 1,
    simulationSpeed: 1
  });

  const setVariable = (key: keyof GasState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const gas = gasDatabase[state.gasKey];

  const comparison = useMemo<GasModelsComparison>(() => {
    let idealRes, vdwRes, z;

    switch (state.calculatedVariable) {
      case 'pressure':
        idealRes = calculateIdealPressure(state.volume, state.temperature, state.moles);
        vdwRes = calculateVdwPressure(state.volume, state.temperature, state.moles, gas.a, gas.b);
        z = calculateCompressibilityZ(vdwRes.value, state.volume, state.moles, state.temperature);
        break;
      case 'volume':
        idealRes = calculateIdealVolume(state.pressure, state.temperature, state.moles);
        vdwRes = calculateVdwVolume(state.pressure, state.temperature, state.moles, gas.a, gas.b);
        z = calculateCompressibilityZ(state.pressure, vdwRes.value, state.moles, state.temperature);
        break;
      case 'temperature':
        idealRes = calculateIdealTemperature(state.pressure, state.volume, state.moles);
        vdwRes = calculateVdwTemperature(state.pressure, state.volume, state.moles, gas.a, gas.b);
        z = calculateCompressibilityZ(state.pressure, state.volume, state.moles, vdwRes.value);
        break;
      default:
        // By default compute pressure
        idealRes = calculateIdealPressure(state.volume, state.temperature, state.moles);
        vdwRes = calculateVdwPressure(state.volume, state.temperature, state.moles, gas.a, gas.b);
        z = calculateCompressibilityZ(vdwRes.value, state.volume, state.moles, state.temperature);
    }

    return compareGasModels(idealRes, vdwRes, z);
  }, [state.calculatedVariable, state.pressure, state.volume, state.temperature, state.moles, gas]);

  return { state, setVariable, gas, comparison };
}
