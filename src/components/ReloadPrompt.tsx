import { useRegisterSW } from 'virtual:pwa-register/react'
import { RefreshCw, X } from 'lucide-react'

export const ReloadPrompt = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) console.log('SW Registered')
    },
    onRegisterError(error) {
      if (error) console.error('SW registration error')
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  if (!offlineReady && !needRefresh) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '16px',
      background: 'var(--bg-tertiary)',
      border: '1px solid var(--neon-cyan)',
      borderRadius: '8px',
      boxShadow: 'var(--glow-cyan)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      fontFamily: 'var(--font-body)',
      color: '#fff',
      maxWidth: '300px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, color: 'var(--neon-cyan)', fontFamily: 'var(--font-title)' }}>
          {needRefresh ? 'Mise à jour disponible !' : 'Prêt hors ligne !'}
        </h4>
        <button onClick={close} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={16} />
        </button>
      </div>
      <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
        {needRefresh
          ? 'Une nouvelle version de l\'Académie Scientifique est disponible. Rechargez pour mettre à jour.'
          : 'L\'application est maintenant installée en cache et fonctionne sans connexion internet.'}
      </p>
      {needRefresh && (
        <button
          onClick={() => updateServiceWorker(true)}
          className="btn btn-primary hover-lift"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <RefreshCw size={14} />
          RECHARGER
        </button>
      )}
    </div>
  )
}
