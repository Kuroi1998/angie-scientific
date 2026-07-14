import type { DialogueBank } from '../dialogue.types';

export const encouragementEs: DialogueBank = {
  general: [
    { id: 'encouragement.general.1', text: 'Lo estas haciendo bien, sigue explorando.', emotion: 'encouraging' },
    { id: 'encouragement.general.2', text: 'Tomate tu tiempo, no hay prisa por entenderlo todo rapido.', emotion: 'encouraging' },
  ],
  afterError: [
    { id: 'encouragement.afterError.1', text: 'No pasa nada, los errores forman parte de aprender.', emotion: 'encouraging' },
    { id: 'encouragement.afterError.2', text: 'Intentalo de nuevo, vas por buen camino.', emotion: 'encouraging' },
  ],
};
