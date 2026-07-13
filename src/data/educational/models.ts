export type LearningLevel = 'discovery' | 'intermediate' | 'scientific';

export interface EducationalFact {
  id: string;
  targetElement: string; // ex: "C" ou "H2O"
  title: string;
  simplifiedText: string; // level: discovery
  intermediateText?: string; // level: intermediate
  advancedText?: string; // level: scientific
  isHazardous?: boolean;
  hazardWarning?: string;
  sourceUrl?: string;
}

export interface MascotMessage {
  id: string;
  triggerEvent: string; // ex: "fusion_success", "fusion_unstable", "badge_unlocked"
  emotion: 'neutral' | 'happy' | 'impressed' | 'thinking' | 'encouraging' | 'surprised' | 'worried';
  messageFr: string;
  messageEs: string;
}

export interface Riddle {
  id: string;
  category: 'symbol' | 'property' | 'history' | 'daily_use';
  difficulty: 'easy' | 'medium' | 'hard';
  questionFr: string;
  questionEs: string;
  answerElementSymbol: string; // ex: "He"
  hintFr?: string;
  hintEs?: string;
  explanationFr: string;
  explanationEs: string;
}

export interface Badge {
  id: string;
  nameFr: string;
  nameEs: string;
  descriptionFr: string;
  descriptionEs: string;
  iconName: string; // lucide-react icon name string
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  conditionType: 'elements_discovered' | 'reactions_done' | 'specific_reaction' | 'riddles_solved';
  conditionTarget?: string; // ex: "H2O"
  conditionCount: number;
}

export interface UserProfile {
  id: string;
  username: string;
  learningLevel: LearningLevel;
  mascotEnabled: boolean;
  mascotSoundEnabled: boolean;
  globalSoundEnabled: boolean;
  reducedMotion: boolean;
  activeTheme?: string;
}

export interface UserProgress {
  userId: string;
  discoveredElements: string[]; // ["H", "He"]
  successfulReactions: string[]; // ["H2O", "NaCl"]
  completedQuests: string[];
  unlockedBadges: string[];
  solvedRiddles: string[];
  unlockedThemes?: string[];
  experiencePoints: number;
}
