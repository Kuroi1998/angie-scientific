import { createContext } from 'react';
import type { AngieMessage, AngieReducerState, ChatMessage, Emotion, MessagePriority } from './angie.types';

export interface AngieContextType {
  state: AngieReducerState;
  showMessage: (text: string, durationMs?: number, emotion?: Emotion, priority?: MessagePriority) => void;
  enqueueDialogueMessage: (message: Omit<AngieMessage, 'id' | 'createdAt'>) => void;
  hideMessage: () => void;
  setEmotion: (emotion: Emotion) => void;
  toggleVisibility: () => void;
  openPanel: () => void;
  closePanel: () => void;
  sendUserMessage: (text: string) => ChatMessage;
  receiveAngieReply: (text: string, quickReplies?: ChatMessage['quickReplies']) => void;
  setResponding: (responding: boolean) => void;
  clearChat: () => void;
  startNewConversation: () => void;
}

export const AngieContext = createContext<AngieContextType | undefined>(undefined);
