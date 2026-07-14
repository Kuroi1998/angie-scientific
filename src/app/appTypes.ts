export type TabType =
  | 'home'
  | 'profile'
  | 'table'
  | 'fusion'
  | 'quantum'
  | 'physchem'
  | 'virtuallab'
  | 'quests'
  | 'quiz';

export const TAB_IDS: TabType[] = [
  'home',
  'profile',
  'table',
  'fusion',
  'quantum',
  'physchem',
  'virtuallab',
  'quests',
  'quiz',
];

export const isTabType = (raw: unknown): raw is TabType =>
  typeof raw === 'string' && (TAB_IDS as string[]).includes(raw);
