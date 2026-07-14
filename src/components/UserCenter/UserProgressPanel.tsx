import type { ReactNode } from 'react';
import { Atom, FlaskConical, HelpCircle, Medal, Rocket } from 'lucide-react';
import { Badge, Card, Panel, ProgressBar } from '../../design-system';
import { ELEMENT_TOTAL, XP_PER_LEVEL } from '../../pages/Dashboard/dashboardModel';
import { useUserProgress } from '../useUserProgress';
import { getUserMetrics, latestItems } from './userCenterModel';

export function UserProgressPanel() {
  const { profile, progress } = useUserProgress();
  const metrics = getUserMetrics(profile, progress);
  const discoveries = latestItems(progress?.discoveredElements);
  const reactions = latestItems(progress?.successfulReactions, 4);

  return (
    <div className="user-center-grid">
      <Panel title="Progression generale">
        <div className="user-stat-grid">
          <StatCard icon={<Rocket />} label="Niveau" value={metrics.level} />
          <StatCard icon={<Atom />} label="Elements" value={`${metrics.discoveredCount}/${ELEMENT_TOTAL}`} />
          <StatCard icon={<Medal />} label="Badges" value={metrics.badgeCount} />
          <StatCard icon={<FlaskConical />} label="Reactions" value={metrics.reactionCount} />
        </div>
        <ProgressBar label={`Niveau ${metrics.level}`} max={XP_PER_LEVEL} value={metrics.xpInLevel} />
        <ProgressBar label="Album des elements" tone="success" value={metrics.elementPercent} />
        <ProgressBar label="Quetes completees" tone="warning" value={Math.min(metrics.questCount * 20, 100)} />
        <p className="user-muted">Encore {metrics.nextLevelXp} XP avant le niveau suivant.</p>
      </Panel>

      <Panel title="Historique recent">
        <div className="user-activity-card">
          <strong><Atom size={18} aria-hidden="true" /> Derniers elements</strong>
          <ChipList empty="Aucun element recent" items={discoveries} tone="info" />
        </div>
        <div className="user-activity-card">
          <strong><FlaskConical size={18} aria-hidden="true" /> Reactions reussies</strong>
          <ChipList empty="Aucune reaction sauvegardee" items={reactions} tone="success" />
        </div>
        <div className="user-activity-card">
          <strong><HelpCircle size={18} aria-hidden="true" /> Devinettes</strong>
          <Badge tone="warning">{metrics.riddleCount} resolues</Badge>
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
