import React, { useState, useEffect } from 'react';
import { useUserProgress } from '../UserProgressProvider';
import { useLanguage } from '../../hooks/useLanguage';
import { useMascot } from '../Mascot/MascotContext';
import { HelpCircle, Check, X, Trophy } from 'lucide-react';
import type { Riddle } from '../../data/educational/models';
import confetti from 'canvas-confetti';

const RIDDLES: Riddle[] = [
  {
    id: 'r1',
    category: 'daily_use',
    difficulty: 'easy',
    questionFr: 'Je suis le gaz qui fait voler les ballons à la fête foraine. Qui suis-je ?',
    questionEs: 'Soy el gas que hace volar los globos en la feria. ¿Quién soy?',
    answerElementSymbol: 'He',
    explanationFr: 'L\'Hélium (He) est plus léger que l\'air !',
    explanationEs: '¡El Helio (He) es más ligero que el aire!'
  },
  {
    id: 'r2',
    category: 'property',
    difficulty: 'medium',
    questionFr: 'Je suis le seul métal liquide à température ambiante. Je servais autrefois dans les thermomètres.',
    questionEs: 'Soy el único metal líquido a temperatura ambiente. Antes me usaban en termómetros.',
    answerElementSymbol: 'Hg',
    explanationFr: 'Le Mercure (Hg) est un métal liquide !',
    explanationEs: '¡El Mercurio (Hg) es un metal líquido!'
  }
];

export const RiddleMinigame: React.FC = () => {
  const { profile, progress, solveRiddle } = useUserProgress();
  const { language } = useLanguage();
  const { showMessage } = useMascot();
  
  const [currentRiddle, setCurrentRiddle] = useState<Riddle | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [status, setStatus] = useState<'idle'|'correct'|'wrong'>('idle');

  useEffect(() => {
    if (progress && status !== 'correct') {
      const unsolved = RIDDLES.find(r => !progress.solvedRiddles.includes(r.id));
      setCurrentRiddle(unsolved || null);
    }
  }, [progress, status]);

  if (!progress) return null;

  if (!currentRiddle && progress.solvedRiddles.length >= RIDDLES.length) {
    return (
      <div style={{ background: 'rgba(57, 255, 20, 0.1)', padding: '16px', borderRadius: '8px', border: '1px solid var(--neon-green)', marginBottom: '20px', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--neon-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '0 0 12px 0' }}>
          <Trophy size={18} />
          {language === 'fr' ? 'Champion des Devinettes !' : '¡Campeón de Acertijos!'}
        </h3>
        <p style={{ margin: '0', fontSize: '14px', color: '#fff' }}>
          {language === 'fr' ? "Tu as résolu toutes les énigmes actuelles." : "Has resuelto todos los acertijos actuales."}
        </p>
      </div>
    );
  }

  if (!currentRiddle) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userAnswer.trim().toLowerCase() === currentRiddle.answerElementSymbol.toLowerCase()) {
      setStatus('correct');
      
      if (profile?.reducedMotion !== true) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }

      showMessage(language === 'fr' ? currentRiddle.explanationFr : currentRiddle.explanationEs, 5000, 'impressed');
      await solveRiddle(currentRiddle.id);
      
      setTimeout(() => {
        setStatus('idle');
        setUserAnswer('');
      }, 5000);
    } else {
      setStatus('wrong');
      showMessage(language === 'fr' ? "Hmm... non, cherche encore dans le tableau périodique !" : "Hmm... ¡no, busca en la tabla periódica!", 3000, 'thinking');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--neon-cyan)', marginBottom: '20px' }}>
      <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--neon-cyan)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 12px 0' }}>
        <HelpCircle size={18} />
        {language === 'fr' ? 'Devinette de la semaine' : 'Acertijo de la semana'}
      </h3>
      <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#fff' }}>
        {language === 'fr' ? currentRiddle.questionFr : currentRiddle.questionEs}
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input 
          type="text" 
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder={language === 'fr' ? 'Symbole (ex: O, Fe...)' : 'Símbolo (ej: O, Fe...)'}
          style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: '#fff', fontFamily: 'var(--font-title)' }}
        />
        <button type="submit" style={{ padding: '8px 16px', borderRadius: '4px', background: 'var(--neon-cyan)', border: 'none', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>
          {language === 'fr' ? 'Valider' : 'Validar'}
        </button>
      </form>
      {status === 'correct' && <div style={{ color: 'var(--neon-green)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={14} /> Correct !</div>}
      {status === 'wrong' && <div style={{ color: 'var(--neon-magenta)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><X size={14} /> Faux, essaie encore !</div>}
    </div>
  );
};
