import React, { useState, useCallback, useRef } from 'react';
import { useUserProgress } from '../useUserProgress';
import { AudioManager } from '../../services/Audio/AudioManager';
import { MascotContext, type Emotion } from './mascotContextValue';

export const MascotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [emotion, setEmotion] = useState<Emotion>('neutral');
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const { profile } = useUserProgress();

  const hideMessage = useCallback(() => {
    setCurrentMessage(null);
    setEmotion('neutral');
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const showMessage = useCallback((msg: string, durationMs = 5000, newEmotion?: Emotion) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentMessage(msg);
    if (newEmotion) setEmotion(newEmotion);
    
    if (profile?.mascotSoundEnabled !== false) {
      AudioManager.getInstance().playNotification();
    }
    
    timerRef.current = setTimeout(() => {
      hideMessage();
    }, durationMs);
  }, [hideMessage, profile]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <MascotContext.Provider value={{
      emotion, currentMessage, isVisible, setEmotion, showMessage, hideMessage, toggleVisibility
    }}>
      {children}
    </MascotContext.Provider>
  );
};
