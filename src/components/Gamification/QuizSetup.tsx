import { Brain, GraduationCap, HelpCircle } from 'lucide-react';
import { Badge, Button, Select } from '../../design-system';
import type { LearningDifficulty, LearningMode, QuizSessionResult } from './learningTypes';
import { difficultyLabels, modeLabels } from './quizLabels';
import { examDuration, questionCount } from './quizQuestionFactory';

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
  const latest = history[0];
  return (
    <div className="quiz-grid">
      <section className="lab-panel">
        <div className="lab-panel-header">
          <div>
            <p className="as-eyebrow">Selection du mode</p>
            <h2>Session pedagogique</h2>
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
                <strong>{modeLabels[item]}</strong>
                <span>
                  {item === 'training'
                    ? 'Correction calme, indices disponibles, sans limite stricte.'
                    : 'Chronometre, penalites et resultat enregistre.'}
                </span>
              </button>
            ))}
            <button className="quiz-mode-card" onClick={onOpenRiddles} type="button">
              <strong>Devinettes</strong>
              <span>Resoudre une enigme elementaire avec indice et explication.</span>
            </button>
          </div>
          <Select
            label="Difficulte"
            onChange={(event) => onDifficultyChange(event.target.value as LearningDifficulty)}
            options={[
              { label: difficultyLabels.easy, value: 'easy' },
              { label: difficultyLabels.medium, value: 'medium' },
              { label: difficultyLabels.hard, value: 'hard' },
            ]}
            value={difficulty}
          />
          <Button iconLeft={<Brain size={16} />} onClick={onStart}>
            Commencer
          </Button>
        </div>
      </section>

      <section className="lab-panel">
        <div className="lab-panel-header">
          <div>
            <p className="as-eyebrow">Apercu</p>
            <h2>Contrat de session</h2>
          </div>
          <Badge tone={mode === 'exam' ? 'warning' : 'info'}>{modeLabels[mode]}</Badge>
        </div>
        <div className="lab-panel-body">
          <div className="lab-readout-grid">
            <div className="lab-readout"><span>Questions</span><Badge>{questionCount(difficulty)}</Badge></div>
            <div className="lab-readout"><span>Temps</span><Badge>{mode === 'exam' ? `${examDuration(difficulty)}s` : 'Libre'}</Badge></div>
            <div className="lab-readout"><span>Dernier score</span><Badge tone="success">{latest ? `${latest.score}/${latest.total}` : '--'}</Badge></div>
          </div>
          <div className="quiz-feedback">
            <strong><GraduationCap size={16} aria-hidden="true" /> Objectif</strong>
            <span>Verifier les acquis, lire la correction et relancer une session plus difficile.</span>
          </div>
          <div className="quiz-feedback">
            <strong><HelpCircle size={16} aria-hidden="true" /> Etats couverts</strong>
            <span>Question active, reponse selectionnee, validation, correction, chrono, resultat et historique.</span>
          </div>
        </div>
      </section>
    </div>
  );
}

