import type { ReactNode } from 'react';
import { Atom, FlaskConical, HelpCircle, Medal, Rocket } from 'lucide-react';
import { Badge, Card, Panel, ProgressBar } from '../../design-system';
import { ELEMENT_TOTAL, XP_PER_LEVEL } from '../../pages/Dashboard/dashboardModel';
import { useUserProgress } from '../useUserProgress';
import { useLanguage } from '../../hooks/useLanguage';
import { getUserMetrics, latestItems } from './userCenterModel';

export function UserProgressPanel() {
  const { t } = useLanguage('user');
  const { profile, progress } = useUserProgress();
  const metrics = getUserMetrics(profile, progress);
  const discoveries = latestItems(progress?.discoveredElements);
  const reactions = latestItems(progress?.successfulReactions, 4);

  return (
    <div className="user-center-grid">
      <Panel title={t('progress.global')}>
        <div className="user-stat-grid">
          <StatCard icon={<Rocket />} label={t('progress.level')} value={metrics.level} />
          <StatCard icon={<Atom />} label={t('progress.elements')} value={`${metrics.discoveredCount}/${ELEMENT_TOTAL}`} />
          <StatCard icon={<Medal />} label={t('progress.badges')} value={metrics.badgeCount} />
          <StatCard icon={<FlaskConical />} label={t('progress.reactions')} value={metrics.reactionCount} />
        </div>
        <ProgressBar label={`${t('progress.level')} ${metrics.level}`} max={XP_PER_LEVEL} value={metrics.xpInLevel} />
        <ProgressBar label={t('progress.elementAlbum')} tone="success" value={metrics.elementPercent} />
        <ProgressBar label={t('progress.questsCompleted')} tone="warning" value={Math.min(metrics.questCount * 20, 100)} />
        <p className="user-muted">{t('progress.nextLevel', { xp: metrics.nextLevelXp })}</p>
      </Panel>

      <Panel title={t('progress.recentHistory')}>
        <div className="user-activity-card">
          <strong><Atom size={18} aria-hidden="true" /> {t('progress.lastElements')}</strong>
          <ChipList empty={t('progress.noRecentElements')} items={discoveries} tone="info" />
        </div>
        <div className="user-activity-card">
          <strong><FlaskConical size={18} aria-hidden="true" /> {t('progress.successfulReactions')}</strong>
          <ChipList empty={t('progress.noReactions')} items={reactions} tone="success" />
        </div>
        <div className="user-activity-card">
          <strong><HelpCircle size={18} aria-hidden="true" /> {t('progress.riddles')}</strong>
          <Badge tone="warning">{metrics.riddleCount} {t('progress.solved')}</Badge>
        </div>
      </Panel>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <Card className="user-stat-card">
      <span aria-hidden="true">{icon}</span>
      <strong>{value}</strong>
      <p className="user-muted">{label}</p>
    </Card>
  );
}

function ChipList({ empty, items, tone }: { empty: string; items: string[]; tone: 'info' | 'success' }) {
  if (!items.length) return <p className="user-muted">{empty}</p>;
  return (
    <div className="user-chip-list">
      {items.map((item) => <Badge key={item} tone={tone}>{item}</Badge>)}
    </div>
  );
}
