import type { MessagePriority } from '../state/angie.types';

export interface TriggerDefinition {
  /** Matches a "category.situation" key in the dialogue registry. */
  key: string;
  priority: MessagePriority;
  cooldownMs: number;
  durationMs: number;
  dismissible?: boolean;
}
