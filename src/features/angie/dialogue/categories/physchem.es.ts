import type { DialogueBank } from '../dialogue.types';

export const physchemEs: DialogueBank = {
  phaseChanged: [
    { id: 'physchem.phaseChanged.1', text: 'A esta temperatura y presion, observa en que zona del diagrama estas.', emotion: 'explaining' },
    { id: 'physchem.phaseChanged.2', text: 'El punto triple es un lugar interesante para buscar en este diagrama.', emotion: 'curious' },
  ],
  graphTip: [
    { id: 'physchem.graphTip.1', text: 'Puedes pasar el cursor sobre la curva para leer los valores exactos.', emotion: 'attentive' },
  ],
};
