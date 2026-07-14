export interface EmissionLine {
  wl: number; // Wavelength in nm
  color: string; // Hex or rgb
  intensity?: number; // 0 to 1 for glow intensity
}

export interface EmissionElement {
  id: string;
  name: string;
  symbol: string;
  lines: EmissionLine[];
  description?: string;
}

export interface AbsorptionDip {
  wavenumber: number; // cm^-1
  transmittance: number; // 0 to 1, where 0 is full absorption (deep dip)
  width: number; // width of the peak
  vibrationType: string; // e.g. "Élongation asymétrique"
}

export interface AbsorptionMolecule {
  id: string;
  name: string;
  formula: string;
  dips: AbsorptionDip[];
  description?: string;
}

export type SpectroscopyMode = 'EMISSION' | 'ABSORPTION';

export interface PhotonProperties {
  wavelength: number; // nm
  frequency: number; // Hz
  energyJoules: number; // J
  energyEV: number; // eV
  colorHex: string; // Calculated color representation
}
