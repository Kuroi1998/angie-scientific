// Quantum Physics Wavefunction calculations

export interface OrbitalDef {
  n: number;
  l: number;
  m: number;
  label: string;
}

export const orbitalList: OrbitalDef[] = [
  { n: 1, l: 0, m: 0, label: "1s" },
  { n: 2, l: 0, m: 0, label: "2s" },
  { n: 2, l: 1, m: 0, label: "2pz" },
  { n: 3, l: 0, m: 0, label: "3s" },
  { n: 3, l: 1, m: 0, label: "3pz" },
  { n: 3, l: 2, m: 0, label: "3dz²" }
];

// Evaluates the wavefunction psi(x, y, z) at a coordinate, scaled by a normalization factor
// We assume z = y and x = x on a 2D slice, evaluating psi(x, y, 0)
export const evaluateWavefunction = (
  n: number,
  l: number,
  _m: number,
  x: number,
  y: number
): number => {
  // Convert to polar coordinates in 2D slice plane
  const r = Math.sqrt(x * x + y * y);
  const theta = Math.atan2(x, y); // angle with vertical axis (z-axis slice representation)

  // Bohr radius scaling constant
  const a0 = 20; // visual scale factor

  const r_scaled = r / a0;

  // Hydrogenic Radial & Angular Wavefunctions (hydrogenic approximations for visual representation)
  if (n === 1 && l === 0) {
    // 1s orbital
    return Math.exp(-r_scaled);
  }
  
  if (n === 2 && l === 0) {
    // 2s orbital
    return (2 - r_scaled) * Math.exp(-r_scaled / 2) * 0.5;
  }
  
  if (n === 2 && l === 1) {
    // 2pz orbital: angular part cos(theta)
    return r_scaled * Math.cos(theta) * Math.exp(-r_scaled / 2) * 0.35;
  }
  
  if (n === 3 && l === 0) {
    // 3s orbital
    return (27 - 18 * r_scaled + 2 * r_scaled * r_scaled) * Math.exp(-r_scaled / 3) * 0.08;
  }
  
  if (n === 3 && l === 1) {
    // 3pz orbital
    return r_scaled * (6 - r_scaled) * Math.cos(theta) * Math.exp(-r_scaled / 3) * 0.08;
  }
  
  if (n === 3 && l === 2) {
    // 3dz² orbital: angular part (3cos²(theta) - 1)
    const angular = 3 * Math.pow(Math.cos(theta), 2) - 1;
    return r_scaled * r_scaled * angular * Math.exp(-r_scaled / 3) * 0.02;
  }

  return 0;
};
