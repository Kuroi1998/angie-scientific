import type { DialogueBank } from '../dialogue.types';

export const progressEs: DialogueBank = {
  badgeUnlocked: [
    { id: 'progress.badgeUnlocked.1', text: 'Nueva insignia desbloqueada!', emotion: 'celebrating' },
    { id: 'progress.badgeUnlocked.2', text: 'Una insignia mas para tu coleccion.', emotion: 'proud' },
  ],
  levelUp: [
    { id: 'progress.levelUp.1', text: 'Vas muy bien, sigue asi.', emotion: 'proud' },
  ],
  streak: [
    { id: 'progress.streak.1', text: 'Bonita racha de respuestas correctas.', emotion: 'proud' },
    { id: 'progress.streak.2', text: 'Encadenas los aciertos, impresionante.', emotion: 'celebrating' },
  ],
};
