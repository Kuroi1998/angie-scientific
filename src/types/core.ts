export type LearningLevel = 'discovery' | 'intermediate' | 'scientific';

export type ScientificFact = {
  id: string;
  atomicNumber: number;
  elementSymbol: string;
  title: string;
  childFriendlyText: string;
  advancedText?: string;
  sourceName: string;
  sourceUrl: string;
  verifiedAt: string;
  category: 'element' | 'discovery' | 'reaction' | 'safety' | 'history' | 'daily_use' | 'surprising';
};

export type AudioPreferences = {
  enabled: boolean;
  masterVolume: number;
  musicVolume: number;
  effectsVolume: number;
  interfaceSoundsEnabled: boolean;
  achievementSoundsEnabled: boolean;
};

export type MotionPreferences = {
  reducedMotion: boolean;
  disableParticles: boolean;
  disable3D: boolean;
  disablePageTransitions: boolean;
};

export type UnlockableTheme = {
  id: string;
  name: string;
  description: string;
  xpCost: number;
  previewImage: string;
  tokens: Record<string, string>;
};

export type QuizMode = 'practice' | 'quick' | 'exam' | 'review';

export type QuestionType = 'mcq' | 'true_false' | 'symbol_to_name' | 'name_to_symbol' | 'visual_identification' | 'reaction';

export type QuizQuestion = {
  id: string;
  type: QuestionType;
  difficulty: 'easy' | 'medium' | 'hard';
  questionText: string;
  options?: string[];
  correctAnswer: string | string[];
  hint?: string;
  explanation: string;
};

export type ExamResult = {
  id: string;
  date: string;
  score: number;
  maxScore: number;
  timeSpentMs: number;
  correctAnswersCount: number;
  incorrectAnswersCount: number;
  masteredCategories: string[];
  toReviewCategories: string[];
};

export type ScientificMedia = {
  id: string;
  elementSymbol: string;
  type: 'pure_sample' | 'mineral' | 'industrial' | 'daily_use' | 'emission' | 'crystal' | 'illustration';
  url: string;
  caption: string;
  description: string;
  credit: string;
  author: string;
  license: string;
  sourceUrl: string;
  verifiedAt: string;
};
