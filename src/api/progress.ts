import { UserProfile, UserProgress } from '../data/educational/models';

const API_BASE = 'http://localhost:3001/api';

// For this MVP, we simulate a logged-in user with a static ID. 
// In a real app, this would come from an Auth system.
export const CURRENT_USER_ID = 'user_001';

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
