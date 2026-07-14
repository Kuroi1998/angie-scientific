import { useState, useMemo } from 'react';
import { substancesDatabase } from '../data/substancesDatabase';
import { determinePhase } from '../services/phaseCalculator.service';

export function usePhaseState() {
  const [substanceId, setSubstanceId] = useState('water');
  
  // Need to hold temp and pressure. On substance change, reset to standard condition or triple point
  const [temperature, setTemperature] = useState(298.15); // 25 C
  const [pressure, setPressure] = useState(1.013); // 1 atm

  const substance = substancesDatabase[substanceId];

  // If substance changes, put it at a recognizable point (like 1 atm and 25C or triple point if those are out of bounds)
  const changeSubstance = (id: string) => {
    const newSub = substancesDatabase[id];
    setSubstanceId(id);
    
    // Attempt standard conditions, if out of bounds, use middle of bounds
    const stdT = 298.15;
    const stdP = 1.013;
    
    if (stdT >= newSub.minT && stdT <= newSub.maxT && stdP >= newSub.minP && stdP <= newSub.maxP) {
      setTemperature(stdT);
      setPressure(stdP);
    } else {
      setTemperature(newSub.tripleT + 10);
      setPressure(newSub.tripleP + 1);
    }
  };

  const phase = useMemo(() => {
    return determinePhase(temperature, pressure, substance);
  }, [temperature, pressure, substance]);

  return {
    substanceId,
    substance,
    temperature,
    pressure,
    phase,
    changeSubstance,
    setTemperature,
    setPressure
  };
}
