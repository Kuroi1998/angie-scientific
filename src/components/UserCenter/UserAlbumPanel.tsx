import { Lock, Trophy } from 'lucide-react';
import { Badge, Panel } from '../../design-system';
import { QuestSystem } from '../Gamification/QuestSystem';
import { useUserProgress } from '../useUserProgress';
import { badgeCatalog, rarityTone } from './userCenterData';
import { latestItems } from './userCenterModel';

export function UserAlbumPanel() {
  const { progress } = useUserProgress();
  const discovered = latestItems(progress?.discoveredElements, 12);
  const unlockedBadges = progress?.unlockedBadges ?? [];

  return (
    <div className="user-center-grid">
      <Panel title="Album de decouvertes">
        <div className="user-album-grid">
          {badgeCatalog.map((badge) => {
            const unlocked = unlockedBadges.includes(badge.id);
            return (
              <article className="user-badge-card" data-unlocked={unlocked} key={badge.id}>
                {unlocked ? <Trophy size={26} aria-hidden="true" /> : <Lock size={26} aria-hidden="true" />}
                <strong>{badge.nameFr}</strong>
                <p className="user-muted">{badge.descriptionFr}</p>
                <Badge tone={rarityTone(badge.rarity)}>
                  {unlocked ? 'Debloque' : `${badge.conditionCount} requis`}
                </Badge>
              </article>
            );
          })}
        </div>
        <div className="user-activity-card">
          <strong>Elements recents</strong>
          {discovered.length ? (
            <div className="user-chip-list">
              {discovered.map((element) => <Badge key={element} tone="info">{element}</Badge>)}
            </div>
          ) : (
            <p className="user-muted">Aucun element decouvert pour le moment.</p>
          )}
        </div>
      </Panel>
      <QuestSystem />
    </div>
  );
}
