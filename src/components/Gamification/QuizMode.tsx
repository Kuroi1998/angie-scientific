import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Button } from '../../design-system';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import { writeStoredValue } from '../../utils/localStorage';
import { useMascot } from '../Mascot/useMascot';
import { RiddleMinigame } from './RiddleMinigame';
import { QuizQuestionPanel } from './QuizQuestionPanel';
import { QuizResults } from './QuizResults';
import { QuizSetup } from './QuizSetup';
import type {
  AnswerRecord,
  LearningDifficulty,
  LearningMode,
  QuizQuestion,
  QuizSessionResult,
} from './learningTypes';
import { isQuizSessionHistory } from './learningTypes';
import { examDuration, generateQuizQuestions } from './quizQuestionFactory';
import '../LabStation/lab-station.css';
import './quiz-mode.css';

type QuizView = 'setup' | 'questionnaire' | 'results' | 'riddles';

export const QuizMode: React.FC = () => {
  const { showMessage } = useMascot();
  const [history, setHistory] = useLocalStorageState<QuizSessionResult[]>(
    'quizHistory',
    [],
    { validate: isQuizSessionHistory },
  );
  const [view, setView] = useState<QuizView>('setup');
  const [mode, setMode] = useState<LearningMode>('training');
  const [difficulty, setDifficulty] = useState<LearningDifficulty>('easy');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(examDuration('easy'));
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [result, setResult] = useState<QuizSessionResult | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'error'>('saved');

  const score = answers.filter((answer) => answer.isCorrect).length;
  const currentQuestion = questions[currentIndex];
  const offline = typeof navigator !== 'undefined' && navigator.onLine === false;

  const finishSession = useCallback((interrupted: boolean) => {
    const nextResult: QuizSessionResult = {
      answers,
      createdAt: new Date().toISOString(),
      difficulty,
      durationSec: Math.round((Date.now() - startTime) / 1000),
      id: `quiz-${Date.now()}`,
      interrupted,
      mode,
      offline,
      score: answers.filter((answer) => answer.isCorrect).length,
      total: questions.length,
    };
    setResult(nextResult);
    setView('results');
    const nextHistory = [nextResult, ...history].slice(0, 12);
    const persisted = writeStoredValue('quizHistory', nextHistory);
    setHistory(nextHistory);
    setSaveStatus(persisted ? 'saved' : 'error');
    if (!interrupted && nextResult.score >= Math.ceil(nextResult.total * 0.8)) {
      showMessage('Excellent resultat, session maitrisee.', 4000, 'happy');
    }
  }, [answers, difficulty, history, mode, offline, questions.length, setHistory, showMessage, startTime]);

  useEffect(() => {
    if (view !== 'questionnaire' || mode !== 'exam' || validated) return undefined;
    if (timeLeft <= 0) {
      finishSession(true);
      return undefined;
    }
    const timer = window.setTimeout(() => setTimeLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [finishSession, mode, timeLeft, validated, view]);

  const startSession = () => {
    const nextQuestions = generateQuizQuestions(difficulty);
    setQuestions(nextQuestions);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setValidated(false);
    setHintVisible(false);
    setAnswers([]);
    setResult(null);
    setStartTime(Date.now());
    setTimeLeft(examDuration(difficulty));
    setView('questionnaire');
    showMessage(
      mode === 'exam'
        ? 'Examen lance : surveille le chronometre.'
        : 'Entrainement lance : prends le temps de lire les corrections.',
      3500,
      mode === 'exam' ? 'impressed' : 'happy',
    );
  };

  const validateAnswer = () => {
    if (!currentQuestion || !selectedAnswer) return;
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setAnswers((items) => [
      ...items,
      {
        correctAnswer: currentQuestion.correctAnswer,
        explanation: currentQuestion.explanation,
        isCorrect,
        prompt: currentQuestion.prompt,
        questionId: currentQuestion.id,
        selectedAnswer,
      },
    ]);
    setValidated(true);
    if (!isCorrect && mode === 'exam') setTimeLeft((value) => Math.max(0, value - 5));
  };

  const goNext = () => {
    if (currentIndex + 1 >= questions.length) {
      finishSession(false);
      return;
    }
    setCurrentIndex((value) => value + 1);
    setSelectedAnswer(null);
    setValidated(false);
    setHintVisible(false);
  };

  return (
    <div className="quiz-station">
      <header className="lab-station-header">
        <div>
          <p className="as-eyebrow">Academie scientifique</p>
          <h1>Quiz, devinettes et examens</h1>
          <p>Choisir un mode, valider les reponses, lire les corrections et suivre l'historique.</p>
        </div>
        <Badge tone={offline ? 'warning' : 'success'}>
          {offline ? 'Hors ligne' : 'Connecte'}
        </Badge>
      </header>

      {view === 'setup' && (
        <QuizSetup
          difficulty={difficulty}
          history={history}
          mode={mode}
          onDifficultyChange={setDifficulty}
          onModeChange={setMode}
          onOpenRiddles={() => setView('riddles')}
          onStart={startSession}
        />
      )}

      {view === 'riddles' && (
        <section className="lab-panel">
          <div className="lab-panel-header">
            <div>
              <p className="as-eyebrow">Devinettes</p>
              <h2>Enigme elementaire</h2>
            </div>
            <Button onClick={() => setView('setup')} size="sm" variant="outline">
              Retour
            </Button>
          </div>
          <div className="lab-panel-body">
            <RiddleMinigame />
          </div>
        </section>
      )}

      {view === 'questionnaire' && currentQuestion && (
        <QuizQuestionPanel
          currentIndex={currentIndex}
          hintVisible={hintVisible}
          mode={mode}
          onHint={() => setHintVisible(true)}
          onInterrupt={() => finishSession(true)}
          onNext={goNext}
          onSelect={setSelectedAnswer}
          onValidate={validateAnswer}
          question={currentQuestion}
          questionsTotal={questions.length}
          score={score}
          selectedAnswer={selectedAnswer}
          timeLeft={timeLeft}
          validated={validated}
        />
      )}

      {view === 'results' && result && (
        <QuizResults
          history={history}
          onRestart={() => setView('setup')}
          result={result}
          saveStatus={saveStatus}
        />
      )}
    </div>
  );
};
