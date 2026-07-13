import React from 'react';
import { useUserProgress } from '../UserProgressProvider';
import { useLanguage } from '../../hooks/useLanguage';
import { Trophy, Star, BookOpen, Lock } from 'lucide-react';
import { Badge } from '../../data/educational/models';

const BADGES: Badge[] = [
  { id: 'b1', nameFr: 'Apprenti Chimiste', nameEs: 'Aprendiz', descriptionFr: 'A découvert 5 éléments', descriptionEs: 'Descubrió 5 elementos', iconName: 'Star', rarity: 'common', conditionType: 'elements_discovered', conditionCount: 5 },
  { id: 'b2', nameFr: 'Seigneur de l\'Eau', nameEs: 'Señor del Agua', descriptionFr: 'A synthétisé H2O', descriptionEs: 'Sintetizó H2O', iconName: 'Flame', rarity: 'rare', conditionType: 'specific_reaction', conditionTarget: 'H2O', conditionCount: 1 },
];

export const DiscoveryAlbum: React.FC = () => {
  const { progress } = useUserProgress();
  const { language } = useLanguage();

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'var(--neon-magenta)';
      case 'epic': return 'var(--neon-purple)';
      case 'rare': return 'var(--neon-cyan)';
      default: return '#fff';
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
      <h2 style={{ fontFamily: 'var(--font-title)', color: 'var(--neon-green)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BookOpen size={24} />
        {language === 'fr' ? 'ALBUM DE DÉCOUVERTE' : 'ÁLBUM DE DESCUBRIMIENTO'}
      </h2>
      
      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {BADGES.map(badge => {
          const unlocked = progress?.unlockedBadges.includes(badge.id);
          return (
            <div key={badge.id} style={{
              padding: '16px',
              border: `1px solid ${unlocked ? getRarityColor(badge.rarity) : 'var(--glass-border)'}`,
              borderRadius: '8px',
              background: unlocked ? 'var(--bg-tertiary)' : 'rgba(0,0,0,0.5)',
              opacity: unlocked ? 1 : 0.5,
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px',
              boxShadow: unlocked ? `0 0 10px ${getRarityColor(badge.rarity)}` : 'none'
            }}>
              {unlocked ? <Trophy size={32} color={getRarityColor(badge.rarity)} /> : <Lock size={32} color="#666" />}
              <h3 style={{ fontSize: '14px', margin: 0, color: unlocked ? '#fff' : '#888' }}>
                {language === 'fr' ? badge.nameFr : badge.nameEs}
              </h3>
              <p style={{ fontSize: '11px', margin: 0, color: 'var(--text-secondary)' }}>
                {language === 'fr' ? badge.descriptionFr : badge.descriptionEs}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
