import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import { useUserProgress } from '../../../components/useUserProgress';
import { AudioManager } from '../../../services/Audio/AudioManager';
import { computeReadableDuration } from '../dialogue/dialogue.duration';
import { angieReducer, initialAngieState } from './angie.reducer';
import { AngieContext } from './angieContextValue';
import type { AngieMessage, ChatMessage, Emotion, MessagePriority } from './angie.types';

let messageCounter = 0;
const nextId = (prefix: string) => {
  messageCounter += 1;
  return `${prefix}-${messageCounter}`;
};

const DEFAULT_DURATION = 5000;

export const AngieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(angieReducer, initialAngieState);
  const { profile } = useUserProgress();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingRef = useRef<number>(0);
  const startedAtRef = useRef<number>(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const advance = useCallback(() => {
    clearTimer();
    dispatch({ type: 'ADVANCE_QUEUE' });
  }, [clearTimer]);

  const armTimer = useCallback((durationMs: number) => {
    clearTimer();
    if (!Number.isFinite(durationMs) || durationMs <= 0) return;
    startedAtRef.current = Date.now();
    remainingRef.current = durationMs;
    timerRef.current = setTimeout(advance, durationMs);
  }, [advance, clearTimer]);

  useEffect(() => {
    if (state.current) {
      armTimer(state.current.durationMs);
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [state.current, armTimer, clearTimer]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        if (timerRef.current) {
          clearTimer();
          remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAtRef.current));
        }
      } else if (stateRef.current.current && remainingRef.current > 0) {
        armTimer(remainingRef.current);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [armTimer, clearTimer]);

  useEffect(() => {
    if (!state.current) return;
    if (profile?.mascotSoundEnabled !== false) {
      AudioManager.getInstance().playNotification();
    }
  }, [state.current, profile?.mascotSoundEnabled]);

  const enqueueDialogueMessage = useCallback((message: Omit<AngieMessage, 'id' | 'createdAt'>) => {
    if (profile?.mascotEnabled === false) return;
    dispatch({
      type: 'ENQUEUE_MESSAGE',
      message: { ...message, id: nextId('msg'), createdAt: Date.now() },
    });
  }, [profile?.mascotEnabled]);

  const showMessage = useCallback((
    text: string,
    durationMs = DEFAULT_DURATION,
    emotion: Emotion = 'neutral',
    priority: MessagePriority = 'directReply',
  ) => {
    enqueueDialogueMessage({
      dialogueId: nextId('legacy'),
      text,
      emotion,
      priority,
      durationMs: Math.max(durationMs, computeReadableDuration(text)),
      category: 'legacy',
      dismissible: true,
    });
  }, [enqueueDialogueMessage]);

  const hideMessage = useCallback(() => advance(), [advance]);
  const setEmotion = useCallback((emotion: Emotion) => dispatch({ type: 'SET_EMOTION', emotion }), []);
  const toggleVisibility = useCallback(() => dispatch({ type: 'SET_VISIBLE', visible: !stateRef.current.isVisible }), []);
  const openPanel = useCallback(() => dispatch({ type: 'OPEN_PANEL' }), []);
  const closePanel = useCallback(() => dispatch({ type: 'CLOSE_PANEL' }), []);

  const sendUserMessage = useCallback((text: string): ChatMessage => {
    const message: ChatMessage = { id: nextId('user'), role: 'user', text, createdAt: Date.now() };
    dispatch({ type: 'SEND_CHAT_MESSAGE', message });
    return message;
  }, []);

  const receiveAngieReply = useCallback((text: string, quickReplies?: ChatMessage['quickReplies']) => {
    dispatch({
      type: 'RECEIVE_CHAT_MESSAGE',
      message: { id: nextId('angie'), role: 'angie', text, createdAt: Date.now(), quickReplies },
    });
  }, []);

  const setResponding = useCallback((responding: boolean) => dispatch({ type: 'SET_RESPONDING', responding }), []);
  const clearChat = useCallback(() => dispatch({ type: 'CLEAR_CHAT' }), []);
  const startNewConversation = useCallback(() => dispatch({ type: 'NEW_CONVERSATION' }), []);

  return (
    <AngieContext.Provider value={{
      state,
      showMessage,
      enqueueDialogueMessage,
      hideMessage,
      setEmotion,
      toggleVisibility,
      openPanel,
      closePanel,
      sendUserMessage,
      receiveAngieReply,
      setResponding,
      clearChat,
      startNewConversation,
    }}
    >
      {children}
    </AngieContext.Provider>
  );
};
