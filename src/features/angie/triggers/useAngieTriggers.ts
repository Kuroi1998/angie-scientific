import { useEffect, useRef } from 'react';
import { useLocalStorageState } from '../../../hooks/useLocalStorageState';
import type { AngieSituation } from '../context/situation.types';
import type { FrequencyMode } from '../dialogue/dialogue.cooldown';
import { useAngieFireDialogue } from './useAngieFireDialogue';

const ONE_HOUR = 60 * 60 * 1000;
const THREE_DAYS = 3 * 24 * ONE_HOUR;

/**
 * Watches the app situation (route, progress counters, theme, language) and
 * fires the matching registered dialogue automatically. This replaces the
 * old ad hoc useTutorial one-shot map and the hardcoded per-component
 * showMessage calls for navigation/progress/preference events.
 */
export function useAngieTriggers(situation: AngieSituation, enabled = true, frequencyMode: FrequencyMode = 'balanced') {
  const fireDialogue = useAngieFireDialogue();
  const [lastSeenAt, setLastSeenAt] = useLocalStorageState<number>('angieLastSeenAt', 0, {
    validate: (value): value is number => typeof value === 'number',
  });

  const prevTabRef = useRef<string | null>(null);
  const prevBadgesRef = useRef(situation.unlockedBadgesCount);
  const prevQuestsRef = useRef(situation.completedQuestsCount);
  const prevThemeRef = useRef<string | null>(null);
  const prevLanguageRef = useRef<string | null>(null);
  const greetedRef = useRef(false);

  useEffect(() => {
    if (greetedRef.current || !situation.mascotEnabled) return;
    greetedRef.current = true;
    const now = Date.now();
    const elapsed = lastSeenAt ? now - lastSeenAt : Infinity;
    if (enabled) {
      if (situation.isFirstVisit) {
        fireDialogue('greetings.firstVisit', frequencyMode);
      } else if (elapsed > THREE_DAYS) {
        fireDialogue('greetings.longAbsence', frequencyMode);
      } else if (elapsed > ONE_HOUR) {
        fireDialogue('greetings.returning', frequencyMode);
      }
    }
    setLastSeenAt(now);
  }, [enabled, fireDialogue, frequencyMode, lastSeenAt, setLastSeenAt, situation.isFirstVisit, situation.mascotEnabled]);

  useEffect(() => {
    if (prevTabRef.current === null) {
      prevTabRef.current = situation.currentTab;
      return;
    }
    if (prevTabRef.current === situation.currentTab) return;
    prevTabRef.current = situation.currentTab;
    if (enabled) fireDialogue(`navigation.${situation.currentTab}`, frequencyMode);
  }, [enabled, fireDialogue, frequencyMode, situation.currentTab]);

  useEffect(() => {
    if (situation.unlockedBadgesCount > prevBadgesRef.current && enabled) {
      fireDialogue('progress.badgeUnlocked', frequencyMode);
    }
    prevBadgesRef.current = situation.unlockedBadgesCount;
  }, [enabled, fireDialogue, frequencyMode, situation.unlockedBadgesCount]);

  useEffect(() => {
    if (situation.completedQuestsCount > prevQuestsRef.current && enabled) {
      fireDialogue('quests.completed', frequencyMode);
    }
    prevQuestsRef.current = situation.completedQuestsCount;
  }, [enabled, fireDialogue, frequencyMode, situation.completedQuestsCount]);

  useEffect(() => {
    if (prevThemeRef.current !== null && prevThemeRef.current !== situation.theme && enabled) {
      fireDialogue('preferences.themeChanged', frequencyMode);
    }
    prevThemeRef.current = situation.theme;
  }, [enabled, fireDialogue, frequencyMode, situation.theme]);

  useEffect(() => {
    if (prevLanguageRef.current !== null && prevLanguageRef.current !== situation.language && enabled) {
      fireDialogue('preferences.languageChanged', frequencyMode);
    }
    prevLanguageRef.current = situation.language;
  }, [enabled, fireDialogue, frequencyMode, situation.language]);
}
