import type { DialogueBank } from '../dialogue.types';

export const physchemFr: DialogueBank = {
  phaseChanged: [
    { id: 'physchem.phaseChanged.1', text: 'A cette temperature et pression, observe dans quelle zone du diagramme tu te trouves.', emotion: 'explaining' },
    { id: 'physchem.phaseChanged.2', text: 'Le point triple est un endroit interessant a chercher sur ce diagramme.', emotion: 'curious' },
  ],
  graphTip: [
    { id: 'physchem.graphTip.1', text: 'Tu peux survoler la courbe pour lire les valeurs exactes.', emotion: 'attentive' },
  ],
};
