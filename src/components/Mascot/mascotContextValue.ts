import { createContext } from 'react';

export type Emotion = 'neutral' | 'happy' | 'impressed' | 'thinking' | 'encouraging' | 'surprised' | 'worried';

export interface MascotContextType {
  emotion: Emotion;
  currentMessage: string | null;
  isVisible: boolean;
  setEmotion: (emotion: Emotion) => void;
  showMessage: (msg: string, durationMs?: number, emotion?: Emotion) => void;
  hideMessage: () => void;
  toggleVisibility: () => void;
}

export const MascotContext = createContext<MascotContextType | undefined>(undefined);
