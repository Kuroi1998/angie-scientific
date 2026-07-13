import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

type Emotion = 'neutral' | 'happy' | 'impressed' | 'thinking' | 'encouraging' | 'surprised' | 'worried';

interface MascotContextType {
  emotion: Emotion;
  currentMessage: string | null;
  isVisible: boolean;
  setEmotion: (emotion: Emotion) => void;
  showMessage: (msg: string, durationMs?: number, emotion?: Emotion) => void;
  hideMessage: () => void;
  toggleVisibility: () => void;
}

const MascotContext = createContext<MascotContextType | undefined>(undefined);

export const MascotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [emotion, setEmotion] = useState<Emotion>('neutral');
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideMessage = useCallback(() => {
    setCurrentMessage(null);
    setEmotion('neutral');
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const showMessage = useCallback((msg: string, durationMs = 5000, newEmotion?: Emotion) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentMessage(msg);
    if (newEmotion) setEmotion(newEmotion);
    
    timerRef.current = setTimeout(() => {
      hideMessage();
    }, durationMs);
  }, [hideMessage]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <MascotContext.Provider value={{
      emotion, currentMessage, isVisible, setEmotion, showMessage, hideMessage, toggleVisibility
    }}>
      {children}
    </MascotContext.Provider>
  );
};

export const useMascot = () => {
  const context = useContext(MascotContext);
  if (context === undefined) {
    throw new Error('useMascot must be used within a MascotProvider');
  }
  return context;
};
