import { RotateCcw, Trophy } from 'lucide-react';
import { Badge, Button } from '../../design-system';
import type { QuizSessionResult } from './learningTypes';
import { difficultyLabels, modeLabels, scoreLabel } from './quizLabels';
import { useLanguage } from '../../hooks/useLanguage';

interface QuizResultsProps {
  history: QuizSessionResult[];
  onRestart: () => void;
  result: QuizSessionResult;
  saveStatus: 'saved' | 'error';
}

export function QuizResults({ history, onRestart, result, saveStatus }: QuizResultsProps) {
  const { t, language } = useLanguage('gamification');
  const ranking = [...history].sort((a, b) => (b.score / b.total) - (a.score / a.total)).slice(0, 5);
  return (
    <div className="quiz-grid">
      <section className="lab-panel">
        <div className="lab-panel-header">
          <div>
            <p className="as-eyebrow">{t('quiz.results')}</p>
            <h2>{scoreLabel(result.score, result.total)}</h2>
          </div>
          <Badge tone={saveStatus === 'saved' ? 'success' : 'error'}>
            {saveStatus === 'saved' ? t('quiz.saved') : t('quiz.saveError')}
          </Badge>
        </div>
        <div className="lab-panel-body">
          <div className="lab-readout-grid">
            <div className="lab-readout"><span>{t('quiz.scoreLabel')}</span><Badge tone="success">{result.score}/{result.total}</Badge></div>
            <div className="lab-readout"><span>{t('quiz.mode')}</span><Badge>{language === 'es' && result.mode === 'training' ? 'Entrenamiento' : language === 'es' ? 'Examen' : modeLabels[result.mode]}</Badge></div>
            <div className="lab-readout"><span>{t('quiz.difficulty')}</span><Badge>{language === 'es' && result.difficulty === 'easy' ? 'Fácil' : language === 'es' && result.difficulty === 'medium' ? 'Medio' : language === 'es' && result.difficulty === 'hard' ? 'Difícil' : difficultyLabels[result.difficulty]}</Badge></div>
            <div className="lab-readout"><span>{t('quiz.connection')}</span><Badge tone={result.offline ? 'warning' : 'success'}>{result.offline ? t('quiz.offline') : t('quiz.online')}</Badge></div>
          </div>
          <div className="quiz-correction-list">
            {result.answers.map((answer, index) => (
              <div className="quiz-correction-item" key={answer.questionId}>
                <strong>{index + 1}. {answer.prompt}</strong>
                <span>{t('quiz.yourAnswer')} {answer.selectedAnswer || t('quiz.none')}</span>
                <span>{t('quiz.correction')} {answer.correctAnswer}</span>
                <Badge tone={answer.isCorrect ? 'success' : 'error'}>
                  {answer.isCorrect ? t('quiz.correct') : t('quiz.toReview')}
                </Badge>
              </div>
            ))}
          </div>
          <Button iconLeft={<RotateCcw size={16} />} onClick={onRestart}>
            {t('quiz.newSession')}
          </Button>
        </div>
      </section>

      <section className="lab-panel">
        <div className="lab-panel-header">
          <div>
            <p className="as-eyebrow">{t('quiz.leaderboard')}</p>
            <h2>{t('quiz.localHistory')}</h2>
          </div>
          <Trophy size={20} aria-hidden="true" />
        </div>
        <div className="lab-panel-body">
          <div className="quiz-history-table">
            {ranking.length === 0 && <span>{t('quiz.noHistory')}</span>}
            {ranking.map((item, index) => (
              <div className="quiz-history-row" key={item.id}>
                <span>{index + 1}. {language === 'es' && item.mode === 'training' ? 'Entrenamiento' : language === 'es' ? 'Examen' : modeLabels[item.mode]} - {language === 'es' && item.difficulty === 'easy' ? 'Fácil' : language === 'es' && item.difficulty === 'medium' ? 'Medio' : language === 'es' && item.difficulty === 'hard' ? 'Difícil' : difficultyLabels[item.difficulty]}</span>
                <Badge tone="info">{item.score}/{item.total}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

