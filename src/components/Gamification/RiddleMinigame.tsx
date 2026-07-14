import React, { useEffect, useState } from 'react';
import { Check, HelpCircle, Trophy, X } from 'lucide-react';
import { Alert, Button, Input } from '../../design-system';
import { useMascot } from '../Mascot/useMascot';
import { useUserProgress } from '../useUserProgress';
import type { Riddle } from '../../data/educational/models';
import { ParticleEngine } from '../../services/Visuals/ParticleEngine';

const riddles: Riddle[] = [
  {
    id: 'r1',
    category: 'daily_use',
    difficulty: 'easy',
    questionFr: 'Je suis le gaz qui fait voler les ballons. Qui suis-je ?',
    questionEs: 'Soy el gas que hace volar globos. Quien soy?',
    answerElementSymbol: 'He',
    explanationFr: "L'helium (He) est plus leger que l'air.",
    explanationEs: 'El helio (He) es mas ligero que el aire.',
  },
  {
    id: 'r2',
    category: 'property',
    difficulty: 'medium',
    questionFr: 'Je suis le seul metal liquide a temperature ambiante.',
    questionEs: 'Soy el unico metal liquido a temperatura ambiente.',
    answerElementSymbol: 'Hg',
    explanationFr: 'Le mercure (Hg) est un metal liquide.',
    explanationEs: 'El mercurio (Hg) es un metal liquido.',
  },
];

export const RiddleMinigame: React.FC = () => {
  const { profile, progress, solveRiddle } = useUserProgress();
  const { showMessage } = useMascot();
  const [currentRiddle, setCurrentRiddle] = useState<Riddle | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  useEffect(() => {
    if (!progress || status === 'correct') return;
    setCurrentRiddle(riddles.find((riddle) => !progress.solvedRiddles.includes(riddle.id)) ?? null);
  }, [progress, status]);

  if (!progress) return null;
  if (!currentRiddle && progress.solvedRiddles.length >= riddles.length) {
    return (
      <Alert title="Champion des devinettes" tone="success">
        <Trophy size={18} aria-hidden="true" /> Toutes les enigmes actuelles sont resolues.
      </Alert>
    );
  }
  if (!currentRiddle) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const correct = userAnswer.trim().toLowerCase() === currentRiddle.answerElementSymbol.toLowerCase();
    if (!correct) {
      setStatus('wrong');
      showMessage('Cherche encore dans le tableau periodique.', 3000, 'thinking');
      window.setTimeout(() => setStatus('idle'), 1800);
      return;
    }
    setStatus('correct');
    if (profile?.reducedMotion !== true) ParticleEngine.getInstance().fireFusionSuccess();
    showMessage(currentRiddle.explanationFr, 5000, 'impressed');
    await solveRiddle(currentRiddle.id);
    window.setTimeout(() => {
      setStatus('idle');
      setUserAnswer('');
    }, 2500);
  };

  return (
    <form className="quiz-feedback" onSubmit={submit}>
      <strong><HelpCircle size={18} aria-hidden="true" /> Devinette active</strong>
      <span>{currentRiddle.questionFr}</span>
      <Input
        label="Reponse"
        onChange={(event) => setUserAnswer(event.target.value)}
        placeholder="Symbole, ex: O ou Fe"
        value={userAnswer}
      />
      <Button type="submit">Valider</Button>
      {status === 'correct' && <Alert title="Correct" tone="success"><Check size={16} /> {currentRiddle.explanationFr}</Alert>}
      {status === 'wrong' && <Alert title="Faux" tone="error"><X size={16} /> Essaie encore.</Alert>}
    </form>
  );
};
