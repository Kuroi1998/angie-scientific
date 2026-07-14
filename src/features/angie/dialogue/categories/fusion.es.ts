import type { DialogueBank } from '../dialogue.types';

export const fusionEs: DialogueBank = {
  success: [
    { id: 'fusion.success.1', text: 'Bonita reaccion!', emotion: 'happy' },
    { id: 'fusion.success.2', text: 'Funciona, bien hecho.', emotion: 'proud' },
    { id: 'fusion.success.3', text: 'Reaccion estable, buena eleccion de reactivos.', emotion: 'happy' },
    { id: 'fusion.success.4', text: 'Ahi tienes un resultado limpio.', emotion: 'proud' },
  ],
  unstable: [
    { id: 'fusion.unstable.1', text: 'Esta combinacion no es estable.', emotion: 'thinking' },
    { id: 'fusion.unstable.2', text: 'No hay reaccion viable aqui, prueba otro par.', emotion: 'thinking' },
    { id: 'fusion.unstable.3', text: 'Estos dos reactivos no encajan. Intenta con otros elementos.', emotion: 'curious' },
  ],
  selectionTip: [
    { id: 'fusion.selectionTip.1', text: 'Elige dos elementos para lanzar el calculo de la reaccion.', emotion: 'attentive' },
  ],
};
