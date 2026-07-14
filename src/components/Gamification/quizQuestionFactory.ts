import elementsData from '../../engines/data/elements.json';

import type { LearningDifficulty, QuizQuestion } from './learningTypes';

const ELEMENTS = elementsData as any[];

export function questionCount(difficulty: LearningDifficulty) {
  if (difficulty === 'easy') return 6;
  if (difficulty === 'medium') return 8;
  return 10;
}

export function examDuration(difficulty: LearningDifficulty) {
  if (difficulty === 'easy') return 90;
  if (difficulty === 'medium') return 75;
  return 60;
}

export function generateQuizQuestions(
  difficulty: LearningDifficulty,
  t: (key: string, options?: any) => string,
  language: string
): QuizQuestion[] {
  return Array.from({ length: questionCount(difficulty) }, (_, index) => {
    const element = pick(ELEMENTS);
    const type = pick(['symbol', 'number', 'state', 'category'] as const);
    const langKey = language === 'es' ? 'nameES' : 'nameFR';
    const name = element[langKey] || element.nameFR;

    if (type === 'number') return numberQuestion(element, name, index, t);
    if (type === 'state') return stateQuestion(element, name, index, t);
    if (type === 'category') return categoryQuestion(element, name, index, t);
    return symbolQuestion(element, name, index, t);
  });
}

function symbolQuestion(element: any, name: string, index: number, t: (key: string, options?: any) => string): QuizQuestion {
  return makeQuestion({
    correct: element.s,
    explanation: t('quizFactory.symbol.explanation', { name, symbol: element.s }),
    hint: t('quizFactory.symbol.hint', { firstLetter: element.s[0] }),
    id: `symbol-${element.s}-${index}`,
    options: uniqueOptions(element.s, () => pick(ELEMENTS).s),
    prompt: t('quizFactory.symbol.prompt', { name }),
    topic: t('quizFactory.topics.symbol'),
  });
}

function numberQuestion(element: any, name: string, index: number, t: (key: string, options?: any) => string): QuizQuestion {
  const closeNum = Math.max(1, element.n - 2);
  return makeQuestion({
    correct: String(element.n),
    explanation: t('quizFactory.number.explanation', { name, number: element.n }),
    hint: t('quizFactory.number.hint', { closeNumber: closeNum }),
    id: `number-${element.s}-${index}`,
    options: uniqueOptions(String(element.n), () => String(Math.max(1, element.n + Math.floor(Math.random() * 16 - 8)))),
    prompt: t('quizFactory.number.prompt', { name }),
    topic: t('quizFactory.topics.number'),
  });
}

function stateQuestion(element: any, name: string, index: number, t: (key: string, options?: any) => string): QuizQuestion {
  const stateKey = element.state;
  const translatedState = t(`quizFactory.states.${stateKey}`);
  const fallbackState = translatedState.includes('quizFactory') ? element.state : translatedState;
  
  return makeQuestion({
    correct: fallbackState,
    explanation: t('quizFactory.state.explanation', { name, state: fallbackState }),
    hint: t('quizFactory.state.hint'),
    id: `state-${element.s}-${index}`,
    options: shuffle(['gas', 'liquid', 'solid', 'synthetic'].map(s => t(`quizFactory.states.${s}`))).slice(0, 4),
    prompt: t('quizFactory.state.prompt', { name }),
    topic: t('quizFactory.topics.state'),
  });
}

function categoryQuestion(element: any, name: string, index: number, t: (key: string, options?: any) => string): QuizQuestion {
  const catKey = element.cat;
  const translatedCat = t(`quizFactory.categories.${catKey}`);
  const fallbackCat = translatedCat.includes('quizFactory') ? element.cat : translatedCat;

  return makeQuestion({
    correct: fallbackCat,
    explanation: t('quizFactory.category.explanation', { name, category: fallbackCat }),
    hint: t('quizFactory.category.hint'),
    id: `category-${element.s}-${index}`,
    options: uniqueOptions(fallbackCat, () => {
      const el = pick(ELEMENTS);
      const k = el.cat;
      const tc = t(`quizFactory.categories.${k}`);
      return tc.includes('quizFactory') ? k : tc;
    }),
    prompt: t('quizFactory.category.prompt', { name }),
    topic: t('quizFactory.topics.category'),
  });
}

function makeQuestion(base: Omit<QuizQuestion, 'correctAnswer'> & { correct: string }): QuizQuestion {
  return {
    correctAnswer: base.correct,
    explanation: base.explanation,
    hint: base.hint,
    id: base.id,
    options: shuffle([base.correct, ...base.options.filter((item) => item !== base.correct)]).slice(0, 4),
    prompt: base.prompt,
    topic: base.topic,
  };
}

function uniqueOptions(correct: string, next: () => string) {
  const values = new Set<string>();
  while (values.size < 3) {
    const value = next();
    if (value !== correct) values.add(value);
  }
  return [...values];
}

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}
