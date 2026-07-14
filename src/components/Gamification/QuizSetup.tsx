import { Brain, GraduationCap, HelpCircle } from 'lucide-react';
import { Badge, Button, Select } from '../../design-system';
import type { LearningDifficulty, LearningMode, QuizSessionResult } from './learningTypes';
import { difficultyLabels, modeLabels } from './quizLabels';
import { examDuration, questionCount } from './quizQuestionFactory';
import { useLanguage } from '../../hooks/useLanguage';

interface QuizSetupProps {
  difficulty: LearningDifficulty;
  history: QuizSessionResult[];
  mode: LearningMode;
  onDifficultyChange: (difficulty: LearningDifficulty) => void;
  onModeChange: (mode: LearningMode) => void;
  onOpenRiddles: () => void;
  onStart: () => void;
}

export function QuizSetup({
  difficulty,
  history,
  mode,
  onDifficultyChange,
  onModeChange,
  onOpenRiddles,
  onStart,
}: QuizSetupProps) {
  const { t, language } = useLanguage('gamification');
  const latest = history[0];
  return (
    <div className="quiz-grid">
      <section className="lab-panel">
        <div className="lab-panel-header">
          <div>
            <p className="as-eyebrow">{t('quiz.setupEyebrow')}</p>
            <h2>{t('quiz.setupTitle')}</h2>
          </div>
        </div>
        <div className="lab-panel-body">
          <div className="quiz-card-list">
            {(['training', 'exam'] as LearningMode[]).map((item) => (
              <button
                className="quiz-mode-card"
                data-selected={mode === item}
                key={item}
                onClick={() => onModeChange(item)}
                type="button"
              >
                <strong>{language === 'es' && item === 'training' ? 'Entrenamiento' : language === 'es' ? 'Examen' : modeLabels[item]}</strong>
                <span>
                  {item === 'training'
                    ? t('quiz.modeTrainingDesc')
                    : t('quiz.modeExamDesc')}
                </span>
              </button>
            ))}
            <button className="quiz-mode-card" onClick={onOpenRiddles} type="button">
              <strong>{t('quiz.riddlesEyebrow')}</strong>
              <span>{t('quiz.riddleDesc')}</span>
            </button>
          </div>
          <Select
            label={t('quiz.difficulty')}
            onChange={(event) => onDifficultyChange(event.target.value as LearningDifficulty)}
            options={[
              { label: language === 'es' ? 'Fácil' : difficultyLabels.easy, value: 'easy' },
              { label: language === 'es' ? 'Medio' : difficultyLabels.medium, value: 'medium' },
              { label: language === 'es' ? 'Difícil' : difficultyLabels.hard, value: 'hard' },
            ]}
            value={difficulty}
          />
          <Button iconLeft={<Brain size={16} />} onClick={onStart}>
            {t('quiz.start')}
          </Button>
        </div>
      </section>

      <section className="lab-panel">
        <div className="lab-panel-header">
          <div>
            <p className="as-eyebrow">{t('quiz.previewEyebrow')}</p>
            <h2>{t('quiz.previewTitle')}</h2>
          </div>
          <Badge tone={mode === 'exam' ? 'warning' : 'info'}>
            {language === 'es' && mode === 'training' ? 'Entrenamiento' : language === 'es' ? 'Examen' : modeLabels[mode]}
          </Badge>
        </div>
        <div className="lab-panel-body">
          <div className="lab-readout-grid">
            <div className="lab-readout"><span>{t('quiz.questions')}</span><Badge>{questionCount(difficulty)}</Badge></div>
            <div className="lab-readout"><span>{t('quiz.time')}</span><Badge>{mode === 'exam' ? `${examDuration(difficulty)}s` : t('quiz.timeFree')}</Badge></div>
            <div className="lab-readout"><span>{t('quiz.lastScore')}</span><Badge tone="success">{latest ? `${latest.score}/${latest.total}` : '--'}</Badge></div>
          </div>
          <div className="quiz-feedback">
            <strong><GraduationCap size={16} aria-hidden="true" /> {t('quiz.objective')}</strong>
            <span>{t('quiz.objectiveDesc')}</span>
          </div>
          <div className="quiz-feedback">
            <strong><HelpCircle size={16} aria-hidden="true" /> {t('quiz.statesCovered')}</strong>
            <span>{t('quiz.statesCoveredDesc')}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

