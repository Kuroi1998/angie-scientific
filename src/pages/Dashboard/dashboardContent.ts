import type { TabType } from '../../app/appTypes';

export interface DashboardAction {
  body: string;
  id: string;
  label: string;
  tab: TabType;
  title: string;
}

export const dashboardActions: DashboardAction[] = [
  {
    body: 'Explorer les familles, masses et proprietes atomiques.',
    id: 'periodic-table',
    label: 'Ouvrir',
    tab: 'table',
    title: 'Tableau periodique',
  },
  {
    body: 'Lancer une experience guidee et observer les resultats.',
    id: 'virtual-lab',
    label: 'Tester',
    tab: 'virtuallab',
    title: 'Laboratoires',
  },
  {
    body: 'Reviser avec des questions rapides et des indices.',
    id: 'quiz',
    label: 'Reviser',
    tab: 'quiz',
    title: 'Quiz scientifique',
  },
  {
    body: 'Suivre badges, quetes et decouvertes terminees.',
    id: 'quests',
    label: 'Voir',
    tab: 'quests',
    title: 'Progression',
  },
];

export const nextObjectives = [
  'Decouvrir cinq nouveaux elements.',
  'Completer une experience de laboratoire.',
  'Reussir une session de quiz sans indice.',
];
