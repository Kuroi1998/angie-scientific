import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, UserProgress } from '../data/educational/models';
import { fetchUserData, updateProfile, updateProgress, CURRENT_USER_ID } from '../api/progress';

interface ProgressContextType {
  profile: UserProfile | null;
  progress: UserProgress | null;
  loading: boolean;
  saveProfile: (updates: Partial<UserProfile>) => Promise<void>;
  addDiscoveredElement: (elementId: string) => Promise<void>;
  addSuccessfulReaction: (reactionId: string) => Promise<void>;
  unlockBadge: (badgeId: string) => Promise<void>;
  addExperience: (points: number) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const UserProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchUserData(CURRENT_USER_ID);
      setProfile(data.profile);
      setProgress(data.progress);
    } catch (error) {
      console.error("Erreur chargement profil serveur", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    await updateProfile(CURRENT_USER_ID, updates);
  };

  const saveProgress = async (newProgress: UserProgress) => {
    setProgress(newProgress);
    await updateProgress(CURRENT_USER_ID, newProgress);
  };

  const addDiscoveredElement = async (elementId: string) => {
    if (!progress || progress.discoveredElements.includes(elementId)) return;
    await saveProgress({
      ...progress,
      discoveredElements: [...progress.discoveredElements, elementId],
      experiencePoints: progress.experiencePoints + 10
    });
  };

  const addSuccessfulReaction = async (reactionId: string) => {
    if (!progress || progress.successfulReactions.includes(reactionId)) return;
    await saveProgress({
      ...progress,
      successfulReactions: [...progress.successfulReactions, reactionId],
      experiencePoints: progress.experiencePoints + 50
    });
  };

  const unlockBadge = async (badgeId: string) => {
    if (!progress || progress.unlockedBadges.includes(badgeId)) return;
    await saveProgress({
      ...progress,
      unlockedBadges: [...progress.unlockedBadges, badgeId],
      experiencePoints: progress.experiencePoints + 100
    });
  };

  const addExperience = async (points: number) => {
    if (!progress) return;
    await saveProgress({
      ...progress,
      experiencePoints: progress.experiencePoints + points
    });
  };

  return (
    <ProgressContext.Provider value={{
      profile, progress, loading, saveProfile, addDiscoveredElement, addSuccessfulReaction, unlockBadge, addExperience
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useUserProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useUserProgress must be used within a UserProgressProvider');
  }
  return context;
};
