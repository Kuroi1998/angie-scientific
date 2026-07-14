export type LearningDifficulty = 'easy' | 'medium' | 'hard';
export type LearningMode = 'training' | 'exam';

export interface QuizQuestion {
  correctAnswer: string;
  explanation: string;
  hint: string;
  id: string;
  options: string[];
  prompt: string;
  topic: string;
}

export interface AnswerRecord {
  correctAnswer: string;
  explanation: string;
  isCorrect: boolean;
  prompt: string;
  questionId: string;
  selectedAnswer: string;
}

export interface QuizSessionResult {
  answers: AnswerRecord[];
  createdAt: string;
  difficulty: LearningDifficulty;
  durationSec: number;
  id: string;
  interrupted: boolean;
  mode: LearningMode;
  offline: boolean;
  score: number;
  total: number;
}

export function isQuizSessionHistory(raw: unknown): raw is QuizSessionResult[] {
  return Array.isArray(raw) && raw.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const value = item as Partial<QuizSessionResult>;
    return typeof value.id === 'string'
      && typeof value.score === 'number'
      && typeof value.total === 'number'
      && Array.isArray(value.answers);
  });
}

