import { describe, expect, it } from 'vitest';
import { angieReducer, initialAngieState } from '../state/angie.reducer';
import type { AngieMessage } from '../state/angie.types';
import { HISTORY_LIMIT } from '../state/angie.types';

function makeMessage(overrides: Partial<AngieMessage>): AngieMessage {
  return {
    id: overrides.id ?? 'id',
    dialogueId: overrides.dialogueId ?? 'dlg',
    text: overrides.text ?? 'text',
    emotion: overrides.emotion ?? 'neutral',
    priority: overrides.priority ?? 'ambient',
    durationMs: overrides.durationMs ?? 5000,
    category: overrides.category ?? 'test',
    createdAt: overrides.createdAt ?? 0,
    ...overrides,
  };
}

describe('angieReducer', () => {
  it('shows the first message immediately when nothing is displayed', () => {
    const message = makeMessage({ dialogueId: 'd1', priority: 'ambient' });
    const next = angieReducer(initialAngieState, { type: 'ENQUEUE_MESSAGE', message });
    expect(next.current?.dialogueId).toBe('d1');
    expect(next.dialogueHistory).toEqual(['d1']);
  });

  it('queues a lower-priority message instead of dropping it', () => {
    const first = angieReducer(initialAngieState, {
      type: 'ENQUEUE_MESSAGE',
      message: makeMessage({ dialogueId: 'high', priority: 'directReply' }),
    });
    const next = angieReducer(first, {
      type: 'ENQUEUE_MESSAGE',
      message: makeMessage({ dialogueId: 'low', priority: 'ambient' }),
    });
    expect(next.current?.dialogueId).toBe('high');
    expect(next.queue.map((m) => m.dialogueId)).toEqual(['low']);
  });

  it('preempts the current message when a higher-priority one arrives', () => {
    const first = angieReducer(initialAngieState, {
      type: 'ENQUEUE_MESSAGE',
      message: makeMessage({ dialogueId: 'progress', priority: 'progression' }),
    });
    const next = angieReducer(first, {
      type: 'ENQUEUE_MESSAGE',
      message: makeMessage({ dialogueId: 'critical', priority: 'criticalError' }),
    });
    expect(next.current?.dialogueId).toBe('critical');
    expect(next.queue.map((m) => m.dialogueId)).toEqual(['progress']);
  });

  it('drops a preempted ambient message rather than requeuing it', () => {
    const first = angieReducer(initialAngieState, {
      type: 'ENQUEUE_MESSAGE',
      message: makeMessage({ dialogueId: 'ambient1', priority: 'ambient' }),
    });
    const next = angieReducer(first, {
      type: 'ENQUEUE_MESSAGE',
      message: makeMessage({ dialogueId: 'error1', priority: 'criticalError' }),
    });
    expect(next.current?.dialogueId).toBe('error1');
    expect(next.queue).toEqual([]);
  });

  it('advances to the next queued message in priority order', () => {
    let state = angieReducer(initialAngieState, {
      type: 'ENQUEUE_MESSAGE',
      message: makeMessage({ dialogueId: 'first', priority: 'directReply' }),
    });
    state = angieReducer(state, {
      type: 'ENQUEUE_MESSAGE',
      message: makeMessage({ dialogueId: 'ambient', priority: 'ambient' }),
    });
    state = angieReducer(state, {
      type: 'ENQUEUE_MESSAGE',
      message: makeMessage({ dialogueId: 'help', priority: 'contextualHelp' }),
    });
    const next = angieReducer(state, { type: 'ADVANCE_QUEUE' });
    expect(next.current?.dialogueId).toBe('help');
    expect(next.queue.map((m) => m.dialogueId)).toEqual(['ambient']);
  });

  it('returns to idle with no emotion once the queue is empty', () => {
    const withMessage = angieReducer(initialAngieState, {
      type: 'ENQUEUE_MESSAGE',
      message: makeMessage({ dialogueId: 'only', priority: 'ambient' }),
    });
    const next = angieReducer(withMessage, { type: 'DISMISS_CURRENT' });
    expect(next.current).toBeNull();
    expect(next.mode).toBe('idle');
  });

  it('caps dialogue history at HISTORY_LIMIT entries', () => {
    let state = initialAngieState;
    for (let i = 0; i < HISTORY_LIMIT + 5; i += 1) {
      state = angieReducer(state, {
        type: 'ENQUEUE_MESSAGE',
        message: makeMessage({ dialogueId: `d${i}`, priority: 'ambient' }),
      });
      state = angieReducer(state, { type: 'DISMISS_CURRENT' });
    }
    expect(state.dialogueHistory.length).toBeLessThanOrEqual(HISTORY_LIMIT);
  });

  it('opens and closes the conversation panel', () => {
    const opened = angieReducer(initialAngieState, { type: 'OPEN_PANEL' });
    expect(opened.isPanelOpen).toBe(true);
    expect(opened.mode).toBe('expanded');
    const closed = angieReducer(opened, { type: 'CLOSE_PANEL' });
    expect(closed.isPanelOpen).toBe(false);
  });
});
