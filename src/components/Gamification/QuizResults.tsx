import { RotateCcw, Trophy } from 'lucide-react';
import { Badge, Button } from '../../design-system';
import type { QuizSessionResult } from './learningTypes';
import { difficultyLabels, modeLabels, scoreLabel } from './quizLabels';

interface QuizResultsProps {
  history: QuizSessionResult[];
  onRestart: () => void;
  result: QuizSessionResult;
  saveStatus: 'saved' | 'error';
}

export function QuizResults({ history, onRestart, result, saveStatus }: QuizResultsProps) {
  const ranking = [...history].sort((a, b) => (b.score / b.total) - (a.score / a.total)).slice(0, 5);
  return (
    <div className="quiz-grid">
      <section className="lab-panel">
        <div className="lab-panel-header">
          <div>
            <p className="as-eyebrow">Resultats</p>
            <h2>{scoreLabel(result.score, result.total)}</h2>
          </div>
          <Badge tone={saveStatus === 'saved' ? 'success' : 'error'}>
            {saveStatus === 'saved' ? 'Resultat enregistre' : "Erreur d'enregistrement"}
          </Badge>
        </div>
        <div className="lab-panel-body">
          <div className="lab-readout-grid">
            <div className="lab-readout"><span>Score</span><Badge tone="success">{result.score}/{result.total}</Badge></div>
            <div className="lab-readout"><span>Mode</span><Badge>{modeLabels[result.mode]}</Badge></div>
            <div className="lab-readout"><span>Difficulte</span><Badge>{difficultyLabels[result.difficulty]}</Badge></div>
            <div className="lab-readout"><span>Connexion</span><Badge tone={result.offline ? 'warning' : 'success'}>{result.offline ? 'Hors ligne' : 'En ligne'}</Badge></div>
          </div>
          <div className="quiz-correction-list">
            {result.answers.map((answer, index) => (
              <div className="quiz-correction-item" key={answer.questionId}>
                <strong>{index + 1}. {answer.prompt}</strong>
                <span>Votre reponse : {answer.selectedAnswer || 'Aucune'}</span>
                <span>Correction : {answer.correctAnswer}</span>
                <Badge tone={answer.isCorrect ? 'success' : 'error'}>
                  {answer.isCorrect ? 'Correct' : 'A revoir'}
                </Badge>
              </div>
            ))}
          </div>
          <Button iconLeft={<RotateCcw size={16} />} onClick={onRestart}>
            Nouvelle session
          </Button>
        </div>
      </section>

      <section className="lab-panel">
        <div className="lab-panel-header">
          <div>
            <p className="as-eyebrow">Classement</p>
            <h2>Historique local</h2>
          </div>
          <Trophy size={20} aria-hidden="true" />
        </div>
        <div className="lab-panel-body">
          <div className="quiz-history-table">
            {ranking.length === 0 && <span>Aucun resultat precedent.</span>}
            {ranking.map((item, index) => (
              <div className="quiz-history-row" key={item.id}>
                <span>{index + 1}. {modeLabels[item.mode]} - {difficultyLabels[item.difficulty]}</span>
                <Badge tone="info">{item.score}/{item.total}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

