import { useEffect, useRef } from 'react';
import type { FrequencyMode } from '../dialogue/dialogue.cooldown';
import { useAngieFireDialogue } from './useAngieFireDialogue';

const SHORT_IDLE_MS = 90_000;
const LONG_IDLE_MS = 300_000;
const RESCHEDULE_THROTTLE_MS = 5_000;
const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'] as const;

/**
 * Single re-armed timer per idle tier — no per-mousemove re-render, no
 * stacked concurrent timers. Paused automatically while the tab is hidden.
 */
export function useAngieIdle(enabled: boolean, frequencyMode: FrequencyMode = 'balanced') {
  const fireDialogue = useAngieFireDialogue();
  const shortTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastResetRef = useRef(0);

  useEffect(() => {
    if (!enabled) return undefined;

    const clearTimers = () => {
      if (shortTimerRef.current) clearTimeout(shortTimerRef.current);
      if (longTimerRef.current) clearTimeout(longTimerRef.current);
    };

    const arm = () => {
      clearTimers();
      if (document.hidden) return;
      shortTimerRef.current = setTimeout(() => fireDialogue('idle.shortIdle', frequencyMode), SHORT_IDLE_MS);
      longTimerRef.current = setTimeout(() => fireDialogue('idle.longIdle', frequencyMode), LONG_IDLE_MS);
    };

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastResetRef.current < RESCHEDULE_THROTTLE_MS) return;
      lastResetRef.current = now;
      arm();
    };

    const handleVisibility = () => {
      if (document.hidden) clearTimers();
      else arm();
    };

    arm();
    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, handleActivity, { passive: true }));
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearTimers();
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, handleActivity));
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [enabled, fireDialogue, frequencyMode]);
}
