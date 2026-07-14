import { useCallback, useRef } from 'react';
import { useLanguage } from '../../../hooks/useLanguage';
import type { AngieSituation } from '../context/situation.types';
import { useAngie } from '../state/useAngie';
import { getIntentById, matchIntentText } from './intent.matcher';
import { FALLBACK_TEXT } from './intent.registry';
import { getScientificContext } from './scientificContext';

const THINKING_DELAY_MS = 350;

/**
 * Bridges the chat panel to the keyword/intent engine. No LLM: the reply is
 * computed instantly, the short delay only makes the "thinking" state
 * perceptible rather than simulating real work.
 */
export function useAngieConversation(situation: AngieSituation) {
  const { sendUserMessage, receiveAngieReply, setResponding } = useAngie();
  const { language } = useLanguage();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setResponding(false);
  }, [setResponding]);

  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendUserMessage(trimmed);
    setResponding(true);
    const lang = language === 'es' ? 'es' : 'fr';
    const { fusion, gasEquations } = getScientificContext();
    timerRef.current = setTimeout(() => {
      const replyText = matchIntentText(trimmed, lang, { language: lang, situation, fusion, gasEquations });
      receiveAngieReply(replyText);
      timerRef.current = null;
    }, THINKING_DELAY_MS);
  }, [language, receiveAngieReply, sendUserMessage, setResponding, situation]);

  /** Quick-action buttons resolve the intent directly, bypassing keyword matching. */
  const sendIntent = useCallback((intentId: string, displayText: string) => {
    sendUserMessage(displayText);
    setResponding(true);
    const lang = language === 'es' ? 'es' : 'fr';
    const { fusion, gasEquations } = getScientificContext();
    timerRef.current = setTimeout(() => {
      const intent = getIntentById(intentId);
      const replyText = intent ? intent.respond({ language: lang, situation, fusion, gasEquations }).text : FALLBACK_TEXT[lang];
      receiveAngieReply(replyText);
      timerRef.current = null;
    }, THINKING_DELAY_MS);
  }, [language, receiveAngieReply, sendUserMessage, setResponding, situation]);

  return { send, sendIntent, cancel };
}
