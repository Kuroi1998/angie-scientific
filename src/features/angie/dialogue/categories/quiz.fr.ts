import type { DialogueBank } from '../dialogue.types';

export const quizFr: DialogueBank = {
  sessionStartTraining: [
    { id: 'quiz.sessionStartTraining.1', text: 'Entrainement lance. Prends le temps de lire les corrections.', emotion: 'happy' },
    { id: 'quiz.sessionStartTraining.2', text: 'Mode entrainement : aucune pression, on apprend en se trompant.', emotion: 'encouraging' },
  ],
  sessionStartExam: [
    { id: 'quiz.sessionStartExam.1', text: 'Examen lance, surveille le chronometre.', emotion: 'attentive' },
    { id: 'quiz.sessionStartExam.2', text: 'C’est parti pour l’examen. Reste concentre.', emotion: 'attentive' },
  ],
  sessionExcellent: [
    { id: 'quiz.sessionExcellent.1', text: 'Excellent resultat, session maitrisee.', emotion: 'proud' },
    { id: 'quiz.sessionExcellent.2', text: 'Tres beau score, tu maitrises bien ce sujet.', emotion: 'celebrating' },
    { id: 'quiz.sessionExcellent.3', text: 'Impressionnant, continue comme ca.', emotion: 'proud' },
  ],
  correctAnswer: [
    { id: 'quiz.correctAnswer.1', text: 'Bonne reponse !', emotion: 'happy' },
    { id: 'quiz.correctAnswer.2', text: 'Exact, bien joue.', emotion: 'proud' },
    { id: 'quiz.correctAnswer.3', text: 'Tout a fait ca.', emotion: 'happy' },
  ],
  wrongAnswer: [
    { id: 'quiz.wrongAnswer.1', text: 'Pas tout a fait. Cherche encore dans le tableau periodique.', emotion: 'thinking' },
    { id: 'quiz.wrongAnswer.2', text: 'Presque. Relis l’indice et retente.', emotion: 'encouraging' },
  ],
};
