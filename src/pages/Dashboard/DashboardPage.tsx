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
  const metrics = getDashboardMetrics(profile, progress);
  const recentBadges = getRecentBadges(progress);
  const discoveries = getRecentDiscoveries(progress);

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="as-eyebrow">Accueil scientifique</p>
          <h2>Bienvenue, {metrics.username}</h2>
          <p>
            Pilote tes decouvertes, choisis ton prochain module et laisse Angie
            garder le cap pedagogique.
          </p>
        </div>
        <div className="dashboard-hero-actions">
          <Button onClick={() => onNavigate('table')} iconLeft={<Atom size={18} />}>
            Explorer les elements
          </Button>
          <Button
            onClick={() => onNavigate('quiz')}
            iconLeft={<BookOpen size={18} />}
            variant="outline"
          >
            Lancer un quiz
          </Button>
        </div>
      </section>

      <section className="dashboard-stat-grid" aria-label="Synthese">
        <StatCard icon={<Rocket />} label="Niveau" value={metrics.level} />
        <StatCard icon={<Sparkles />} label="Experience" value={`${metrics.xp} XP`} />
        <StatCard
          icon={<Atom />}
          label="Elements"
          value={`${metrics.discoveredCount}/${ELEMENT_TOTAL}`}
        />
        <StatCard icon={<Medal />} label="Badges" value={metrics.badgeCount} />
      </section>

      <div className="dashboard-grid">
        <Panel title="Progression generale">
          <div className="dashboard-progress-list">
            <ProgressBar
              label={`Niveau ${metrics.level} vers ${metrics.level + 1}`}
              max={XP_PER_LEVEL}
              value={metrics.xpInLevel}
            />
            <ProgressBar
              label="Elements decouverts"
              tone="success"
              value={metrics.elementPercent}
            />
            <ProgressBar
              label="Quetes completees"
              tone="warning"
              value={Math.min(metrics.questCount * 20, 100)}
            />
          </div>
          <p className="dashboard-note">
            Encore {metrics.nextLevelXp} XP avant le prochain niveau.
          </p>
        </Panel>

        <Panel title="Angie recommande">
          <div className="dashboard-recommendation">
            <Sparkles size={22} />
            <p>
              Commence par deux nouveaux elements, puis consolide avec un quiz
              court. Les reactions et les badges suivront naturellement.
            </p>
          </div>
          <Button onClick={() => onNavigate('fusion')} variant="soft">
            Preparer une reaction
          </Button>
        </Panel>
      </div>

      <section className="dashboard-section">
        <SectionHeader
          title="Activites recommandees"
          description="Des raccourcis vers les parcours principaux."
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
        <Panel title="Badges et decouvertes">
          {recentBadges.length || discoveries.length ? (
            <div className="dashboard-chip-list">
              {recentBadges.map((badge) => (
                <Badge key={badge} tone="warning">{badge}</Badge>
              ))}
              {discoveries.map((element) => (
                <Badge key={element} tone="info">{element}</Badge>
              ))}
            </div>
          ) : (
            <EmptyState icon={<Trophy />} title="Aucune recompense recente">
              Explore un module pour demarrer ton album scientifique.
            </EmptyState>
          )}
        </Panel>

        <Panel title="Objectifs suivants">
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
