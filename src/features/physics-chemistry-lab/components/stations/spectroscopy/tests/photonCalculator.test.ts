import { describe, it, expect } from 'vitest';
import { calculatePhotonProperties, CONSTANTS, wavenumberToWavelengthNm } from '../services/photonCalculator.service';

describe('Photon Calculator Service', () => {
  it('calculates correct properties for H-alpha line (656.3 nm)', () => {
    const props = calculatePhotonProperties(656.3);
    
    const expectedFrequency = CONSTANTS.c / (656.3e-9);
    expect(props.frequency).toBeCloseTo(expectedFrequency, -6);
    
    // Energy in eV should be ~1.89 eV
    expect(props.energyEV).toBeCloseTo(1.889, 2);
  });

  it('converts wavenumber to wavelength correctly', () => {
    // 4000 cm-1 should be 2500 nm
    expect(wavenumberToWavelengthNm(4000)).toBeCloseTo(2500, 1);
    
    // 1000 cm-1 should be 10000 nm
    expect(wavenumberToWavelengthNm(1000)).toBeCloseTo(10000, 1);
  });
});
