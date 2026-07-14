import type { AsTone } from '../design-system/types';

export const appNotificationEvent = 'angie:notification';

export interface AppNotificationPayload {
  message: string;
  title?: string;
  tone?: AsTone;
}

export function notifyApp(payload: AppNotificationPayload) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<AppNotificationPayload>(
    appNotificationEvent,
    { detail: payload },
  ));
}
