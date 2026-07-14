import { useState, useMemo } from 'react';
import type { SpectroscopyMode, PhotonProperties } from '../types/spectroscopy.types';
import { calculatePhotonProperties, wavenumberToWavelengthNm } from '../services/photonCalculator.service';

export function useSpectroscopyState() {
  const [mode, setMode] = useState<SpectroscopyMode>('EMISSION');
  
  const [emissionId, setEmissionId] = useState('h');
  const [absorptionId, setAbsorptionId] = useState('h2o');

  // Currently hovered wavelength in nm (for emission) or wavenumber in cm-1 (for absorption)
  const [hoveredX, setHoveredX] = useState<number | null>(null);

  const photonInfo: PhotonProperties | null = useMemo(() => {
    if (hoveredX === null) return null;
    
    let wavelengthNm = hoveredX;
    if (mode === 'ABSORPTION') {
      wavelengthNm = wavenumberToWavelengthNm(hoveredX);
    }
    
    return calculatePhotonProperties(wavelengthNm);
  }, [hoveredX, mode]);

  return {
    mode, setMode,
    emissionId, setEmissionId,
    absorptionId, setAbsorptionId,
    hoveredX, setHoveredX,
    photonInfo
  };
}
