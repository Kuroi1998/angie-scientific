import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';
import { Button, IconButton, Toast } from '../design-system';
import { useLanguage } from '../hooks/useLanguage';

export function ReloadPrompt() {
  const { t } = useLanguage('common');
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      if (registration) console.log('SW Registered');
    },
    onRegisterError(error) {
      if (error) console.error('SW registration error');
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="as-toast-viewport">
      <Toast
        action={(
          <div className="as-toast-actions">
            {needRefresh && (
              <Button
                iconLeft={<RefreshCw size={14} />}
                onClick={() => updateServiceWorker(true)}
                size="sm"
              >
                {t('pwa.reload')}
              </Button>
            )}
            <IconButton
              icon={<X size={15} />}
              label={t('pwa.close')}
              onClick={close}
              size="sm"
            />
          </div>
        )}
        className="as-toast-floating"
        title={needRefresh ? t('pwa.updateAvailable') : t('pwa.offlineReady')}
        tone={needRefresh ? 'warning' : 'success'}
      >
        {needRefresh
          ? t('pwa.updateDesc')
          : t('pwa.offlineDesc')}
      </Toast>
    </div>
  );
}
