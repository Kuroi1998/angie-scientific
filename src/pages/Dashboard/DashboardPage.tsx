import {
  Atom,
  BookOpen,
  FlaskConical,
  Medal,
  Rocket,
  Sparkles,
  Trophy,
} from 'lucide-react';
import type { TabType } from '../../app/appTypes';
import type { UserProfile, UserProgress } from '../../data/educational/models';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Panel,
  ProgressBar,
  SectionHeader,
} from '../../design-system';
import { useLanguage } from '../../hooks/useLanguage';
import { useUserProgress } from '../../components/useUserProgress';
import { dashboardActions, nextObjectives } from './dashboardContent';
import {
  ELEMENT_TOTAL,
  XP_PER_LEVEL,
  getDashboardMetrics,
  getRecentBadges,
  getRecentDiscoveries,
} from './dashboardModel';
import './dashboard.css';

interface DashboardPageProps {
  onNavigate: (tab: TabType) => void;
}

interface DashboardContentProps extends DashboardPageProps {
  profile: UserProfile | null;
  progress: UserProgress | null;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { profile, progress } = useUserProgress();
  return (
    <DashboardContent
      onNavigate={onNavigate}
      profile={profile}
      progress={progress}
    />
  );
}

export function DashboardContent({
  onNavigate,
  profile,
  progress,
}: DashboardContentProps) {
  const { t } = useLanguage('dashboard');
  const metrics = getDashboardMetrics(profile, progress);
  const recentBadges = getRecentBadges(progress);
  const discoveries = getRecentDiscoveries(progress);

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="as-eyebrow">{t('title')}</p>
          <h2>{t('welcome', { username: metrics.username })}</h2>
          <p>{t('subtitle')}</p>
        </div>
        <div className="dashboard-hero-actions">
          <Button onClick={() => onNavigate('table')} iconLeft={<Atom size={18} />}>
            {t('explore')}
          </Button>
          <Button
            onClick={() => onNavigate('quiz')}
            iconLeft={<BookOpen size={18} />}
            variant="outline"
          >
            {t('quiz')}
          </Button>
        </div>
      </section>

      <section className="dashboard-stat-grid" aria-label="Synthese">
        <StatCard icon={<Rocket />} label={t('stats.level')} value={metrics.level} />
        <StatCard icon={<Sparkles />} label={t('stats.xp')} value={`${metrics.xp} XP`} />
        <StatCard
          icon={<Atom />}
          label={t('stats.elements')}
          value={`${metrics.discoveredCount}/${ELEMENT_TOTAL}`}
        />
        <StatCard icon={<Medal />} label={t('stats.badges')} value={metrics.badgeCount} />
      </section>

      <div className="dashboard-grid">
        <Panel title={t('progress')}>
          <div className="dashboard-progress-list">
            <ProgressBar
              label={t('stats.level')}
              max={XP_PER_LEVEL}
              value={metrics.xpInLevel}
            />
            <ProgressBar
              label={t('stats.elements')}
              tone="success"
              value={metrics.elementPercent}
            />
            <ProgressBar
              label={t('stats.quests')}
              tone="warning"
              value={Math.min(metrics.questCount * 20, 100)}
            />
          </div>
          <p className="dashboard-note">
            {t('nextLevel', { xp: metrics.nextLevelXp })}
          </p>
        </Panel>

        <Panel title={t('recommendation')}>
          <div className="dashboard-recommendation">
            <Sparkles size={22} />
            <p>{t('recommendationBody')}</p>
          </div>
          <Button onClick={() => onNavigate('fusion')} variant="soft">
            {t('recommendationAction')}
          </Button>
        </Panel>
      </div>

      <section className="dashboard-section">
        <SectionHeader
          title={t('actionsTitle')}
          description={t('actionsSubtitle')}
        />
        <div className="dashboard-action-grid">
          {dashboardActions.map((action) => (
            <Card interactive key={action.id}>
              <h3>{action.title}</h3>
              <p>{action.body}</p>
              <Button onClick={() => onNavigate(action.tab)} size="sm" variant="outline">
                {action.label}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <div className="dashboard-grid">
        <Panel title={t('badgesTitle')}>
          {recentBadges.length > 0 ? (
            <div className="dashboard-chip-list">
              {recentBadges.map((badge) => (
                <Badge key={badge} tone="warning">{badge}</Badge>
              ))}
            </div>
          ) : (
            <EmptyState icon={<Trophy />} title={t('badgesEmpty')}>
              {t('badgesEmptySub')}
            </EmptyState>
          )}
        </Panel>

        <Panel title={t('objectivesTitle')}>
          <ol className="dashboard-objectives">
            {nextObjectives.map((objective) => (
              <li key={objective}>
                <FlaskConical size={17} aria-hidden="true" />
                <span>{objective}</span>
              </li>
            ))}
          </ol>
          <p className="dashboard-note">
            Reactions reussies : {metrics.reactionCount}. Devinettes resolues :
            {' '}{metrics.solvedRiddleCount}.
          </p>
        </Panel>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Card className="dashboard-stat-card">
      <span aria-hidden="true">{icon}</span>
      <div>
        <strong>{value}</strong>
        <p>{label}</p>
      </div>
    </Card>
  );
}
