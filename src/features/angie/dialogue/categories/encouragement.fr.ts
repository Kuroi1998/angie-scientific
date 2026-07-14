import type { DialogueBank } from '../dialogue.types';

export const encouragementFr: DialogueBank = {
  general: [
    { id: 'encouragement.general.1', text: 'Tu t’en sors bien, continue a explorer.', emotion: 'encouraging' },
    { id: 'encouragement.general.2', text: 'Prends ton temps, il n’y a pas d’urgence a comprendre vite.', emotion: 'encouraging' },
  ],
  afterError: [
    { id: 'encouragement.afterError.1', text: 'Ce n’est pas grave, les erreurs font partie de l’apprentissage.', emotion: 'encouraging' },
    { id: 'encouragement.afterError.2', text: 'Retente, tu es sur la bonne voie.', emotion: 'encouraging' },
  ],
};
