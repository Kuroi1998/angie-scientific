import type { UserProfile, UserProgress } from '../data/educational/models';

const USER_ID_KEY = 'angie_scientific_user_id';
const PROFILES_KEY = 'angie_scientific_profiles';
const PROGRESS_KEY = 'angie_scientific_progress';

export const getUserId = (): string | null => {
  return localStorage.getItem(USER_ID_KEY);
};

export const setUserId = (id: string) => {
  localStorage.setItem(USER_ID_KEY, id);
};

export const removeUserId = () => {
  localStorage.removeItem(USER_ID_KEY);
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

export const fetchUserData = async (userId: string): Promise<{ profile: UserProfile, progress: UserProgress }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));

  const profilesStr = localStorage.getItem(PROFILES_KEY);
  const profiles = profilesStr ? JSON.parse(profilesStr) : {};
  
  const progressStr = localStorage.getItem(PROGRESS_KEY);
  const allProgress = progressStr ? JSON.parse(progressStr) : {};

  let profile = profiles[userId];
  if (!profile) {
    profile = getDefaultProfile(userId);
    profiles[userId] = profile;
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  }

  let progress = allProgress[userId];
  if (!progress) {
    progress = getDefaultProgress(userId);
    allProgress[userId] = progress;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
  }

  return { profile, progress };
};

export const updateProfile = async (userId: string, profile: Partial<UserProfile>): Promise<void> => {
  const profilesStr = localStorage.getItem(PROFILES_KEY);
  const profiles = profilesStr ? JSON.parse(profilesStr) : {};
  
  if (profiles[userId]) {
    profiles[userId] = { ...profiles[userId], ...profile };
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  }
};

export const updateProgress = async (userId: string, progress: UserProgress): Promise<void> => {
  const progressStr = localStorage.getItem(PROGRESS_KEY);
  const allProgress = progressStr ? JSON.parse(progressStr) : {};
  
  allProgress[userId] = progress;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
};
