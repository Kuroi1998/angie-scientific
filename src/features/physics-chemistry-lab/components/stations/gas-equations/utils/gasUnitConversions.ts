export const R_L_BAR = 0.08314; // L·bar/(mol·K)
export const R_JOULE = 8.314; // J/(mol·K) or (Pa·m³)/(mol·K)

export function celsiusToKelvin(c: number): number {
  return c + 273.15;
}

export function kelvinToCelsius(k: number): number {
  return k - 273.15;
}

export function barToPa(bar: number): number {
  return bar * 1e5;
}

export function paToBar(pa: number): number {
  return pa / 1e5;
}

export function litersToCubicMeters(l: number): number {
  return l / 1000;
}

export function cubicMetersToLiters(m3: number): number {
  return m3 * 1000;
}

export function formatScientific(value: number, decimals: number = 2): string {
  if (value === 0) return '0';
  const absValue = Math.abs(value);
  if (absValue < 1e-3 || absValue > 1e4) {
    return value.toExponential(decimals).replace('e', ' × 10^');
  }
  return value.toFixed(decimals);
}
