import { createContext } from 'react';
import type { UserProfile, UserProgress } from '../data/educational/models';

export interface ProgressContextType {
  profile: UserProfile | null;
  progress: UserProgress | null;
  loading: boolean;
  saveProfile: (updates: Partial<UserProfile>) => Promise<void>;
  addDiscoveredElement: (elementId: string) => Promise<void>;
  addSuccessfulReaction: (reactionId: string) => Promise<void>;
  unlockBadge: (badgeId: string) => Promise<void>;
  addExperience: (points: number) => Promise<void>;
  solveRiddle: (riddleId: string) => Promise<void>;
  unlockTheme: (themeId: string, cost: number) => Promise<boolean>;
  equipTheme: (themeId: string) => Promise<void>;
}

export const ProgressContext = createContext<ProgressContextType | undefined>(undefined);
