import { useLocalStorageState } from '../../../hooks/useLocalStorageState';
import type { FrequencyMode } from '../dialogue/dialogue.cooldown';

export interface AngiePreferences {
  frequencyMode: FrequencyMode;
  paused: boolean;
  position: 'left' | 'right';
  showQuickSuggestions: boolean;
  historyEnabled: boolean;
}

const DEFAULT_PREFERENCES: AngiePreferences = {
  frequencyMode: 'balanced',
  paused: false,
  position: 'right',
  showQuickSuggestions: true,
  historyEnabled: true,
};

const FREQUENCY_MODES: FrequencyMode[] = ['discrete', 'balanced', 'talkative'];

function isAngiePreferences(value: unknown): value is AngiePreferences {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<AngiePreferences>;
  return (
    typeof candidate.frequencyMode === 'string'
    && FREQUENCY_MODES.includes(candidate.frequencyMode as FrequencyMode)
    && typeof candidate.paused === 'boolean'
    && (candidate.position === 'left' || candidate.position === 'right')
    && typeof candidate.showQuickSuggestions === 'boolean'
    && typeof candidate.historyEnabled === 'boolean'
  );
}

/**
 * Preferences specific to the new Angie UI chrome (frequency, position,
 * quick suggestions, history). Master on/off switches for the mascot itself
 * (mascotEnabled, mascotSoundEnabled, reducedMotion) already live on the
 * synced UserProfile and are reused as-is rather than duplicated here.
 */
export function useAngiePreferences() {
  const [preferences, setPreferences, reset] = useLocalStorageState<AngiePreferences>(
    'angiePreferences',
    DEFAULT_PREFERENCES,
    { validate: isAngiePreferences },
  );

  const update = (patch: Partial<AngiePreferences>) => setPreferences((prev) => ({ ...prev, ...patch }));

  return { preferences, update, reset };
}
