export interface VirtualExperiment {
  defaultPress: number;
  defaultTemp: number;
  description: string;
  explanation: string;
  hazards: string[];
  id: string;
  name: string;
  product: string;
  reactants: string;
  station: string;
}

export const experiments: VirtualExperiment[] = [
  {
    id: 'h2o',
    name: "Synthese de l'eau",
    station: 'Reaction spectaculaire',
    description: 'Combustion de dihydrogene et dioxygene initiee par etincelle.',
    reactants: 'H2 (gaz) + O2 (gaz)',
    product: 'H2O',
    defaultTemp: 298,
    defaultPress: 1,
    hazards: [
      "Risque d'explosion",
      'Gaz hautement inflammables',
      'Degagement de chaleur intense',
    ],
    explanation: 'La liaison O-H libere assez d energie pour rendre la synthese fortement exothermique.',
  },
  {
    id: 'nacl',
    name: 'Sodium dans le chlore',
    station: 'Reaction spectaculaire',
    description: 'Le sodium metallique brule dans le chlore pour former un cristal ionique.',
    reactants: 'Na (solide) + Cl2 (gaz)',
    product: 'NaCl',
    defaultTemp: 300,
    defaultPress: 1.2,
    hazards: ['Chlore toxique', 'Sodium reactif a l eau', 'Flamme tres lumineuse'],
    explanation: 'Le transfert electronique Na vers Cl forme un reseau stable de chlorure de sodium.',
  },
  {
    id: 'neutralization',
    name: 'Titrage acide-base',
    station: 'Cuisine moleculaire',
    description: 'Neutralisation HCl / NaOH avec virage de phenolphtaleine.',
    reactants: 'HCl (acide) + NaOH (base)',
    product: 'NaCl + H2O',
    defaultTemp: 298,
    defaultPress: 1,
    hazards: ['Solutions corrosives', 'Reaction exothermique moderee'],
    explanation: 'Les ions H+ et OH- forment de l eau pendant que Na+ et Cl- restent en solution.',
  },
];

export function getRiskLevel(experimentId: string, temp: number, press: number, m1: number, m2: number) {
  if (press >= 3 || (experimentId === 'h2o' && temp >= 450)) return 'Eleve';
  if (experimentId === 'neutralization' && (m1 >= 15 || m2 >= 15)) return 'Moyen';
  if (experimentId === 'nacl') return 'Eleve';
  return 'Controle';
}

export function getProgressLabel(isRunning: boolean, completed: boolean) {
  if (isRunning) return 'Reaction en cours';
  if (completed) return 'Experience completee';
  return 'Prete';
}

