import React from 'react';
import { Settings, Volume2, VolumeX, Globe, MonitorOff, Monitor, LogOut, RotateCcw } from 'lucide-react';
import { useUserProgress } from './UserProgressProvider';
import { useLanguage } from '../hooks/useLanguage';
import { AudioManager } from '../services/Audio/AudioManager';
import { removeUserId } from '../api/progress';
import { clearAllStoredValues } from '../utils/localStorage';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { profile, saveProfile } = useUserProgress();
  const { language, setLanguage } = useLanguage();

  const handleToggleSound = () => {
    if (profile) {
      AudioManager.getInstance().playClick();
      saveProfile({ globalSoundEnabled: !profile.globalSoundEnabled });
    }
  };

  const handleToggleLanguage = () => {
    AudioManager.getInstance().playClick();
    if (language === 'fr') setLanguage('es');
    else setLanguage('fr');
  };

  const handleToggleReducedMotion = () => {
    if (profile) {
      AudioManager.getInstance().playClick();
      saveProfile({ reducedMotion: !profile.reducedMotion });
    }
  };

  const handleLogout = () => {
    removeUserId();
    window.location.reload();
  };

  const handleResetAllData = () => {
    const confirmed = window.confirm(
      language === 'fr'
        ? 'Réinitialiser toutes les données locales (langue, progression des quêtes, historique de recherche, expériences complétées) ? Cette action est irréversible.'
        : '¿Restablecer todos los datos locales (idioma, progreso de misiones, historial de búsqueda, experimentos completados)? Esta acción es irreversible.'
    );
    if (!confirmed) return;
    clearAllStoredValues();
    removeUserId();
    window.location.reload();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div className="glass-panel modal-anim" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h2 id="settings-title" className="app-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px' }}>
          <Settings size={20} color="var(--neon-cyan)" />
          {language === 'fr' ? 'Paramètres' : 'Configuración'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            className="btn btn-outline" 
            onClick={handleToggleSound}
            style={{ justifyContent: 'space-between', width: '100%' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {profile?.globalSoundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              {language === 'fr' ? 'Effets Sonores' : 'Efectos de Sonido'}
            </span>
            <span style={{ color: profile?.globalSoundEnabled ? 'var(--neon-green)' : 'var(--text-muted)' }}>
              {profile?.globalSoundEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          <button 
            className="btn btn-outline" 
            onClick={handleToggleLanguage}
            style={{ justifyContent: 'space-between', width: '100%' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={16} />
              {language === 'fr' ? 'Langue' : 'Idioma'}
            </span>
            <span style={{ color: 'var(--neon-cyan)' }}>
              {language === 'fr' ? 'FRANÇAIS' : 'ESPAÑOL'}
            </span>
          </button>

          <button 
            className="btn btn-outline" 
            onClick={handleToggleReducedMotion}
            style={{ justifyContent: 'space-between', width: '100%' }}
            aria-pressed={profile?.reducedMotion}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {profile?.reducedMotion ? <MonitorOff size={16} /> : <Monitor size={16} />}
              {language === 'fr' ? 'Mouvements Réduits' : 'Movimiento Reducido'}
            </span>
            <span style={{ color: profile?.reducedMotion ? 'var(--neon-yellow)' : 'var(--text-muted)' }}>
              {profile?.reducedMotion ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '10px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            className="btn btn-danger-outline" 
            onClick={handleLogout}
            style={{ justifyContent: 'center', width: '100%' }}
          >
            <LogOut size={14} />
            {language === 'fr' ? "DÉCONNEXION" : "SALIR"}
          </button>

          <button 
            className="btn btn-danger-ghost" 
            onClick={handleResetAllData}
            style={{ justifyContent: 'center', width: '100%' }}
          >
            <RotateCcw size={14} />
            {language === 'fr' ? 'RÉINITIALISER LES DONNÉES' : 'RESTABLECER DATOS'}
          </button>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={onClose} 
          style={{ marginTop: '10px', width: '100%' }}
        >
          {language === 'fr' ? 'Fermer' : 'Cerrar'}
        </button>
      </div>
    </div>
  );
};
