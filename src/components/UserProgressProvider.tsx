import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { UserProfile, UserProgress } from '../data/educational/models';
import { fetchUserData, getUserId, syncWithCloud, updateProfile, updateProgress } from '../api/progress';
import { ProgressContext } from './UserProgressContext';
import { notifyApp } from '../utils/appNotifications';
import { useTheme } from '../theme/hooks/useTheme';
import { THEMES } from '../theme/theme.constants';
import type { ThemeId } from '../theme/theme.types';
import { defaultUnlockedThemes } from './UserCenter/userCenterData';

export const UserProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  const themeRef = useRef(theme);
  const setThemeRef = useRef(setTheme);

  useEffect(() => {
    themeRef.current = theme;
    setThemeRef.current = setTheme;
  }, [setTheme, theme]);

  const loadData = useCallback(async () => {
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
      console.error('Erreur chargement profil serveur', error);
      notifyApp({
        message: 'Impossible de recuperer le profil depuis le serveur.',
        title: 'Connexion au profil',
        tone: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const userId = getUserId();
    if (!userId) return;
    const newProfile = { ...profile, ...updates };
    const oldProfile = profile;
    setProfile(newProfile);
    try {
      await updateProfile(userId, updates);
    } catch (error) {
      console.error('Erreur de sauvegarde profil', error);
      setProfile(oldProfile);
      notifyApp({
        message: "Les preferences n'ont pas pu etre sauvegardees.",
        title: 'Sauvegarde interrompue',
        tone: 'error',
      });
    }
  }, [profile]);

  useEffect(() => {
    loadData();

    const handleOnline = async () => {
      const userId = getUserId();
      if (userId) {
        console.log('Reseau retabli, synchronisation avec le cloud...');
        await syncWithCloud(userId);
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [loadData]);

  useEffect(() => {
    const activeTheme = profile?.activeTheme;
    if (activeTheme && activeTheme in THEMES && activeTheme !== themeRef.current) {
      setThemeRef.current(activeTheme as ThemeId);
    }
  }, [profile?.activeTheme]);

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const newTheme = (e as CustomEvent<{ theme: ThemeId }>).detail?.theme;
      if (newTheme && getUserId()) {
        void saveProfile({ activeTheme: newTheme });
      }
    };
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, [saveProfile]);

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
      console.error('Erreur de sauvegarde progression', error);
      setProgress(oldProgress);
      notifyApp({
        message: "La progression locale n'a pas pu etre synchronisee.",
        title: 'Progression non sauvegardee',
        tone: 'error',
      });
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

  const unlockTheme = async (themeId: string, cost: number): Promise<boolean> => {
    if (!progress) return false;
    const unlocked = progress.unlockedThemes || defaultUnlockedThemes;
    if (unlocked.includes(themeId)) return true;
    if (progress.experiencePoints < cost) return false;

    await saveProgress({
      ...progress,
      unlockedThemes: [...unlocked, themeId],
      experiencePoints: progress.experiencePoints - cost
    });
    return true;
  };

  const equipTheme = async (themeId: string) => {
    await saveProfile({ activeTheme: themeId });
  };

  return (
    <ProgressContext.Provider value={{
      profile, progress, loading, saveProfile, addDiscoveredElement, addSuccessfulReaction, unlockBadge, addExperience, solveRiddle, unlockTheme, equipTheme
    }}>
      {children}
    </ProgressContext.Provider>
  );
};
