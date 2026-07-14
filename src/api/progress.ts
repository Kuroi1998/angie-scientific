import type { UserProfile, UserProgress } from '../data/educational/models';
import { OfflineStorageService } from '../services/Storage/OfflineStorageService';

const USER_ID_KEY = 'angie_scientific_user_id';
const PROFILES_KEY = 'angie_scientific_profiles';
const PROGRESS_KEY = 'angie_scientific_progress';
const API_URL = 'http://localhost:3001/api';

export const getUserId = (): string | null => {
  return OfflineStorageService.getItem<string>(USER_ID_KEY);
};

export const setUserId = (id: string) => {
  OfflineStorageService.setItem(USER_ID_KEY, id);
};

export const removeUserId = () => {
  OfflineStorageService.removeItem(USER_ID_KEY);
};

const getDefaultProfile = (username: string): UserProfile => ({
  id: username,
  username,
  learningLevel: 'discovery',
  mascotEnabled: true,
  mascotSoundEnabled: true,
  globalSoundEnabled: true,
  reducedMotion: false
});

const getDefaultProgress = (userId: string): UserProgress => ({
  userId,
  experiencePoints: 0,
  unlockedBadges: [],
  discoveredElements: [],
  successfulReactions: [],
  solvedRiddles: [],
  completedQuests: []
});

export const fetchUserData = async (
  userId: string,
): Promise<{ profile: UserProfile, progress: UserProgress }> => {
  let cloudProfile: UserProfile | null = null;
  let cloudProgress: UserProgress | null = null;

  if (navigator.onLine) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        cloudProfile = data.profile;
        cloudProgress = data.progress;
      }
    } catch (e) {
      console.warn('Could not fetch from cloud, falling back to local storage', e);
    }
  }

  const profiles = OfflineStorageService.getItem<Record<string, UserProfile>>(PROFILES_KEY) || {};
  const allProgress = OfflineStorageService.getItem<Record<string, UserProgress>>(PROGRESS_KEY) || {};

  if (cloudProfile && cloudProgress) {
    profiles[userId] = cloudProfile;
    allProgress[userId] = cloudProgress;
    OfflineStorageService.setItem(PROFILES_KEY, profiles);
    OfflineStorageService.setItem(PROGRESS_KEY, allProgress);
    return { profile: cloudProfile, progress: cloudProgress };
  }

  let profile = profiles[userId];
  if (!profile) {
    profile = getDefaultProfile(userId);
    profiles[userId] = profile;
    OfflineStorageService.setItem(PROFILES_KEY, profiles);
  }

  let progress = allProgress[userId];
  if (!progress) {
    progress = getDefaultProgress(userId);
    allProgress[userId] = progress;
    OfflineStorageService.setItem(PROGRESS_KEY, allProgress);
  }

  return { profile, progress };
};

export const updateProfile = async (
  userId: string,
  profileUpdates: Partial<UserProfile>,
): Promise<void> => {
  const profiles = OfflineStorageService.getItem<Record<string, UserProfile>>(PROFILES_KEY) || {};
  if (profiles[userId]) {
    profiles[userId] = { ...profiles[userId], ...profileUpdates };
    OfflineStorageService.setItem(PROFILES_KEY, profiles);
  }

  if (navigator.onLine) {
    try {
      await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileUpdates)
      });
    } catch (e) {
      console.warn('Could not sync profile to cloud, will sync later', e);
    }
  }
};

export const updateProgress = async (userId: string, progress: UserProgress): Promise<void> => {
  const allProgress = OfflineStorageService.getItem<Record<string, UserProgress>>(PROGRESS_KEY) || {};
  allProgress[userId] = progress;
  OfflineStorageService.setItem(PROGRESS_KEY, allProgress);

  if (navigator.onLine) {
    try {
      await fetch(`${API_URL}/progress/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progress)
      });
    } catch (e) {
      console.warn('Could not sync progress to cloud, will sync later', e);
    }
  }
};

export const syncWithCloud = async (userId: string): Promise<boolean> => {
  if (!navigator.onLine) return false;

  const profiles = OfflineStorageService.getItem<Record<string, UserProfile>>(PROFILES_KEY) || {};
  const allProgress = OfflineStorageService.getItem<Record<string, UserProgress>>(PROGRESS_KEY) || {};

  const profile = profiles[userId];
  const progress = allProgress[userId];

  if (!profile || !progress) return false;

  try {
    await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });

    await fetch(`${API_URL}/progress/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progress)
    });
    console.log("Synchronisation cloud reussie pour l'utilisateur:", userId);
    return true;
  } catch (e) {
    console.error('Echec de la synchronisation au cloud:', e);
    return false;
  }
};
