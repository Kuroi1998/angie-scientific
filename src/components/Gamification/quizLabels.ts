import type { LearningDifficulty, LearningMode } from './learningTypes';

export const difficultyLabels: Record<LearningDifficulty, string> = {
  easy: 'Facile',
  medium: 'Intermediaire',
  hard: 'Avance',
};

export const modeLabels: Record<LearningMode, string> = {
  exam: 'Examen',
  training: 'Entrainement',
};

export function scoreLabel(score: number, total: number) {
  const ratio = total > 0 ? score / total : 0;
  if (ratio >= 0.85) return 'Maitrise solide';
  if (ratio >= 0.6) return 'Base en progression';
  return 'Revision conseillee';
}

