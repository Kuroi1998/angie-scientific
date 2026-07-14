import { useContext } from 'react';
import { ProgressContext } from './UserProgressContext';

export const useUserProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useUserProgress must be used within a UserProgressProvider');
  }
  return context;
};
