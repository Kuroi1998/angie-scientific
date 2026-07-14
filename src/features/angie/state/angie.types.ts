export type Emotion =
  | 'neutral'
  | 'happy'
  | 'curious'
  | 'thinking'
  | 'encouraging'
  | 'surprised'
  | 'worried'
  | 'confused'
  | 'proud'
  | 'sleepy'
  | 'attentive'
  | 'explaining'
  | 'celebrating';

export type AngieMode =
  | 'hidden'
  | 'idle'
  | 'greeting'
  | 'speaking'
  | 'listening'
  | 'thinking'
  | 'responding'
  | 'encouraging'
  | 'celebrating'
  | 'warning'
  | 'resting'
  | 'expanded';

/** Ordered highest to lowest; index is used as the preemption rank. */
export const PRIORITY_ORDER = [
  'criticalError',
  'directReply',
  'scientificResult',
  'contextualHelp',
  'progression',
  'encouragement',
  'ambient',
] as const;

export type MessagePriority = (typeof PRIORITY_ORDER)[number];

export interface AngieQuickReply {
  id: string;
  label: string;
  actionId: string;
}

export interface AngieMessage {
  id: string;
  dialogueId: string;
  text: string;
  emotion: Emotion;
  priority: MessagePriority;
  durationMs: number;
  category: string;
  createdAt: number;
  quickReplies?: AngieQuickReply[];
  dismissible?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'angie';
  text: string;
  createdAt: number;
  quickReplies?: AngieQuickReply[];
}

export interface AngieReducerState {
  mode: AngieMode;
  emotion: Emotion;
  isVisible: boolean;
  isPanelOpen: boolean;
  queue: AngieMessage[];
  current: AngieMessage | null;
  dialogueHistory: string[];
  chatMessages: ChatMessage[];
  isResponding: boolean;
}

export type AngieAction =
  | { type: 'ENQUEUE_MESSAGE'; message: AngieMessage }
  | { type: 'ADVANCE_QUEUE' }
  | { type: 'DISMISS_CURRENT' }
  | { type: 'SET_EMOTION'; emotion: Emotion }
  | { type: 'SET_VISIBLE'; visible: boolean }
  | { type: 'OPEN_PANEL' }
  | { type: 'CLOSE_PANEL' }
  | { type: 'SEND_CHAT_MESSAGE'; message: ChatMessage }
  | { type: 'RECEIVE_CHAT_MESSAGE'; message: ChatMessage }
  | { type: 'SET_RESPONDING'; responding: boolean }
  | { type: 'CLEAR_CHAT' }
  | { type: 'NEW_CONVERSATION' };

export const HISTORY_LIMIT = 20;
export const QUEUE_LIMIT = 4;
