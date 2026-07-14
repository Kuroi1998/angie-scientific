import type { DialogueBank } from '../dialogue.types';

export const errorsEs: DialogueBank = {
  invalidParameter: [
    { id: 'errors.invalidParameter.1', text: 'Este valor no es valido para este calculo. Revisa la unidad y el rango esperado.', emotion: 'worried' },
  ],
  connectionError: [
    { id: 'errors.connectionError.1', text: 'Fallo la conexion con el servidor. Puedes reintentar, tus datos locales estan a salvo.', emotion: 'worried' },
  ],
  saveFailure: [
    { id: 'errors.saveFailure.1', text: 'El guardado no se completo. Lo reintentare automaticamente en cuanto pueda.', emotion: 'worried' },
  ],
  generic: [
    { id: 'errors.generic.1', text: 'Algo salio mal. Puedes intentar la accion de nuevo.', emotion: 'confused' },
  ],
};
