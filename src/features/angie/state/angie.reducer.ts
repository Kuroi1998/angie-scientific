import { pushDialogueHistory } from '../dialogue/dialogue.history';
import type { AngieAction, AngieMessage, AngieMode, AngieReducerState } from './angie.types';
import { HISTORY_LIMIT, PRIORITY_ORDER, QUEUE_LIMIT } from './angie.types';

const priorityRank = (priority: AngieMessage['priority']) => PRIORITY_ORDER.indexOf(priority);

const modeForMessage = (message: AngieMessage): AngieMode => {
  if (message.priority === 'criticalError') return 'warning';
  if (message.priority === 'progression') return 'celebrating';
  if (message.priority === 'encouragement') return 'encouraging';
  return 'speaking';
};

const pushHistory = (history: string[], dialogueId: string): string[] =>
  pushDialogueHistory(history, dialogueId, HISTORY_LIMIT);

function insertSorted(queue: AngieMessage[], message: AngieMessage): AngieMessage[] {
  const next = [...queue, message].sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));
  if (next.length <= QUEUE_LIMIT) return next;
  const lowestAmbientIndex = [...next].reverse().findIndex((item) => item.priority === 'ambient');
  if (lowestAmbientIndex === -1) return next.slice(0, QUEUE_LIMIT);
  const realIndex = next.length - 1 - lowestAmbientIndex;
  return next.filter((_, index) => index !== realIndex);
}

export const initialAngieState: AngieReducerState = {
  mode: 'idle',
  emotion: 'neutral',
  isVisible: true,
  isPanelOpen: false,
  queue: [],
  current: null,
  dialogueHistory: [],
  chatMessages: [],
  isResponding: false,
};

export function angieReducer(state: AngieReducerState, action: AngieAction): AngieReducerState {
  switch (action.type) {
    case 'ENQUEUE_MESSAGE': {
      const { message } = action;
      if (!state.current) {
        return {
          ...state,
          current: message,
          emotion: message.emotion,
          mode: modeForMessage(message),
          dialogueHistory: pushHistory(state.dialogueHistory, message.dialogueId),
        };
      }
      if (priorityRank(message.priority) < priorityRank(state.current.priority)) {
        const requeuedCurrent = state.current.priority === 'ambient' ? state.queue : insertSorted(state.queue, state.current);
        return {
          ...state,
          current: message,
          emotion: message.emotion,
          mode: modeForMessage(message),
          queue: requeuedCurrent,
          dialogueHistory: pushHistory(state.dialogueHistory, message.dialogueId),
        };
      }
      return { ...state, queue: insertSorted(state.queue, message) };
    }

    case 'ADVANCE_QUEUE':
    case 'DISMISS_CURRENT': {
      if (state.queue.length === 0) {
        return { ...state, current: null, mode: 'idle', emotion: 'neutral' };
      }
      const [next, ...rest] = state.queue;
      return {
        ...state,
        current: next,
        queue: rest,
        emotion: next.emotion,
        mode: modeForMessage(next),
        dialogueHistory: pushHistory(state.dialogueHistory, next.dialogueId),
      };
    }

    case 'SET_EMOTION':
      return { ...state, emotion: action.emotion };

    case 'SET_VISIBLE':
      return { ...state, isVisible: action.visible, mode: action.visible ? state.mode : 'hidden' };

    case 'OPEN_PANEL':
      return { ...state, isPanelOpen: true, mode: 'expanded' };

    case 'CLOSE_PANEL':
      return { ...state, isPanelOpen: false, mode: state.current ? modeForMessage(state.current) : 'idle' };

    case 'SEND_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.message], mode: 'listening' };

    case 'RECEIVE_CHAT_MESSAGE':
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.message],
        isResponding: false,
        mode: 'responding',
        emotion: 'explaining',
      };

    case 'SET_RESPONDING':
      return { ...state, isResponding: action.responding, mode: action.responding ? 'thinking' : state.mode };

    case 'CLEAR_CHAT':
      return { ...state, chatMessages: [] };

    case 'NEW_CONVERSATION':
      return { ...state, chatMessages: [], isResponding: false };

    default:
      return state;
  }
}
