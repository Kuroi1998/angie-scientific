import type { DialogueBank } from '../dialogue.types';

export const virtualLabFr: DialogueBank = {
  experimentStarted: [
    { id: 'virtualLab.experimentStarted.1', text: 'Experience lancee. Observe bien chaque etape.', emotion: 'attentive' },
    { id: 'virtualLab.experimentStarted.2', text: 'C’est parti, suis le protocole a ton rythme.', emotion: 'encouraging' },
  ],
  experimentCompleted: [
    { id: 'virtualLab.experimentCompleted.1', text: 'Experience terminee, bien joue.', emotion: 'proud' },
    { id: 'virtualLab.experimentCompleted.2', text: 'Protocole complete avec succes.', emotion: 'happy' },
    { id: 'virtualLab.experimentCompleted.3', text: 'Belle manipulation, du debut a la fin.', emotion: 'proud' },
  ],
};
