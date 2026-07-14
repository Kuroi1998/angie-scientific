import type { DialogueBank } from '../dialogue.types';

export const quizEs: DialogueBank = {
  sessionStartTraining: [
    { id: 'quiz.sessionStartTraining.1', text: 'Entrenamiento iniciado. Tomate tu tiempo para leer las correcciones.', emotion: 'happy' },
    { id: 'quiz.sessionStartTraining.2', text: 'Modo entrenamiento: sin presion, aprendemos equivocandonos.', emotion: 'encouraging' },
  ],
  sessionStartExam: [
    { id: 'quiz.sessionStartExam.1', text: 'Examen iniciado, vigila el cronometro.', emotion: 'attentive' },
    { id: 'quiz.sessionStartExam.2', text: 'Empieza el examen. Mantente concentrado.', emotion: 'attentive' },
  ],
  sessionExcellent: [
    { id: 'quiz.sessionExcellent.1', text: 'Excelente resultado, sesion dominada.', emotion: 'proud' },
    { id: 'quiz.sessionExcellent.2', text: 'Muy buen puntaje, dominas bien este tema.', emotion: 'celebrating' },
    { id: 'quiz.sessionExcellent.3', text: 'Impresionante, sigue asi.', emotion: 'proud' },
  ],
  correctAnswer: [
    { id: 'quiz.correctAnswer.1', text: 'Respuesta correcta!', emotion: 'happy' },
    { id: 'quiz.correctAnswer.2', text: 'Exacto, bien hecho.', emotion: 'proud' },
    { id: 'quiz.correctAnswer.3', text: 'Justo eso.', emotion: 'happy' },
  ],
  wrongAnswer: [
    { id: 'quiz.wrongAnswer.1', text: 'No del todo. Busca otra vez en la tabla periodica.', emotion: 'thinking' },
    { id: 'quiz.wrongAnswer.2', text: 'Casi. Relee la pista e intenta de nuevo.', emotion: 'encouraging' },
  ],
};
