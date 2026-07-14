import type { PhotonProperties } from '../types/spectroscopy.types';

export const CONSTANTS = {
  h: 6.62607015e-34, // J.s (Planck)
  c: 299792458,      // m/s (Speed of light)
  eV: 1.602176634e-19 // J per eV
};

// Converts wavelength (nm) to RGB color
export const wavelengthToRgbHex = (wl: number): string => {
  let r = 0;
  let g = 0;
  let b = 0;

  if (wl >= 380 && wl < 440) {
    r = -((wl - 440) / (440 - 380));
    b = 1;
  } else if (wl >= 440 && wl < 490) {
    g = (wl - 440) / (490 - 440);
    b = 1;
  } else if (wl >= 490 && wl < 510) {
    g = 1;
    b = -((wl - 510) / (510 - 490));
  } else if (wl >= 510 && wl < 580) {
    r = (wl - 510) / (580 - 510);
    g = 1;
  } else if (wl >= 580 && wl < 645) {
    r = 1;
    g = -((wl - 645) / (645 - 580));
  } else if (wl >= 645 && wl <= 780) {
    r = 1;
  }

  let factor = 1;
  if (wl >= 380 && wl < 420) {
    factor = 0.3 + 0.7 * (wl - 380) / (420 - 380);
  } else if (wl > 700 && wl <= 780) {
    factor = 0.3 + 0.7 * (780 - wl) / (780 - 700);
  }

  const toHex = (c: number) => {
    const val = Math.max(0, Math.min(255, Math.round(c * factor * 255)));
    const hex = val.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const calculatePhotonProperties = (wavelengthNm: number): PhotonProperties => {
  const wlMeters = wavelengthNm * 1e-9;
  const frequency = CONSTANTS.c / wlMeters;
  const energyJoules = CONSTANTS.h * frequency;
  const energyEV = energyJoules / CONSTANTS.eV;
  const colorHex = wavelengthToRgbHex(wavelengthNm);

  return {
    wavelength: wavelengthNm,
    frequency,
    energyJoules,
    energyEV,
    colorHex
  };
};

export const wavenumberToWavelengthNm = (wavenumberCm1: number): number => {
  // wavenumber = 1 / wavelength (in cm)
  // 1 cm = 10^7 nm
  if (wavenumberCm1 === 0) return 0;
  return 1e7 / wavenumberCm1;
};
