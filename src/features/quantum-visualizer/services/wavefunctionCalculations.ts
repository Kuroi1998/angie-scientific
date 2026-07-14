export interface OrbitalDef {
  n: number;
  l: number;
  m: number;
  label: string;
}

export const orbitalList: OrbitalDef[] = [
  { n: 1, l: 0, m: 0, label: "1s" },
  { n: 2, l: 0, m: 0, label: "2s" },
  { n: 2, l: 1, m: -1, label: "2py" },
  { n: 2, l: 1, m: 0, label: "2pz" },
  { n: 2, l: 1, m: 1, label: "2px" },
  { n: 3, l: 0, m: 0, label: "3s" },
  { n: 3, l: 1, m: 0, label: "3pz" },
  { n: 3, l: 2, m: 0, label: "3dz²" }
];

export const evaluateWavefunction = (
  n: number,
  l: number,
  m: number,
  x: number,
  y: number,
  z: number = 0
): number => {
  const r = Math.sqrt(x * x + y * y + z * z);
  if (r === 0) return (n === 1 && l === 0) ? 1 : 0; // Singularities
  
  // Angle with z-axis
  const theta = Math.acos(z / r); 
  // Angle in xy-plane
  const phi = Math.atan2(y, x);
  
  const a0 = 20; // Scale factor
  const r_scaled = r / a0;

  // 1s
  if (n === 1 && l === 0) return Math.exp(-r_scaled);
  
  // 2s
  if (n === 2 && l === 0) return (2 - r_scaled) * Math.exp(-r_scaled / 2) * 0.5;
  
  // 2p
  if (n === 2 && l === 1) {
    const r_part = r_scaled * Math.exp(-r_scaled / 2);
    if (m === 0) return r_part * Math.cos(theta) * 0.35; // 2pz
    if (m === 1) return r_part * Math.sin(theta) * Math.cos(phi) * 0.35; // 2px
    if (m === -1) return r_part * Math.sin(theta) * Math.sin(phi) * 0.35; // 2py
  }
  
  // 3s
  if (n === 3 && l === 0) {
    return (27 - 18 * r_scaled + 2 * r_scaled * r_scaled) * Math.exp(-r_scaled / 3) * 0.08;
  }
  
  // 3p
  if (n === 3 && l === 1) {
    const r_part = r_scaled * (6 - r_scaled) * Math.exp(-r_scaled / 3);
    if (m === 0) return r_part * Math.cos(theta) * 0.08; // 3pz
    if (m === 1) return r_part * Math.sin(theta) * Math.cos(phi) * 0.08; // 3px
    if (m === -1) return r_part * Math.sin(theta) * Math.sin(phi) * 0.08; // 3py
  }
  
  // 3d
  if (n === 3 && l === 2) {
    const r_part = r_scaled * r_scaled * Math.exp(-r_scaled / 3);
    if (m === 0) {
      const angular = 3 * Math.cos(theta) * Math.cos(theta) - 1;
      return r_part * angular * 0.02; // 3dz2
    }
    // Simplification for other 3d orbitals 
    if (m === 1) return r_part * Math.sin(theta) * Math.cos(theta) * Math.cos(phi) * 0.04; // 3dxz
    if (m === -1) return r_part * Math.sin(theta) * Math.cos(theta) * Math.sin(phi) * 0.04; // 3dyz
    if (m === 2) return r_part * Math.sin(theta) * Math.sin(theta) * Math.cos(2*phi) * 0.02; // 3dx2-y2
    if (m === -2) return r_part * Math.sin(theta) * Math.sin(theta) * Math.sin(2*phi) * 0.02; // 3dxy
  }

  return 0;
};

export const getFormulaText = (n: number, l: number, m: number): string => {
  if (n === 1 && l === 0) return 'Ψ(r) ∝ e^(-r/a₀)';
  if (n === 2 && l === 0) return 'Ψ(r) ∝ (2 - r/a₀) · e^(-r/2a₀)';
  if (n === 2 && l === 1 && m === 0) return 'Ψ(r, θ) ∝ (r/a₀) · cos(θ) · e^(-r/2a₀)';
  if (n === 2 && l === 1 && m === 1) return 'Ψ(r, θ, φ) ∝ (r/a₀) · sin(θ)cos(φ) · e^(-r/2a₀)';
  if (n === 2 && l === 1 && m === -1) return 'Ψ(r, θ, φ) ∝ (r/a₀) · sin(θ)sin(φ) · e^(-r/2a₀)';
  if (n === 3 && l === 0) return 'Ψ(r) ∝ (27 - 18r/a₀ + 2r²/a₀²) · e^(-r/3a₀)';
  if (n === 3 && l === 1 && m === 0) return 'Ψ(r, θ) ∝ r(6 - r/a₀) · cos(θ) · e^(-r/3a₀)';
  if (n === 3 && l === 2 && m === 0) return 'Ψ(r, θ) ∝ r²(3cos²(θ) - 1) · e^(-r/3a₀)';
  
  return 'Ψ(r, θ, φ)';
};
