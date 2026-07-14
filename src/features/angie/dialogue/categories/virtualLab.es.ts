import type { DialogueBank } from '../dialogue.types';

export const virtualLabEs: DialogueBank = {
  experimentStarted: [
    { id: 'virtualLab.experimentStarted.1', text: 'Experimento lanzado. Observa bien cada paso.', emotion: 'attentive' },
    { id: 'virtualLab.experimentStarted.2', text: 'Vamos alla, sigue el protocolo a tu ritmo.', emotion: 'encouraging' },
  ],
  experimentCompleted: [
    { id: 'virtualLab.experimentCompleted.1', text: 'Experimento terminado, bien hecho.', emotion: 'proud' },
    { id: 'virtualLab.experimentCompleted.2', text: 'Protocolo completado con exito.', emotion: 'happy' },
    { id: 'virtualLab.experimentCompleted.3', text: 'Buena manipulacion, de principio a fin.', emotion: 'proud' },
  ],
};
