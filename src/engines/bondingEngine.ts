import elementsData from './data/elements.json';

export interface VseprResult {
  stericNumber: number;
  lonePairs: number;
  geometryFR: string;
  geometryES: string;
  bondAngle: string;
  hybridization: string;
}

export interface BondDetails {
  typeFR: string;
  typeES: string;
  energy: number; // kJ/mol
  length: number; // pm
  polarityDiff: number;
  characterFR: string;
  characterES: string;
}

const elementsMap = new Map(elementsData.map(e => [e.s, e]));

// Standard bond energies database (in kJ/mol)
const BOND_ENERGIES: Record<string, number> = {
  'H-H': 436, 'H-O': 463, 'H-N': 391, 'H-C': 413, 'H-F': 565, 'H-Cl': 431, 'H-Br': 366, 'H-I': 299,
  'C-C': 347, 'C=C': 614, 'C≡C': 839, 'C-O': 358, 'C=O': 745, 'C-N': 305, 'C=N': 615, 'C≡N': 891,
  'O-O': 146, 'O=O': 495, 'N-N': 160, 'N=N': 418, 'N≡N': 941, 'F-F': 159, 'Cl-Cl': 242, 'Br-Br': 193,
  'I-I': 151, 'Na-Cl': 410, 'K-Cl': 427, 'Li-F': 577, 'Mg-O': 362, 'Ca-O': 464
};

export const getBondDetails = (sym1: string, sym2: string): BondDetails => {
  const el1 = elementsMap.get(sym1);
  const el2 = elementsMap.get(sym2);

  if (!el1 || !el2) {
    return {
      typeFR: 'Inconnu',
      typeES: 'Desconocido',
      energy: 250,
      length: 150,
      polarityDiff: 0,
      characterFR: 'Liaison indéterminée',
      characterES: 'Enlace indeterminado'
    };
  }

  const en1 = el1.en || 1.0;
  const en2 = el2.en || 1.0;
  const diff = Math.abs(en1 - en2);

  // Determine bond length based on covalent radii (in pm)
  // Approximate covalent radius: r = 30 * (atomicNumber^0.25) or hardcode averages
  const r1 = el1.n === 1 ? 37 : 30 + 15 * Math.log2(el1.n);
  const r2 = el2.n === 1 ? 37 : 30 + 15 * Math.log2(el2.n);
  const estLength = Math.round(r1 + r2);

  // Find bond energy
  const key1 = `${sym1}-${sym2}`;
  const key2 = `${sym2}-${sym1}`;
  let energy = BOND_ENERGIES[key1] || BOND_ENERGIES[key2];

  if (!energy) {
    // Dynamic estimation based on Pauling's formula: D(A-B) = (D(A-A) + D(B-B))/2 + 96.48 * (enA - enB)^2
    const self1 = BOND_ENERGIES[`${sym1}-${sym1}`] || 200;
    const self2 = BOND_ENERGIES[`${sym2}-${sym2}`] || 200;
    energy = Math.round((self1 + self2) / 2 + 96.48 * diff * diff);
  }

  // Determine bond character and type
  let typeFR = 'Covalente';
  let typeES = 'Covalente';
  let charFR = 'Partage d\'électrons covalent standard';
  let charES = 'Compartición de electrones covalente estándar';

  if (diff >= 1.7) {
    typeFR = 'Ionique';
    typeES = 'Iónico';
    charFR = 'Attraction électrostatique forte (transfert d\'électrons)';
    charES = 'Atracción electrostática fuerte (transferencia de electrones)';
  } else if (diff >= 0.4) {
    typeFR = 'Covalente Polaire';
    typeES = 'Covalente Polar';
    charFR = 'Partage inégal d\'électrons induisant un dipôle moléculaire';
    charES = 'Compartición desigual de electrones que induce un dipolo molecular';
  } else {
    typeFR = 'Covalente Non Polaire';
    typeES = 'Covalente No Polar';
    charFR = 'Partage symétrique des électrons de valence';
    charES = 'Compartición simétrica de electrones de valencia';
  }

  return {
    typeFR,
    typeES,
    energy,
    length: estLength,
    polarityDiff: parseFloat(diff.toFixed(2)),
    characterFR: charFR,
    characterES: charES
  };
};

export const predictVsepr = (centralSym: string, ligandSym: string, count: number): VseprResult => {
  const central = elementsMap.get(centralSym);
  const ligand = elementsMap.get(centralSym === 'O' && centralSym === ligandSym ? 'H' : ligandSym);

  if (!central) {
    return {
      stericNumber: 4,
      lonePairs: 0,
      geometryFR: 'Tétraédrique',
      geometryES: 'Tetraédrica',
      bondAngle: '109.5°',
      hybridization: 'sp³'
    };
  }

  // Determine valence electrons of central atom
  // Using elements' valence or fallback
  let V = 4; // default
  const centralG = (central as any).g;
  if (centralG === 1) V = 1;
  else if (centralG === 2) V = 2;
  else if (centralG === 13) V = 3;
  else if (centralG === 14) V = 4;
  else if (centralG === 15) V = 5;
  else if (centralG === 16) V = 6;
  else if (centralG === 17) V = 7;
  else if (centralG === 18) V = 8;
  else if (central.n === 8) V = 6; // Oxygen
  else if (central.n === 7) V = 5; // Nitrogen
  else if (central.n === 6) V = 4; // Carbon

  // Differentiate monovalent (H, halogens) from divalent (O, S) or trivalent ligands
  let isDivalent = false;
  if (ligand) {
    isDivalent = ((ligand as any).g === 16 || ligand.n === 8 || ligand.n === 16);
  }

  // Total bonding pairs
  const B = count;

  // Lone pairs formula:
  // For divalent ligands, they share 2 electrons, making double bonds, so they consume 2 valence electrons each
  const valenceUsed = isDivalent ? B * 2 : B * 1;
  const LP = Math.max(0, Math.round((V - valenceUsed) / 2));
  const SN = B + LP;

  let geometryFR = 'Linéaire';
  let geometryES = 'Lineal';
  let bondAngle = '180°';

  if (SN === 2) {
    geometryFR = 'Linéaire';
    geometryES = 'Lineal';
    bondAngle = '180°';
  } else if (SN === 3) {
    if (LP === 0) {
      geometryFR = 'Trigonale Planaire';
      geometryES = 'Trigonal Plana';
      bondAngle = '120°';
    } else {
      geometryFR = 'Coudée';
      geometryES = 'Angulada';
      bondAngle = '< 120°';
    }
  } else if (SN === 4) {
    if (LP === 0) {
      geometryFR = 'Tétraédrique';
      geometryES = 'Tetraédrica';
      bondAngle = '109.5°';
    } else if (LP === 1) {
      geometryFR = 'Pyramidale Trigonale';
      geometryES = 'Piramidal Trigonal';
      bondAngle = '107°';
    } else {
      geometryFR = 'Coudée';
      geometryES = 'Angulada';
      bondAngle = '104.5°';
    }
  } else if (SN === 5) {
    if (LP === 0) {
      geometryFR = 'Bipyramidale Trigonale';
      geometryES = 'Bipiramidal Trigonal';
      bondAngle = '90°, 120°';
    } else if (LP === 1) {
      geometryFR = 'Balançoire';
      geometryES = 'Balancín';
      bondAngle = '90°, 120°';
    } else if (LP === 2) {
      geometryFR = 'En T';
      geometryES = 'En T';
      bondAngle = '90°';
    } else {
      geometryFR = 'Linéaire';
      geometryES = 'Lineal';
      bondAngle = '180°';
    }
  } else if (SN >= 6) {
    if (LP === 0) {
      geometryFR = 'Octaédrique';
      geometryES = 'Octaédrica';
      bondAngle = '90°';
    } else if (LP === 1) {
      geometryFR = 'Pyramidale Carrée';
      geometryES = 'Piramidal Cuadrada';
      bondAngle = '90°';
    } else {
      geometryFR = 'Plan Carré';
      geometryES = 'Plana Cuadrada';
      bondAngle = '90°';
    }
  }

  // Hybridization
  let hybridization = 'sp';
  if (SN === 3) hybridization = 'sp²';
  else if (SN === 4) hybridization = 'sp³';
  else if (SN === 5) hybridization = 'sp³d';
  else if (SN >= 6) hybridization = 'sp³d²';

  return {
    stericNumber: SN,
    lonePairs: LP,
    geometryFR,
    geometryES,
    bondAngle,
    hybridization
  };
};
