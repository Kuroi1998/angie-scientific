import { Lock, Trophy } from 'lucide-react';
import { Badge, Panel } from '../../design-system';
import { QuestSystem } from '../Gamification/QuestSystem';
import { useUserProgress } from '../useUserProgress';
import { useLanguage } from '../../hooks/useLanguage';
import { badgeCatalog, rarityTone } from './userCenterData';
import { latestItems } from './userCenterModel';

export function UserAlbumPanel() {
  const { t } = useLanguage('user');
  const { progress } = useUserProgress();
  const discovered = latestItems(progress?.discoveredElements, 12);
  const unlockedBadges = progress?.unlockedBadges ?? [];

  return (
    <div className="user-center-grid">
      <Panel title={t('album.title')}>
        <div className="user-album-grid">
          {badgeCatalog.map((badge) => {
            const unlocked = unlockedBadges.includes(badge.id);
            return (
              <article className="user-badge-card" data-unlocked={unlocked} key={badge.id}>
                {unlocked ? <Trophy size={26} aria-hidden="true" /> : <Lock size={26} aria-hidden="true" />}
                <strong>{t('language') === 'es' && badge.nameEs ? badge.nameEs : badge.nameFr}</strong>
                <p className="user-muted">{t('language') === 'es' && badge.descriptionEs ? badge.descriptionEs : badge.descriptionFr}</p>
                <Badge tone={rarityTone(badge.rarity)}>
                  {unlocked ? t('album.unlocked') : `${badge.conditionCount} ${t('album.required')}`}
                </Badge>
              </article>
            );
          })}
        </div>
        <div className="user-activity-card">
          <strong>{t('album.recentElements')}</strong>
          {discovered.length ? (
            <div className="user-chip-list">
              {discovered.map((element) => <Badge key={element} tone="info">{element}</Badge>)}
            </div>
          ) : (
            <p className="user-muted">{t('album.noElements')}</p>
          )}
        </div>
      </Panel>
      <QuestSystem />
    </div>
  );
}
