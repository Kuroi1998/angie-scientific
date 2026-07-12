import elementsData from './data/elements.json';

export interface ReactionResult {
  reactants: { symbol: string; coef: number; molarMass: number }[];
  products: { symbol: string; name: string; coef: number; molarMass: number }[];
  equationHTML: string;
  dH: number; // kJ per mole of reaction
  dS: number; // J/(mol*K)
  dG: number; // kJ/mol
  stable: boolean;
  type: string; // "exothermic" | "endothermic"
  mechanismFR: string[];
  mechanismES: string[];
  intermediates: string[];
  catalystFR: string;
  catalystES: string;
  cascadeFR: string;
  cascadeES: string;
}

// Database of standard thermodynamic properties (Hf in kJ/mol, S in J/mol*K)
interface ThermoData {
  Hf: number;
  S: number;
}

const thermoDb: Record<string, ThermoData> = {
  // Elements
  "H2": { Hf: 0, S: 130.7 },
  "O2": { Hf: 0, S: 205.2 },
  "N2": { Hf: 0, S: 191.6 },
  "Cl2": { Hf: 0, S: 223.1 },
  "F2": { Hf: 0, S: 202.8 },
  "I2": { Hf: 0, S: 116.1 },
  "Na": { Hf: 0, S: 51.3 },
  "Li": { Hf: 0, S: 29.1 },
  "K": { Hf: 0, S: 64.7 },
  "Mg": { Hf: 0, S: 32.7 },
  "Ca": { Hf: 0, S: 41.5 },
  "Al": { Hf: 0, S: 28.3 },
  "C": { Hf: 0, S: 5.7 },
  "Fe": { Hf: 0, S: 27.3 },
  "Cu": { Hf: 0, S: 33.2 },
  "Zn": { Hf: 0, S: 41.6 },
  "S": { Hf: 0, S: 31.8 },
  
  // Compounds
  "H2O": { Hf: -285.8, S: 70.0 },
  "NaCl": { Hf: -411.2, S: 72.1 },
  "MgO": { Hf: -601.7, S: 26.9 },
  "Al2O3": { Hf: -1675.7, S: 50.9 },
  "CO2": { Hf: -393.5, S: 213.8 },
  "NH3": { Hf: -45.9, S: 192.8 },
  "CaO": { Hf: -635.1, S: 38.2 },
  "CaCl2": { Hf: -795.8, S: 104.6 },
  "FeS": { Hf: -100.0, S: 60.3 },
  "Fe2O3": { Hf: -824.2, S: 87.4 },
  "CuO": { Hf: -157.3, S: 42.6 },
  "ZnS": { Hf: -206.0, S: 57.7 },
  "LiF": { Hf: -616.9, S: 35.7 },
  "KI": { Hf: -327.9, S: 106.4 }
};

// Common valences for prediction
const getValence = (symbol: string, cat: string): number => {
  if (["F", "Cl", "Br", "I"].includes(symbol)) return -1;
  if (["O", "S", "Se"].includes(symbol)) return -2;
  if (["N", "P"].includes(symbol)) return -3;
  if (cat === "alkali-metal" || symbol === "H" || symbol === "Ag") return 1;
  if (cat === "alkaline-earth" || symbol === "Zn" || symbol === "Cu" || symbol === "Hg") return 2;
  if (symbol === "Al" || symbol === "Fe") return 3;
  if (symbol === "C" || symbol === "Si") return 4;
  return 1;
};

// Diatomic check
const isDiatomic = (symbol: string) => {
  return ["H", "N", "O", "F", "Cl", "Br", "I"].includes(symbol);
};

export const predictReaction = (s1: string, s2: string): ReactionResult | null => {
  // Special check for compound water cascade
  if ((s1 === 'Na' && s2 === 'H2O') || (s1 === 'H2O' && s2 === 'Na')) {
    const naEl = elementsData.find(e => e.s === 'Na')!;
    const h2oMolarMass = 18.015;
    const naMolarMass = naEl.mass;
    
    return {
      reactants: [
        { symbol: 'Na', coef: 2, molarMass: naMolarMass },
        { symbol: 'H2O', coef: 2, molarMass: h2oMolarMass }
      ],
      products: [
        { symbol: 'NaOH', name: 'Soude Caustique / Soda Cáustica (NaOH)', coef: 2, molarMass: 39.997 },
        { symbol: 'H2', name: 'Dihydrogène / Dihidrógeno (H₂)', coef: 1, molarMass: 2.016 }
      ],
      equationHTML: "2Na + 2H<sub>2</sub>O ➔ 2NaOH + H<sub>2</sub>",
      dH: -368.6,
      dS: -15.4,
      dG: -364.0,
      stable: true,
      type: "exothermic",
      mechanismFR: [
        "Étape 1 : Le sodium métallique cède ses électrons de valence à l'eau.",
        "Étape 2 : Réduction des protons de l'eau en atomes d'hydrogène radicaux H•.",
        "Étape 3 : Association rapide des radicaux pour dégager du dihydrogène gazeux H₂.",
        "Étape 4 : Les ions hydroxyde OH⁻ formés restent en solution avec les ions Na⁺."
      ],
      mechanismES: [
        "Paso 1: El sodio metálico cede sus electrones de valencia al agua.",
        "Paso 2: Reducción de los protones del agua a átomos de hidrógeno radicales H•.",
        "Paso 3: Asociación rápida de radicales para liberar dihidrógeno gaseoso H•.",
        "Paso 4: Los iones hidróxido OH⁻ formados permanecen en solución con los iones Na⁺."
      ],
      intermediates: ["H•", "Na+", "OH-"],
      catalystFR: "Aucun requis (la réaction est extrêmement exothermique et violente à température ambiante).",
      catalystES: "Ninguno requerido (la reacción es extremadamente exotérmica y violenta a temperatura ambiente).",
      cascadeFR: "L'hydroxyde de sodium (NaOH) produit peut être neutralisé en cascade par un acide fort comme l'acide chlorhydrique (HCl).",
      cascadeES: "El hidróxido de sodio (NaOH) producido puede neutralizarse en cascada con un ácido fuerte como el ácido clocrhídrico (HCl)."
    };
  }

  const el1 = elementsData.find(e => e.s === s1);
  const el2 = elementsData.find(e => e.s === s2);
  
  if (!el1 || !el2) return null;

  // Order reactants: metal/less electronegative first, non-metal second
  const en1 = el1.en || 1.0;
  const en2 = el2.en || 1.0;
  const [r1, r2] = en1 <= en2 ? [el1, el2] : [el2, el1];

  const sym1 = r1.s;
  const sym2 = r2.s;

  let prodSym = "";
  let prodName = "";
  let c1 = 1; // reactant 1 coefficient
  let c2 = 1; // reactant 2 coefficient
  let cp = 1; // product coefficient

  // Enriched details fields
  let mechanismFR: string[] = [];
  let mechanismES: string[] = [];
  let intermediates: string[] = [];
  let catalystFR = "Aucun requis (thermiquement spontané)";
  let catalystES = "Ninguno requerido (térmicamente espontáneo)";
  let cascadeFR = "Aucune réaction en cascade directe identifiée.";
  let cascadeES = "No se identificó ninguna reacción en cascada directa.";

  // Hardcoded standard synthesis reactions
  if (sym1 === "H" && sym2 === "O") {
    prodSym = "H2O";
    prodName = "Eau / Agua (H₂O)";
    c1 = 2; c2 = 1; cp = 2; // 2 H2 + O2 -> 2 H2O
    
    intermediates = ["H•", "O•", "OH•"];
    catalystFR = "Métal de Platine (Pt) comme catalyseur de contact ou allumage électrique (étincelle).";
    catalystES = "Metal de Platino (Pt) como catalizador de contacto o encendido eléctrico (chispa).";
    
    mechanismFR = [
      "Initiation : Clivage homolytique de H₂ sous l'effet de la chaleur ou d'une étincelle pour former des radicaux H•.",
      "Propagation : Le radical H• réagit avec O₂ pour générer les radicaux OH• et O•.",
      "Propagation : Le radical O• réagit avec H₂ pour donner OH• et régénérer H•.",
      "Terminaison : Recombinaison des radicaux H• et OH• pour former de l'eau stable H₂O."
    ];
    mechanismES = [
      "Iniciación: Escisión homolítica de H₂ bajo calor o chispa para formar radicales H•.",
      "Propagación: El radical H• reacciona con O₂ para generar radicales OH• y O•.",
      "Propagación: El radical O• reacciona con H₂ para dar OH• y regenerar H•.",
      "Terminación: Recombinación de los radicales H• y OH• para formar agua estable H₂O."
    ];

    cascadeFR = "L'eau (H₂O) produite peut réagir en cascade avec du Sodium actif pour produire de l'hydroxyde de sodium (NaOH) et dégager du H₂ gazeux.";
    cascadeES = "El agua (H₂O) producida puede reaccionar en cascada con Sodio activo para producir hidróxido de sodio (NaOH) y liberar H₂ gaseoso.";

  } else if (sym1 === "Na" && sym2 === "Cl") {
    prodSym = "NaCl";
    prodName = "Chlorure de Sodium / Cloruro de Sodio (NaCl)";
    c1 = 2; c2 = 1; cp = 2; // 2 Na + Cl2 -> 2 NaCl

    intermediates = ["Na+", "Cl-", "Cl•"];
    catalystFR = "Une goutte d'eau liquide accélère la réaction en dissolvant la couche d'oxyde protectrice sur le Sodium.";
    catalystES = "Una gota de agua líquida acelera la reacción al disolver la capa de óxido protectora en el Sodio.";

    mechanismFR = [
      "Étape 1 : Le sodium solide fond sous l'effet de la chaleur d'initiation et se vaporise partiellement.",
      "Étape 2 : Le dichlore se dissocie en atomes de chlore radicaux Cl•.",
      "Étape 3 : Transfert d'électrons du sodium métallique vers le chlore, produisant les ions Na⁺ et Cl⁻.",
      "Étape 4 : Condensation électrostatique immédiate des ions gazeux pour former la maille cristalline solide NaCl."
    ];
    mechanismES = [
      "Paso 1: El sodio sólido se funde bajo el calor de iniciación y se vaporiza parcialmente.",
      "Paso 2: El dicloro se disocia en átomos de cloro radicales Cl•.",
      "Paso 3: Transferencia de electrones del sodio metálico al cloro, produciendo los iones Na⁺ y Cl⁻.",
      "Paso 4: Condensación electrostática inmediata de los iones gaseosos para formar la red cristalina sólida de NaCl."
    ];

    cascadeFR = "Le chlorure de sodium (NaCl) dissous dans l'eau peut subir une électrolyse (procédé chlore-alcali) pour régénérer Cl₂ et NaOH.";
    cascadeES = "El cloruro de sodio (NaCl) disuelto en agua puede someterse a electrólisis (proceso cloro-álcali) para regenerar Cl₂ y NaOH.";

  } else if (sym1 === "Mg" && sym2 === "O") {
    prodSym = "MgO";
    prodName = "Oxyde de Magnésium / Óxido de Magnesio (MgO)";
    c1 = 2; c2 = 1; cp = 2; // 2 Mg + O2 -> 2 MgO
    intermediates = ["Mg2+", "O2-"];
    mechanismFR = [
      "Étape 1 : Combustion directe. Le magnésium s'enflamme à l'air (source de chaleur).",
      "Étape 2 : Transfert de 2 électrons de valence de Mg vers O, formant Mg²⁺ et O²⁻."
    ];
    mechanismES = [
      "Paso 1: Combustión directa. El magnesio se enciende en el aire (fuente de calor).",
      "Paso 2: Transferencia de 2 electrones de valencia de Mg a O, formando Mg²⁺ y O²⁻."
    ];
  } else if (sym1 === "Al" && sym2 === "O") {
    prodSym = "Al2O3";
    prodName = "Alumine / Alúmina (Al₂O₃)";
    c1 = 4; c2 = 3; cp = 2; // 4 Al + 3 O2 -> 2 Al2O3
    intermediates = ["Al3+", "O2-"];
    mechanismFR = [
      "Étape 1 : Oxydation rapide de surface (passivation).",
      "Étape 2 : Transfert électronique formant des ions Al³⁺ et O²⁻ s'organisant en oxyde amorphe."
    ];
    mechanismES = [
      "Paso 1: Oxidación rápida de superficie (pasivación).",
      "Paso 2: Transferencia electrónica formando iones Al³⁺ y O²⁻ organizándose en óxido amorfo."
    ];
  } else if (sym1 === "C" && sym2 === "O") {
    prodSym = "CO2";
    prodName = "Dioxyde de Carbone / Dióxido de Carbono (CO₂)";
    c1 = 1; c2 = 1; cp = 1; // C + O2 -> CO2
    intermediates = ["CO (intermédiaire mineur)"];
    mechanismFR = [
      "Étape 1 : Oxydation partielle du carbone en monoxyde de carbone (CO).",
      "Étape 2 : Oxydation complète du CO en CO₂ en présence d'excès d'oxygène."
    ];
    mechanismES = [
      "Paso 1: Oxidación parcial del carbono en monóxido de carbono (CO).",
      "Paso 2: Oxidación completa de CO a CO₂ en presencia de exceso de oxígeno."
    ];
  } else if (sym1 === "H" && sym2 === "N") {
    prodSym = "NH3";
    prodName = "Ammoniac / Amoníaco (NH₃)";
    c1 = 3; c2 = 1; cp = 2; // 3 H2 + N2 -> 2 NH3
    intermediates = ["N(ads)", "NH(ads)", "NH2(ads)"];
    catalystFR = "Catalyseur au fer (Fe) promu par K₂O et Al₂O₃, sous 150-250 bar et 400-450°C.";
    catalystES = "Catalizador de hierro (Fe) promovido por K₂O y Al₂O₃, bajo 150-250 bar y 400-450°C.";
    mechanismFR = [
      "Étape 1 : Adsorption dissociative de N₂ et H₂ sur la surface métallique du fer.",
      "Étape 2 : Hydrogénation séquentielle de surface : N(ads) + H(ads) ➔ NH(ads) ➔ NH₂(ads) ➔ NH₃(ads).",
      "Étape 3 : Désorption de l'ammoniac formé dans la phase gazeuse."
    ];
    mechanismES = [
      "Paso 1: Adsorción disociativa de N₂ y H₂ en la superficie metálica del hierro.",
      "Paso 2: Hidrogenación secuencial de superficie: N(ads) + H(ads) ➔ NH(ads) ➔ NH₂(ads) ➔ NH₃(ads).",
      "Paso 3: Desorción del amoníaco formado en la fase gaseosa."
    ];
    cascadeFR = "L'ammoniac (NH₃) peut être oxydé en acide nitrique (HNO₃) via le procédé Ostwald, ou converti en urée.";
    cascadeES = "El amoníaco (NH₃) se puede oxidar a ácido nítrico (HNO₃) a través del proceso Ostwald, o convertir en urea.";
  } else if (sym1 === "Ca" && sym2 === "O") {
    prodSym = "CaO";
    prodName = "Chaux Vive / Cal Viva (CaO)";
    c1 = 2; c2 = 1; cp = 2;
  } else if (sym1 === "Ca" && sym2 === "Cl") {
    prodSym = "CaCl2";
    prodName = "Chlorure de Calcium / Cloruro de Calcio (CaCl₂)";
    c1 = 1; c2 = 1; cp = 1;
  } else if (sym1 === "Fe" && sym2 === "S") {
    prodSym = "FeS";
    prodName = "Sulfure de Fer / Sulfuro de Hierro (FeS)";
    c1 = 1; c2 = 1; cp = 1;
  } else if (sym1 === "Fe" && sym2 === "O") {
    prodSym = "Fe2O3";
    prodName = "Rouille / Óxido de Hierro (Fe₂O₃)";
    c1 = 4; c2 = 3; cp = 2;
  } else if (sym1 === "Cu" && sym2 === "O") {
    prodSym = "CuO";
    prodName = "Oxyde de Cuivre / Óxido de Cobre (CuO)";
    c1 = 2; c2 = 1; cp = 2;
  } else if (sym1 === "S" && sym2 === "Zn") {
    prodSym = "ZnS";
    prodName = "Blende / Blenda (ZnS)";
    c1 = 1; c2 = 1; cp = 1;
  } else if (sym1 === "Li" && sym2 === "F") {
    prodSym = "LiF";
    prodName = "Fluorure de Lithium / Fluoruro de Litio (LiF)";
    c1 = 2; c2 = 1; cp = 2;
  } else if (sym1 === "I" && sym2 === "K") {
    prodSym = "KI";
    prodName = "Iodure de Potassium / Yoduro de Potasio (KI)";
    c1 = 2; c2 = 1; cp = 2;
  } else {
    // 2. Fallback: Algorithmic Ionic synthesis
    const v1 = Math.abs(getValence(sym1, r1.cat));
    const v2 = Math.abs(getValence(sym2, r2.cat));
    
    // Find ratio
    const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
    const common = gcd(v1, v2);
    const sub1 = v2 / common; // Subscript for r1
    const sub2 = v1 / common; // Subscript for r2

    prodSym = `${sym1}${sub1 > 1 ? sub1 : ''}${sym2}${sub2 > 1 ? sub2 : ''}`;
    prodName = `Composé de ${r1.nameFR}-${r2.nameFR} / Compuesto de ${r1.nameES}-${r2.nameES}`;

    // Balance reactants
    const d1 = isDiatomic(sym1);
    const d2 = isDiatomic(sym2);

    let rc1 = sub1;
    let rc2 = sub2;
    let rcp = 1;

    if (d1) {
      rc2 *= 2;
      rcp *= 2;
    } else {
      rc1 *= 2;
    }

    if (d2) {
      rc1 *= 2;
      rcp *= 2;
    } else {
      rc2 *= 2;
    }

    const cd = gcd(gcd(rc1, rc2), rcp);
    c1 = rc1 / cd;
    c2 = rc2 / cd;
    cp = rcp / cd;

    if (d1) c1 = (sub1 * cp) / 2;
    else c1 = sub1 * cp;

    if (d2) c2 = (sub2 * cp) / 2;
    else c2 = sub2 * cp;
  }

  // Populate generic mechanisms if empty
  if (mechanismFR.length === 0) {
    intermediates = [`Ion ${sym1} chargé`, `Ion ${sym2} chargé`];
    mechanismFR = [
      `Étape 1 : Dissociation ou activation thermique des réactifs ${sym1} et ${sym2}.`,
      `Étape 2 : Transfert ou partage électronique favorisé par la différence d'électronégativité.`,
      `Étape 3 : Formation du produit de synthèse stable ${prodSym}.`
    ];
    mechanismES = [
      `Paso 1: Disociación o activación térmica de los reactivos ${sym1} y ${sym2}.`,
      `Paso 2: Transferencia o compartición electrónica favorecida por la diferencia de electronegatividad.`,
      `Paso 3: Formación del producto de síntesis estable ${prodSym}.`
    ];
  }

  // Calculate Molar Masses
  const mm1 = isDiatomic(sym1) ? r1.mass * 2 : r1.mass;
  const mm2 = isDiatomic(sym2) ? r2.mass * 2 : r2.mass;
  const mmp = (r1.mass * (c1 * (isDiatomic(sym1) ? 2 : 1))) / cp + (r2.mass * (c2 * (isDiatomic(sym2) ? 2 : 1))) / cp;

  // HTML Representation of reactants
  const labelR1 = `${c1 > 1 ? c1 : ''}${sym1}${isDiatomic(sym1) ? '<sub>2</sub>' : ''}`;
  const labelR2 = `${c2 > 1 ? c2 : ''}${sym2}${isDiatomic(sym2) ? '<sub>2</sub>' : ''}`;
  
  // Format product subscripts
  const formattedProductHTML = prodSym.replace(/([A-Z][a-z]?|H)(\d+)/g, '$1<sub>$2</sub>');
  const labelProd = `${cp > 1 ? cp : ''}${formattedProductHTML}`;
  const equationHTML = `${labelR1} + ${labelR2} ➔ ${labelProd}`;

  // 3. Thermodynamic Enthalpy and Free Energy calculations
  let dH = 0;
  let dS = 0;
  let dG = 0;

  const keyR1 = `${sym1}${isDiatomic(sym1) ? '2' : ''}`;
  const keyR2 = `${sym2}${isDiatomic(sym2) ? '2' : ''}`;

  const tR1 = thermoDb[keyR1] || { Hf: 0, S: 100 };
  const tR2 = thermoDb[keyR2] || { Hf: 0, S: 100 };
  const tP = thermoDb[prodSym];

  if (tP) {
    dH = (cp * tP.Hf) - (c1 * tR1.Hf + c2 * tR2.Hf);
    dS = (cp * tP.S) - (c1 * tR1.S + c2 * tR2.S);
    dG = dH - (298.15 * dS) / 1000;
  } else {
    const electronegDiff = Math.abs(en1 - en2);
    const estimatedHf = -96.48 * Math.pow(electronegDiff, 2);
    const stateDecrease = (r1.state === 'gas' ? 100 : 0) + (r2.state === 'gas' ? 100 : 0);
    const estimatedDS = -120 - stateDecrease;

    dH = estimatedHf * cp;
    dS = estimatedDS * cp;
    dG = dH - (298.15 * dS) / 1000;
  }

  const stable = dG < 0;
  const type = dH < 0 ? 'exothermic' : 'endothermic';

  return {
    reactants: [
      { symbol: sym1 + (isDiatomic(sym1) ? '2' : ''), coef: c1, molarMass: mm1 },
      { symbol: sym2 + (isDiatomic(sym2) ? '2' : ''), coef: c2, molarMass: mm2 }
    ],
    products: [
      { symbol: prodSym, name: prodName, coef: cp, molarMass: mmp }
    ],
    equationHTML,
    dH: Math.round(dH * 10) / 10,
    dS: Math.round(dS * 10) / 10,
    dG: Math.round(dG * 10) / 10,
    stable,
    type,
    mechanismFR,
    mechanismES,
    intermediates,
    catalystFR,
    catalystES,
    cascadeFR,
    cascadeES
  };
};
