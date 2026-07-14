import type { DialogueBank } from '../dialogue.types';

export const questsEs: DialogueBank = {
  opened: [
    { id: 'quests.opened.1', text: 'Estas son tus misiones en curso. Cual quieres avanzar?', emotion: 'curious' },
  ],
  completed: [
    { id: 'quests.completed.1', text: 'Mision completada, felicidades!', emotion: 'celebrating' },
    { id: 'quests.completed.2', text: 'Una mision mas a tu haber.', emotion: 'proud' },
  ],
};
