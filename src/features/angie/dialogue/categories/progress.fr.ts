import type { DialogueBank } from '../dialogue.types';

export const progressFr: DialogueBank = {
  badgeUnlocked: [
    { id: 'progress.badgeUnlocked.1', text: 'Nouveau badge debloque !', emotion: 'celebrating' },
    { id: 'progress.badgeUnlocked.2', text: 'Un badge de plus dans ta collection.', emotion: 'proud' },
  ],
  levelUp: [
    { id: 'progress.levelUp.1', text: 'Tu progresses bien, continue comme ca.', emotion: 'proud' },
  ],
  streak: [
    { id: 'progress.streak.1', text: 'Belle serie de bonnes reponses.', emotion: 'proud' },
    { id: 'progress.streak.2', text: 'Tu enchaines les succes, impressionnant.', emotion: 'celebrating' },
  ],
};
