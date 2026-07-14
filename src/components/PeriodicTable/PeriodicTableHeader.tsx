import { Database, FlaskConical, Trophy } from 'lucide-react';
import { Badge, Button } from '../../design-system';

import { useLanguage } from '../../hooks/useLanguage';

interface PeriodicTableHeaderProps {
  discoveredCount: number;
  mode: 'explore' | 'quiz';
  onToggleMode: () => void;
  totalElements: number;
}

export function PeriodicTableHeader({
  discoveredCount,
  mode,
  onToggleMode,
  totalElements,
}: PeriodicTableHeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="pt-header">
      <div>
        <p className="as-eyebrow">{t('header.eyebrow', { ns: 'periodicTable' })}</p>
        <h2>{t('header.title', { ns: 'periodicTable' })}</h2>
        <p>
          {t('header.description', { ns: 'periodicTable' })}
        </p>
      </div>
      <div className="pt-header-meta">
        <Badge tone="info">{t('header.discovered', { ns: 'periodicTable', count: discoveredCount, total: totalElements })}</Badge>
        <Badge tone="success">
          <Database size={13} /> {t('header.sync', { ns: 'periodicTable' })}
        </Badge>
        <Button
          iconLeft={mode === 'quiz' ? <Trophy size={16} /> : <FlaskConical size={16} />}
          onClick={onToggleMode}
          variant={mode === 'quiz' ? 'solid' : 'outline'}
        >
          {mode === 'quiz' ? t('header.quizActive', { ns: 'periodicTable' }) : t('header.quiz', { ns: 'periodicTable' })}
        </Button>
      </div>
    </header>
  );
}
