import type { DialogueBank } from '../dialogue.types';

export const idleEs: DialogueBank = {
  shortIdle: [
    { id: 'idle.shortIdle.1', text: 'Sigues ahi? Puedo explicarte lo que estas viendo si quieres.', emotion: 'attentive' },
    { id: 'idle.shortIdle.2', text: 'Necesitas una pista sobre esta pagina?', emotion: 'curious' },
  ],
  longIdle: [
    { id: 'idle.longIdle.1', text: 'Me quedo discreta, haz clic en mi cuando quieras continuar.', emotion: 'sleepy' },
  ],
};
