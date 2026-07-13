import React, { useState, useEffect } from 'react';
import elementsData from '../../engines/data/elements.json';
import type { ElementType } from '../PeriodicTable/TableGrid';
import { useLanguage } from '../../hooks/useLanguage';
import { ParticleEngine } from '../../services/Visuals/ParticleEngine';
import { useMascot } from '../Mascot/MascotContext';
import { useUserProgress } from '../UserProgressProvider';
import { Brain, Clock } from 'lucide-react';

const ELEMENTS = elementsData as ElementType[];

type QuizModeType = 'training' | 'exam';
type QuestionType = 'symbol' | 'number' | 'phase' | 'category';

interface Question {
  id: number;
  text: { fr: string, es: string };
  options: string[];
  correctAnswer: string;
}

const generateQuestions = (count: number): Question[] => {
  const questions: Question[] = [];
  const questionTypes: QuestionType[] = ['symbol', 'number', 'phase', 'category'];
  
  for (let i = 0; i < count; i++) {
    const el = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    let text = { fr: '', es: '' };
    let correctAnswer = '';
    const distractors = new Set<string>();
    
    if (type === 'symbol') {
      text = { fr: `Quel est le symbole de l'élément : ${el.nameFR} ?`, es: `¿Cuál es el símbolo del elemento : ${el.nameES}?` };
      correctAnswer = el.s;
      while (distractors.size < 3) distractors.add(ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)].s);
    } else if (type === 'number') {
      text = { fr: `Quel est le numéro atomique (Z) de ${el.nameFR} ?`, es: `¿Cuál es el número atómico (Z) de ${el.nameES}?` };
      correctAnswer = el.n.toString();
      while (distractors.size < 3) {
        const fakeN = Math.max(1, el.n + Math.floor(Math.random() * 20 - 10));
        if (fakeN !== el.n) distractors.add(fakeN.toString());
      }
    } else if (type === 'phase') {
      text = { fr: `Quel est l'état naturel (à température ambiante) de ${el.nameFR} ?`, es: `¿Cuál es el estado natural (a temperatura ambiente) de ${el.nameES}?` };
      const phases = ['solid', 'liquid', 'gas'];
      correctAnswer = el.state;
      phases.filter(p => p !== el.state).forEach(p => distractors.add(p));
      distractors.add('synthetic'); // dummy phase for 4th option
    } else if (type === 'category') {
      text = { fr: `À quelle famille appartient ${el.nameFR} ?`, es: `¿A qué familia pertenece ${el.nameES}?` };
      correctAnswer = el.cat;
      while (distractors.size < 3) {
        const randCat = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)].cat;
        if (randCat !== el.cat) distractors.add(randCat);
      }
    }
    
    const options = [correctAnswer, ...Array.from(distractors)].slice(0, 4);
    // Shuffle
    for (let j = options.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [options[j], options[k]] = [options[k], options[j]];
    }

    questions.push({ id: i, text, options, correctAnswer });
  }
  return questions;
};

export const QuizMode: React.FC = () => {
  const { language } = useLanguage();
  const { showMessage } = useMascot();
  const { profile } = useUserProgress();
  
  const [mode, setMode] = useState<'menu' | QuizModeType | 'results'>('menu');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const startGame = (selectedMode: QuizModeType) => {
    setMode(selectedMode);
    setQuestions(generateQuestions(10));
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    if (selectedMode === 'exam') {
      setTimeLeft(60);
      showMessage(language === 'fr' ? "C'est parti pour l'examen ! Fais vite !" : "¡Empieza el examen! ¡Date prisa!", 4000, 'impressed');
    } else {
      showMessage(language === 'fr' ? "Mode Entraînement. Prends ton temps." : "Modo Entrenamiento. Tómate tu tiempo.", 4000, 'happy');
    }
  };

  useEffect(() => {
    if (mode === 'exam' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (mode === 'exam' && timeLeft <= 0) {
      endGame();
    }
  }, [mode, timeLeft]);

  const endGame = () => {
    setMode('results');
    if (profile?.reducedMotion !== true && score >= 7) {
      ParticleEngine.getInstance().fireFusionSuccess();
      showMessage(language === 'fr' ? "Excellent résultat ! Tu as assuré !" : "¡Excelente resultado! ¡Lo lograste!", 5000, 'happy');
    } else if (score < 5) {
      showMessage(language === 'fr' ? "Tu peux faire mieux ! Réessaie !" : "¡Puedes hacerlo mejor! ¡Inténtalo de nuevo!", 5000, 'encouraging');
    }
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; // Prevent double click
    setSelectedAnswer(answer);
    
    const correct = answer === questions[currentIndex].correctAnswer;
    if (correct) {
      setScore(s => s + 1);
    } else {
      if (mode === 'exam') {
        setTimeLeft(t => Math.max(0, t - 5)); // 5 sec penalty
        if (profile?.reducedMotion !== true) {
          ParticleEngine.getInstance().fireReactionExplosion();
        }
      }
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(i => i + 1);
        setSelectedAnswer(null);
      } else {
        endGame();
      }
    }, 1000);
  };

  if (mode === 'menu') {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <Brain size={64} style={{ color: 'var(--neon-cyan)', margin: '0 auto 20px' }} />
        <h2 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '28px', marginBottom: '10px' }}>
          {language === 'fr' ? "Académie Scientifique" : "Academia Científica"}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
          {language === 'fr' ? "Teste tes connaissances sur les 118 éléments !" : "¡Prueba tus conocimientos sobre los 118 elementos!"}
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button 
            onClick={() => startGame('training')}
            style={{ padding: '16px 32px', background: 'rgba(0, 243, 255, 0.1)', border: '2px solid var(--neon-cyan)', borderRadius: '12px', color: 'var(--neon-cyan)', fontSize: '18px', cursor: 'pointer', fontFamily: 'var(--font-title)' }}>
            {language === 'fr' ? "Mode Entraînement" : "Modo Entrenamiento"}
            <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
              {language === 'fr' ? "10 Questions • Sans Limite" : "10 Preguntas • Sin Límite"}
            </div>
          </button>
          
          <button 
            onClick={() => startGame('exam')}
            style={{ padding: '16px 32px', background: 'rgba(255, 0, 127, 0.1)', border: '2px solid var(--neon-magenta)', borderRadius: '12px', color: 'var(--neon-magenta)', fontSize: '18px', cursor: 'pointer', fontFamily: 'var(--font-title)' }}>
            {language === 'fr' ? "Mode Examen" : "Modo Examen"}
            <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
              {language === 'fr' ? "10 Questions • 60s • Pénalités" : "10 Preguntas • 60s • Penalizaciones"}
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'results') {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-title)', color: score >= 7 ? 'var(--neon-green)' : 'var(--neon-cyan)', fontSize: '32px' }}>
          {language === 'fr' ? "Résultats" : "Resultados"}
        </h2>
        <div style={{ fontSize: '64px', fontWeight: 'bold', margin: '20px 0', color: '#fff' }}>
          {score} / 10
        </div>
        <button 
          onClick={() => setMode('menu')}
          style={{ padding: '12px 24px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
          {language === 'fr' ? "Retour au Menu" : "Volver al Menú"}
        </button>
      </div>
    );
  }

  const q = questions[currentIndex];

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          Question {currentIndex + 1} / {questions.length}
        </div>
        {mode === 'exam' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: timeLeft <= 10 ? 'var(--neon-magenta)' : 'var(--neon-cyan)', fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 'bold' }}>
            <Clock size={24} /> {timeLeft}s
          </div>
        )}
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          Score: {score}
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '16px', border: '1px solid var(--glass-border)', marginBottom: '20px', minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h3 style={{ fontSize: '24px', color: '#fff', textAlign: 'center', margin: 0 }}>
          {language === 'fr' ? q.text.fr : q.text.es}
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {q.options.map((opt, i) => {
          let btnBg = 'rgba(255, 255, 255, 0.05)';
          let btnBorder = '1px solid var(--glass-border)';
          let btnColor = '#fff';

          if (selectedAnswer !== null) {
            if (opt === q.correctAnswer) {
              btnBg = 'rgba(57, 255, 20, 0.2)';
              btnBorder = '1px solid var(--neon-green)';
              btnColor = 'var(--neon-green)';
            } else if (opt === selectedAnswer) {
              btnBg = 'rgba(255, 0, 127, 0.2)';
              btnBorder = '1px solid var(--neon-magenta)';
              btnColor = 'var(--neon-magenta)';
            }
          }

          return (
            <button
              key={i}
              disabled={selectedAnswer !== null}
              onClick={() => handleAnswer(opt)}
              style={{
                padding: '20px',
                background: btnBg,
                border: btnBorder,
                borderRadius: '12px',
                color: btnColor,
                fontSize: '18px',
                cursor: selectedAnswer === null ? 'pointer' : 'default',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-main)'
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};
