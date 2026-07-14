import { useContext } from 'react';
import { AngieContext } from './angieContextValue';

export const useAngie = () => {
  const context = useContext(AngieContext);
  if (context === undefined) {
    throw new Error('useAngie must be used within an AngieProvider');
  }
  return context;
};
