import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';
import { Button, IconButton, Toast } from '../design-system';

export function ReloadPrompt() {
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
                Recharger
              </Button>
            )}
            <IconButton
              icon={<X size={15} />}
              label="Fermer la notification"
              onClick={close}
              size="sm"
            />
          </div>
        )}
        className="as-toast-floating"
        title={needRefresh ? 'Mise a jour disponible' : 'Pret hors ligne'}
        tone={needRefresh ? 'warning' : 'success'}
      >
        {needRefresh
          ? "Une nouvelle version d'Angie Scientific est disponible."
          : "L'application est installee en cache et fonctionne sans connexion."}
      </Toast>
    </div>
  );
}
