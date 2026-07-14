import { AlertCircle, CheckCircle, Clock, Lightbulb, StopCircle } from 'lucide-react';
import { Alert, Badge, Button, ProgressBar } from '../../design-system';
import type { LearningMode, QuizQuestion } from './learningTypes';

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
  const nearlyExpired = mode === 'exam' && timeLeft <= 10;
  const isCorrect = selectedAnswer === question.correctAnswer;
  return (
    <div className="quiz-grid">
      <section className="quiz-question-card">
        <div className="quiz-status-row">
          <Badge tone="info">Question {currentIndex + 1}/{questionsTotal}</Badge>
          <Badge tone="success">Score {score}</Badge>
          {mode === 'exam' && (
            <Badge tone={nearlyExpired ? 'error' : 'warning'}>
              <Clock size={14} aria-hidden="true" /> {timeLeft}s
            </Badge>
          )}
        </div>
        <ProgressBar
          label="Progression"
          max={questionsTotal}
          value={currentIndex + (validated ? 1 : 0)}
        />
        <p className="as-eyebrow">{question.topic}</p>
        <h2>{question.prompt}</h2>
        {hintVisible && <Alert title="Indice" tone="info">{question.hint}</Alert>}
        {nearlyExpired && <Alert title="Temps presque ecoule" tone="error">Validez vite ou la session sera interrompue.</Alert>}
      </section>

      <section className="lab-panel">
        <div className="lab-panel-header">
          <div>
            <p className="as-eyebrow">Validation</p>
            <h2>Choix de reponse</h2>
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
            <Alert title={isCorrect ? 'Bonne reponse' : 'Mauvaise reponse'} tone={isCorrect ? 'success' : 'error'}>
              {isCorrect ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {question.explanation}
            </Alert>
          )}
          <div className="quiz-status-row">
            <Button iconLeft={<Lightbulb size={16} />} onClick={onHint} variant="outline">
              Indice
            </Button>
            <Button iconLeft={<StopCircle size={16} />} onClick={onInterrupt} variant="ghost">
              Interrompre
            </Button>
            {validated ? (
              <Button onClick={onNext}>Continuer</Button>
            ) : (
              <Button disabled={!selectedAnswer} onClick={onValidate}>Valider</Button>
            )}
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

