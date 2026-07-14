import type { DialogueBank } from '../dialogue.types';

export const questsFr: DialogueBank = {
  opened: [
    { id: 'quests.opened.1', text: 'Voici tes quetes en cours. Laquelle veux-tu avancer ?', emotion: 'curious' },
  ],
  completed: [
    { id: 'quests.completed.1', text: 'Quete terminee, felicitations !', emotion: 'celebrating' },
    { id: 'quests.completed.2', text: 'Une quete de plus a ton actif.', emotion: 'proud' },
  ],
};
