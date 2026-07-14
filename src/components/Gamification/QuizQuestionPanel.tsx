import { AlertCircle, CheckCircle, Clock, Lightbulb, StopCircle } from 'lucide-react';
import { Alert, Badge, Button, ProgressBar } from '../../design-system';
import type { LearningMode, QuizQuestion } from './learningTypes';
import { useLanguage } from '../../hooks/useLanguage';

interface QuizQuestionPanelProps {
  currentIndex: number;
  hintVisible: boolean;
  mode: LearningMode;
  onHint: () => void;
  onInterrupt: () => void;
  onNext: () => void;
  onSelect: (answer: string) => void;
  onValidate: () => void;
  question: QuizQuestion;
  questionsTotal: number;
  score: number;
  selectedAnswer: string | null;
  timeLeft: number;
  validated: boolean;
}

export function QuizQuestionPanel({
  currentIndex,
  hintVisible,
  mode,
  onHint,
  onInterrupt,
  onNext,
  onSelect,
  onValidate,
  question,
  questionsTotal,
  score,
  selectedAnswer,
  timeLeft,
  validated,
}: QuizQuestionPanelProps) {
  const { t } = useLanguage('gamification');
  const nearlyExpired = mode === 'exam' && timeLeft <= 10;
  const isCorrect = selectedAnswer === question.correctAnswer;
  return (
    <div className="quiz-grid">
      <section className="quiz-question-card">
        <div className="quiz-status-row">
          <Badge tone="info">{t('quiz.questionPrefix', { current: currentIndex + 1, total: questionsTotal })}</Badge>
          <Badge tone="success">{t('quiz.score', { score: score })}</Badge>
          {mode === 'exam' && (
            <Badge tone={nearlyExpired ? 'error' : 'warning'}>
              <Clock size={14} aria-hidden="true" /> {timeLeft}s
            </Badge>
          )}
        </div>
        <ProgressBar
          label={t('quiz.progress')}
          max={questionsTotal}
          value={currentIndex + (validated ? 1 : 0)}
        />
        <p className="as-eyebrow">{question.topic}</p>
        <h2>{question.prompt}</h2>
        {hintVisible && <Alert title={t('quiz.hint')} tone="info">{question.hint}</Alert>}
        {nearlyExpired && <Alert title={t('quiz.timeAlmostUp')} tone="error">{t('quiz.timeAlmostUpDesc')}</Alert>}
      </section>

      <section className="lab-panel">
        <div className="lab-panel-header">
          <div>
            <p className="as-eyebrow">{t('quiz.validationEyebrow')}</p>
            <h2>{t('quiz.answerChoice')}</h2>
          </div>
        </div>
        <div className="lab-panel-body">
          <div className="quiz-answer-grid">
            {question.options.map((answer) => {
              const state = getAnswerState(answer, question.correctAnswer, selectedAnswer, validated);
              return (
                <button
                  className="quiz-answer"
                  data-state={state}
                  disabled={validated}
                  key={answer}
                  onClick={() => onSelect(answer)}
                  type="button"
                >
                  {answer}
                </button>
              );
            })}
          </div>
          {validated && (
            <Alert title={isCorrect ? t('quiz.goodAnswer') : t('quiz.badAnswer')} tone={isCorrect ? 'success' : 'error'}>
              {isCorrect ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {question.explanation}
            </Alert>
          )}
          <div className="quiz-status-row">
            <Button iconLeft={<Lightbulb size={16} />} onClick={onHint} variant="outline">
              {t('quiz.hint')}
            </Button>
            <Button iconLeft={<StopCircle size={16} />} onClick={onInterrupt} variant="ghost">
              {t('quiz.interrupt')}
            </Button>
            <Button disabled={!selectedAnswer && !validated} onClick={validated ? onNext : onValidate} variant="solid">
              {validated ? t('quiz.next') : t('quiz.validate')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function getAnswerState(
  answer: string,
  correctAnswer: string,
  selectedAnswer: string | null,
  validated: boolean,
) {
  if (!validated && answer === selectedAnswer) return 'selected';
  if (!validated) return 'idle';
  if (answer === correctAnswer) return 'correct';
  if (answer === selectedAnswer) return 'wrong';
  return 'idle';
}

