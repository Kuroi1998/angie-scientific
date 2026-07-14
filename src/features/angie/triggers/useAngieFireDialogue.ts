import { useCallback, useRef } from 'react';
import { useLanguage } from '../../../hooks/useLanguage';
import { canFire, recordFire } from '../dialogue/dialogue.cooldown';
import type { CooldownMap, FrequencyMode } from '../dialogue/dialogue.cooldown';
import { computeReadableDuration } from '../dialogue/dialogue.duration';
import { DIALOGUE_REGISTRY } from '../dialogue/dialogue.registry';
import { selectDialogue } from '../dialogue/dialogue.selector';
import { useAngie } from '../state/useAngie';
import { getTriggerDefinition } from './trigger.definitions';

/**
 * Shared entry point for firing a registered dialogue key — used both by the
 * automatic trigger hook and by call sites that migrated off raw showMessage
 * (fusion result, quiz feedback, ...). Applies cooldown + anti-repetition +
 * the "never invent, skip silently if unregistered" rule in one place.
 */
export function useAngieFireDialogue() {
  const { state, enqueueDialogueMessage } = useAngie();
  const { language } = useLanguage();
  const cooldownsRef = useRef<CooldownMap>({});

  return useCallback((key: string, frequencyMode: FrequencyMode = 'balanced', suffixText?: string): boolean => {
    const definition = getTriggerDefinition(key);
    const now = Date.now();
    if (!canFire(cooldownsRef.current, key, definition.cooldownMs, now, frequencyMode)) return false;

    const lang = language === 'es' ? 'es' : 'fr';
    const variant = selectDialogue(DIALOGUE_REGISTRY, lang, key, state.dialogueHistory);
    if (!variant) return false;

    const text = suffixText ? `${variant.text} ${suffixText}` : variant.text;
    enqueueDialogueMessage({
      dialogueId: variant.id,
      text,
      emotion: variant.emotion,
      priority: definition.priority,
      durationMs: Math.max(definition.durationMs, computeReadableDuration(text)),
      category: key.split('.')[0],
      dismissible: definition.dismissible ?? true,
    });
    cooldownsRef.current = recordFire(cooldownsRef.current, key, now);
    return true;
  }, [enqueueDialogueMessage, language, state.dialogueHistory]);
}
