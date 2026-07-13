import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, UserProgress } from '../data/educational/models';
import { fetchUserData, updateProfile, updateProgress, getUserId } from '../api/progress';

interface ProgressContextType {
  profile: UserProfile | null;
  progress: UserProgress | null;
  loading: boolean;
  saveProfile: (updates: Partial<UserProfile>) => Promise<void>;
  addDiscoveredElement: (elementId: string) => Promise<void>;
  addSuccessfulReaction: (reactionId: string) => Promise<void>;
  unlockBadge: (badgeId: string) => Promise<void>;
  addExperience: (points: number) => Promise<void>;
  solveRiddle: (riddleId: string) => Promise<void>;
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
    const userId = getUserId();
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await fetchUserData(userId);
      setProfile(data.profile);
      setProgress(data.progress);
    } catch (error) {
      console.error("Erreur chargement profil serveur", error);
      alert("Erreur de connexion au serveur pour récupérer le profil.");
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const userId = getUserId();
    if (!userId) return;
    const newProfile = { ...profile, ...updates };
    const oldProfile = profile;
    setProfile(newProfile);
    try {
      await updateProfile(userId, updates);
    } catch (error) {
      console.error("Erreur de sauvegarde profil", error);
      setProfile(oldProfile); // Rollback
      alert("Erreur réseau: impossible de sauvegarder les préférences.");
    }
  };

  const checkBadges = (currentProgress: UserProgress): string[] => {
    const newBadges: string[] = [];
    if (currentProgress.discoveredElements.length >= 5 && !currentProgress.unlockedBadges.includes('b1')) newBadges.push('b1');
    if (currentProgress.discoveredElements.length >= 20 && !currentProgress.unlockedBadges.includes('b2')) newBadges.push('b2');
    if (currentProgress.successfulReactions.length >= 1 && !currentProgress.unlockedBadges.includes('b4')) newBadges.push('b4');
    if (currentProgress.solvedRiddles.length >= 5 && !currentProgress.unlockedBadges.includes('b6')) newBadges.push('b6');
    return newBadges;
  };

  const saveProgress = async (newProgress: UserProgress) => {
    const userId = getUserId();
    if (!userId) return;

    // Auto-unlock badges logic
    const autoUnlocked = checkBadges(newProgress);
    if (autoUnlocked.length > 0) {
      newProgress = {
        ...newProgress,
        unlockedBadges: [...newProgress.unlockedBadges, ...autoUnlocked],
        experiencePoints: newProgress.experiencePoints + (autoUnlocked.length * 100)
      };
    }

    const oldProgress = progress;
    setProgress(newProgress);
    try {
      await updateProgress(userId, newProgress);
    } catch (error) {
      console.error("Erreur de sauvegarde progression", error);
      setProgress(oldProgress); // Rollback
      alert("Erreur réseau: progression locale non sauvegardée !");
    }
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

  const solveRiddle = async (riddleId: string) => {
    if (!progress || progress.solvedRiddles.includes(riddleId)) return;
    await saveProgress({
      ...progress,
      solvedRiddles: [...progress.solvedRiddles, riddleId],
      experiencePoints: progress.experiencePoints + 30
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
      profile, progress, loading, saveProfile, addDiscoveredElement, addSuccessfulReaction, unlockBadge, addExperience, solveRiddle
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
