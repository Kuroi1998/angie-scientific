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

export const getExperiments = (t: (k: string) => string): VirtualExperiment[] => [
  {
    id: 'h2o',
    name: t('virtualLab.exp.h2o.name'),
    station: t('virtualLab.exp.h2o.station'),
    description: t('virtualLab.exp.h2o.description'),
    reactants: t('virtualLab.exp.h2o.reactants'),
    product: 'H2O',
    defaultTemp: 298,
    defaultPress: 1,
    hazards: [
      t('virtualLab.exp.h2o.hazard1'),
      t('virtualLab.exp.h2o.hazard2'),
      t('virtualLab.exp.h2o.hazard3'),
    ],
    explanation: t('virtualLab.exp.h2o.explanation'),
  },
  {
    id: 'nacl',
    name: t('virtualLab.exp.nacl.name'),
    station: t('virtualLab.exp.nacl.station'),
    description: t('virtualLab.exp.nacl.description'),
    reactants: t('virtualLab.exp.nacl.reactants'),
    product: 'NaCl',
    defaultTemp: 300,
    defaultPress: 1.2,
    hazards: [
      t('virtualLab.exp.nacl.hazard1'),
      t('virtualLab.exp.nacl.hazard2'),
      t('virtualLab.exp.nacl.hazard3'),
    ],
    explanation: t('virtualLab.exp.nacl.explanation'),
  },
  {
    id: 'neutralization',
    name: t('virtualLab.exp.neutralization.name'),
    station: t('virtualLab.exp.neutralization.station'),
    description: t('virtualLab.exp.neutralization.description'),
    reactants: t('virtualLab.exp.neutralization.reactants'),
    product: 'NaCl + H2O',
    defaultTemp: 298,
    defaultPress: 1,
    hazards: [
      t('virtualLab.exp.neutralization.hazard1'),
      t('virtualLab.exp.neutralization.hazard2'),
    ],
    explanation: t('virtualLab.exp.neutralization.explanation'),
  },
];

export function getRiskLevel(experimentId: string, temp: number, press: number, m1: number, m2: number, t: (k: string) => string) {
  if (press >= 3 || (experimentId === 'h2o' && temp >= 450)) return t('virtualLab.riskHigh');
  if (experimentId === 'neutralization' && (m1 >= 15 || m2 >= 15)) return t('virtualLab.riskMedium');
  if (experimentId === 'nacl') return t('virtualLab.riskHigh');
  return t('virtualLab.riskControlled');
}

export function getProgressLabel(isRunning: boolean, completed: boolean, t: (k: string) => string) {
  if (isRunning) return t('virtualLab.reactionInProgressBadge');
  if (completed) return t('virtualLab.experimentCompletedBadge');
  return t('virtualLab.ready');
}

