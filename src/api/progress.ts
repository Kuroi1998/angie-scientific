import type { UserProfile, UserProgress } from '../data/educational/models';

const API_BASE = 'http://localhost:3001/api';

const USER_ID_KEY = 'angie_scientific_user_id';

export const getUserId = (): string | null => {
  return localStorage.getItem(USER_ID_KEY);
};

export const setUserId = (id: string) => {
  localStorage.setItem(USER_ID_KEY, id);
};

export const removeUserId = () => {
  localStorage.removeItem(USER_ID_KEY);
};
export const fetchUserData = async (userId: string): Promise<{ profile: UserProfile, progress: UserProgress }> => {
  const response = await fetch(`${API_BASE}/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user data');
  return response.json();
};

export const updateProfile = async (userId: string, profile: Partial<UserProfile>): Promise<void> => {
  const response = await fetch(`${API_BASE}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  if (!response.ok) throw new Error('Failed to update profile');
};

export const updateProgress = async (userId: string, progress: UserProgress): Promise<void> => {
  const response = await fetch(`${API_BASE}/progress/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(progress)
  });
  if (!response.ok) throw new Error('Failed to update progress');
};
