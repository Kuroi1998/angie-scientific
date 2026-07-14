import type { DialogueBank } from '../dialogue.types';

export const idleFr: DialogueBank = {
  shortIdle: [
    { id: 'idle.shortIdle.1', text: 'Toujours la ? Je peux t’expliquer ce que tu vois si tu veux.', emotion: 'attentive' },
    { id: 'idle.shortIdle.2', text: 'Besoin d’un indice sur cette page ?', emotion: 'curious' },
  ],
  longIdle: [
    { id: 'idle.longIdle.1', text: 'Je reste discrete, clique sur moi quand tu veux reprendre.', emotion: 'sleepy' },
  ],
};
