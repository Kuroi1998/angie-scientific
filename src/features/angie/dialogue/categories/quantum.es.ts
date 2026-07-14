import type { DialogueBank } from '../dialogue.types';

export const quantumEs: DialogueBank = {
  orbitalChanged: [
    { id: 'quantum.orbitalChanged.1', text: 'Este orbital tiene una geometria particular. Fijate donde se concentra la densidad electronica.', emotion: 'curious' },
    { id: 'quantum.orbitalChanged.2', text: 'Cuanto mas crece n, mas se extiende el orbital. Prueba a comparar dos valores de n.', emotion: 'explaining' },
  ],
  viewModeChanged: [
    { id: 'quantum.viewModeChanged.1', text: 'El modo densidad muestra la probabilidad de encontrar al electron.', emotion: 'explaining' },
    { id: 'quantum.viewModeChanged.2', text: 'El modo fase distingue los lobulos positivos y negativos de la funcion de onda.', emotion: 'thinking' },
  ],
};
