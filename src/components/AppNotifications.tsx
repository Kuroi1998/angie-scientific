import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { IconButton, Toast } from '../design-system';
import {
  appNotificationEvent,
  type AppNotificationPayload,
} from '../utils/appNotifications';

interface NotificationItem extends AppNotificationPayload {
  id: number;
}

export function AppNotifications() {
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const addNotification = (event: Event) => {
      const detail = (event as CustomEvent<AppNotificationPayload>).detail;
      const id = Date.now();
      setItems((current) => [...current.slice(-2), { ...detail, id }]);
      window.setTimeout(() => {
        setItems((current) => current.filter((item) => item.id !== id));
      }, 6500);
    };
    window.addEventListener(appNotificationEvent, addNotification);
    return () => window.removeEventListener(appNotificationEvent, addNotification);
  }, []);

  const dismiss = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  if (items.length === 0) return null;

  return (
    <div className="as-toast-viewport app-notification-viewport">
      {items.map((item) => (
        <Toast
          action={(
            <IconButton
              icon={<X size={15} />}
              label="Fermer la notification"
              onClick={() => dismiss(item.id)}
              size="sm"
            />
          )}
          className="as-toast-floating"
          key={item.id}
          title={item.title}
          tone={item.tone ?? 'info'}
        >
          {item.message}
        </Toast>
      ))}
    </div>
  );
}
