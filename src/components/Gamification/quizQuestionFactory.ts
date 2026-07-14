import elementsData from '../../engines/data/elements.json';
import type { ElementType } from '../PeriodicTable/TableGrid';
import type { LearningDifficulty, QuizQuestion } from './learningTypes';

const ELEMENTS = elementsData as ElementType[];
const states: Record<string, string> = {
  gas: 'Gaz',
  liquid: 'Liquide',
  solid: 'Solide',
  synthetic: 'Synthese',
};

const categories: Record<string, string> = {
  'alkali-metal': 'Alcalins',
  'alkaline-earth': 'Alcalino-terreux',
  halogen: 'Halogenes',
  lanthanide: 'Lanthanides',
  metalloid: 'Metalloides',
  'noble-gas': 'Gaz nobles',
  nonmetal: 'Non-metaux',
  'post-transition-metal': 'Metaux pauvres',
  'reactive-nonmetal': 'Non-metaux reactifs',
  'transition-metal': 'Transition',
  unknown: 'Famille incertaine',
};

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

export function generateQuizQuestions(difficulty: LearningDifficulty): QuizQuestion[] {
  return Array.from({ length: questionCount(difficulty) }, (_, index) => {
    const element = pick(ELEMENTS);
    const type = pick(['symbol', 'number', 'state', 'category'] as const);
    if (type === 'number') return numberQuestion(element, index);
    if (type === 'state') return stateQuestion(element, index);
    if (type === 'category') return categoryQuestion(element, index);
    return symbolQuestion(element, index);
  });
}

function symbolQuestion(element: ElementType, index: number): QuizQuestion {
  return makeQuestion({
    correct: element.s,
    explanation: `${element.nameFR} utilise le symbole ${element.s}.`,
    hint: `Le symbole commence par ${element.s[0]}.`,
    id: `symbol-${element.s}-${index}`,
    options: uniqueOptions(element.s, () => pick(ELEMENTS).s),
    prompt: `Quel est le symbole de ${element.nameFR} ?`,
    topic: 'Symboles',
  });
}

function numberQuestion(element: ElementType, index: number): QuizQuestion {
  return makeQuestion({
    correct: String(element.n),
    explanation: `${element.nameFR} porte le numero atomique ${element.n}.`,
    hint: `Il est proche de ${Math.max(1, element.n - 2)} dans le tableau.`,
    id: `number-${element.s}-${index}`,
    options: uniqueOptions(String(element.n), () => String(Math.max(1, element.n + Math.floor(Math.random() * 16 - 8)))),
    prompt: `Quel est le numero atomique de ${element.nameFR} ?`,
    topic: 'Numeros atomiques',
  });
}

function stateQuestion(element: ElementType, index: number): QuizQuestion {
  return makeQuestion({
    correct: states[element.state] ?? element.state,
    explanation: `${element.nameFR} est classe comme ${states[element.state] ?? element.state}.`,
    hint: 'Pense aux conditions ambiantes.',
    id: `state-${element.s}-${index}`,
    options: shuffle(Object.values(states)).slice(0, 4),
    prompt: `Quel est l'etat naturel de ${element.nameFR} ?`,
    topic: 'Etats',
  });
}

function categoryQuestion(element: ElementType, index: number): QuizQuestion {
  const correct = categories[element.cat] ?? element.cat;
  return makeQuestion({
    correct,
    explanation: `${element.nameFR} appartient a la famille ${correct}.`,
    hint: 'Regarde sa colonne ou son bloc dans le tableau.',
    id: `category-${element.s}-${index}`,
    options: uniqueOptions(correct, () => {
      const element = pick(ELEMENTS);
      return categories[element.cat] ?? element.cat;
    }),
    prompt: `A quelle famille appartient ${element.nameFR} ?`,
    topic: 'Familles',
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
