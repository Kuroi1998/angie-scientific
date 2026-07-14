import type { DialogueBank } from '../dialogue.types';

export const greetingsEs: DialogueBank = {
  firstVisit: [
    { id: 'greetings.firstVisit.1', text: 'Bienvenido, soy Angie, tu asistente cientifica. Estare aqui para ayudarte a explorar, entender y experimentar.', emotion: 'happy' },
    { id: 'greetings.firstVisit.2', text: 'Hola, me llamo Angie. Si tienes dudas de quimica, fisica o elementos, no dudes en preguntar.', emotion: 'attentive' },
    { id: 'greetings.firstVisit.3', text: 'Un gusto conocerte. Explora a tu ritmo, estare disponible sin agobiarte.', emotion: 'happy' },
    { id: 'greetings.firstVisit.4', text: 'Bienvenido a Angie Scientific. Haz clic en mi cuando quieras charlar o pedir ayuda.', emotion: 'encouraging' },
  ],
  returning: [
    { id: 'greetings.returning.1', text: 'Que bueno verte de nuevo. Seguimos donde lo dejamos?', emotion: 'happy' },
    { id: 'greetings.returning.2', text: 'Hola otra vez. Quiza hoy te espera un nuevo experimento.', emotion: 'curious' },
    { id: 'greetings.returning.3', text: 'Hola, listo para seguir explorando?', emotion: 'attentive' },
  ],
  longAbsence: [
    { id: 'greetings.longAbsence.1', text: 'Cuanto tiempo! Me alegra verte de vuelta.', emotion: 'happy' },
    { id: 'greetings.longAbsence.2', text: 'Bienvenido de nuevo. Todavia queda mucho por descubrir.', emotion: 'encouraging' },
    { id: 'greetings.longAbsence.3', text: 'Que alegria verte por aqui otra vez. Seguimos?', emotion: 'attentive' },
  ],
};
