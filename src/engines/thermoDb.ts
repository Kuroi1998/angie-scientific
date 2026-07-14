interface ThermoData {
  Hf: number;
  S: number;
}

export const thermoDb: Record<string, ThermoData> = {
  H2: { Hf: 0, S: 130.7 },
  O2: { Hf: 0, S: 205.2 },
  N2: { Hf: 0, S: 191.6 },
  Cl2: { Hf: 0, S: 223.1 },
  F2: { Hf: 0, S: 202.8 },
  I2: { Hf: 0, S: 116.1 },
  Na: { Hf: 0, S: 51.3 },
  Li: { Hf: 0, S: 29.1 },
  K: { Hf: 0, S: 64.7 },
  Mg: { Hf: 0, S: 32.7 },
  Ca: { Hf: 0, S: 41.5 },
  Al: { Hf: 0, S: 28.3 },
  C: { Hf: 0, S: 5.7 },
  Fe: { Hf: 0, S: 27.3 },
  Cu: { Hf: 0, S: 33.2 },
  Zn: { Hf: 0, S: 41.6 },
  S: { Hf: 0, S: 31.8 },
  H2O: { Hf: -285.8, S: 70.0 },
  NaCl: { Hf: -411.2, S: 72.1 },
  MgO: { Hf: -601.7, S: 26.9 },
  Al2O3: { Hf: -1675.7, S: 50.9 },
  CO2: { Hf: -393.5, S: 213.8 },
  NH3: { Hf: -45.9, S: 192.8 },
  CaO: { Hf: -635.1, S: 38.2 },
  CaCl2: { Hf: -795.8, S: 104.6 },
  FeS: { Hf: -100.0, S: 60.3 },
  Fe2O3: { Hf: -824.2, S: 87.4 },
  CuO: { Hf: -157.3, S: 42.6 },
  ZnS: { Hf: -206.0, S: 57.7 },
  LiF: { Hf: -616.9, S: 35.7 },
  KI: { Hf: -327.9, S: 106.4 }
};
