import React from 'react';
import { Palette, Lock, CheckCircle, Star } from 'lucide-react';
import { useUserProgress } from './UserProgressProvider';
import { useLanguage } from '../hooks/useLanguage';
import { AudioManager } from '../services/Audio/AudioManager';

interface ThemeStoreModalProps {
  onClose: () => void;
}

export const ThemeStoreModal: React.FC<ThemeStoreModalProps> = ({ onClose }) => {
  const { profile, progress, unlockTheme, equipTheme } = useUserProgress();
  const { language } = useLanguage();

  const themes = [
    { id: 'default', nameFr: 'Néon Spatial', nameEs: 'Neón Espacial', cost: 0, descriptionFr: 'Le thème par défaut d\'Angie Scientific.', descriptionEs: 'El tema por defecto de Angie Scientific.', color: '#00f3ff' },
    { id: 'high-contrast', nameFr: 'Contraste Élevé', nameEs: 'Alto Contraste', cost: 0, descriptionFr: 'Thème accessible à fort contraste, sans flous.', descriptionEs: 'Tema accesible de alto contraste, sin desenfoques.', color: '#ff9900' },
    { id: 'cyberpunk', nameFr: 'Cyberpunk', nameEs: 'Cyberpunk', cost: 500, descriptionFr: 'Bienvenue dans le futur de la chimie.', descriptionEs: 'Bienvenido al futuro de la química.', color: '#39ff14' },
    { id: 'retro', nameFr: 'Moniteur Rétro', nameEs: 'Monitor Retro', cost: 500, descriptionFr: 'Pour les nostalgiques des vieux terminaux.', descriptionEs: 'Para los nostálgicos de las viejas terminales.', color: '#00ff00' }
  ];

  const unlocked = progress?.unlockedThemes || ['default', 'high-contrast'];
  const currentXP = progress?.experiencePoints || 0;
  const activeTheme = profile?.activeTheme || 'default';

  const handlePurchase = async (themeId: string, cost: number) => {
    AudioManager.getInstance().playClick();
    if (unlocked.includes(themeId)) {
      await equipTheme(themeId);
    } else {
      if (currentXP >= cost) {
        const success = await unlockTheme(themeId, cost);
        if (success) {
          await equipTheme(themeId);
        }
      } else {
        // Not enough XP
        AudioManager.getInstance().playError();
      }
    }
  };

  return (
    <div style={{
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
    aria-labelledby="theme-store-title"
    >
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '600px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 id="theme-store-title" className="app-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px' }}>
            <Palette size={20} color="var(--neon-cyan)" />
            {language === 'fr' ? 'Boutique de Thèmes' : 'Tienda de Temas'}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--neon-yellow)', fontFamily: 'var(--font-title)', fontWeight: 'bold' }}>
            <Star size={16} fill="currentColor" />
            {currentXP} XP
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '4px' }}>
          {themes.map(t => {
            const isUnlocked = unlocked.includes(t.id);
            const isActive = activeTheme === t.id;
            const canAfford = currentXP >= t.cost;

            return (
              <div key={t.id} style={{
                border: `1px solid ${isActive ? t.color : 'var(--glass-border)'}`,
                borderRadius: '8px',
                padding: '16px',
                background: isActive ? `rgba(255,255,255,0.05)` : 'rgba(0,0,0,0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: isActive ? `0 0 10px ${t.color}33` : 'none'
              }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '16px', color: t.color, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {language === 'fr' ? t.nameFr : t.nameEs}
                    {isActive && <CheckCircle size={14} color={t.color} />}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {language === 'fr' ? t.descriptionFr : t.descriptionEs}
                  </p>
                </div>

                <div>
                  {isActive ? (
                    <button className="btn" disabled style={{ background: 'transparent', color: t.color, border: `1px solid ${t.color}`, fontSize: '12px' }}>
                      {language === 'fr' ? 'ÉQUIPÉ' : 'EQUIPADO'}
                    </button>
                  ) : isUnlocked ? (
                    <button className="btn btn-primary" onClick={() => handlePurchase(t.id, 0)} style={{ fontSize: '12px', padding: '8px 16px', background: t.color, color: '#000', boxShadow: `0 0 10px ${t.color}88` }}>
                      {language === 'fr' ? 'ÉQUIPER' : 'EQUIPAR'}
                    </button>
                  ) : (
                    <button 
                      className="btn" 
                      onClick={() => handlePurchase(t.id, t.cost)}
                      disabled={!canAfford}
                      style={{ 
                        fontSize: '12px', 
                        padding: '8px 16px', 
                        background: canAfford ? 'var(--neon-yellow)' : 'var(--bg-tertiary)',
                        color: canAfford ? '#000' : 'var(--text-muted)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {canAfford ? null : <Lock size={12} />}
                      {t.cost} XP
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button 
          className="btn btn-outline" 
          onClick={onClose} 
          style={{ marginTop: '24px', alignSelf: 'flex-end' }}
        >
          {language === 'fr' ? 'Fermer' : 'Cerrar'}
        </button>
      </div>
    </div>
  );
};
